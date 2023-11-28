if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const express = require("express");
const multer = require("multer");
const crypto = require("crypto-js");
const fs = require("fs");
const mime = require("mime");
const path = require("path");

const app = express();

app.use(express.static(__dirname));

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Global key for demonstration purposes
const key = process.env.KEY;

// Serve HTML file
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

// Handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
	const uploadFile = req.file;

	const encryptedFileName = uploadFile.originalname;

	// Perform encryption using crypto-js
	const encryptedFile = crypto.AES.encrypt(
		uploadFile.buffer.toString(),
		key.toString()
	);

	// Save encrypted file to disk (this is just a Proof of Concept)
	fs.writeFileSync(`uploads/${encryptedFileName}`, encryptedFile.toString());

	res.send("File uploaded and encrypted successfully!");
});

// Serve decrypted content
app.get("/download/:filename", (req, res) => {
	try {
		const filename = req.params.filename;
		const encryptedFilePath = path.join(__dirname, "uploads", filename);

		// Check if the encrypted file exists
		if (!fs.existsSync(encryptedFilePath)) {
			return res.status(404).send("Encrypted file not found.");
		}

		// Read the encrypted file from disk
		const encryptedContent = fs.readFileSync(encryptedFilePath, "utf-8");

		// Decrypt the content
		const decryptedContent = crypto.AES.decrypt(encryptedContent, key);

		if (!decryptedContent) {
			throw new Error("Decryption failed");
		}

		const decryptedText = decryptedContent.toString(crypto.enc.Utf8);

		// Determine the MIME type based on the file extension
		const mimeType = mime.getType(filename);

		// Set appropriate headers
		res.setHeader("Content-Type", mimeType || "application/octet-stream");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename=${filename}`
		);

		// Send the decrypted content
		res.end(decryptedText, "binary");
	} catch (error) {
		console.error("Decryption error: ", error.message);
		res.status(500).send("Error decrypting the file.");
	}
});

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`SERVER RUNNING AT PORT ${port}...`);
});
