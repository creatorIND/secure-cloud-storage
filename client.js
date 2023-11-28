async function uploadFile() {
	console.log("fn called");
	const fileInput = document.querySelector("input[type='file']");
	const fileList = document.querySelector("#fileList");

	const file = fileInput.files[0];
	if (!file) return;

	const formData = new FormData();
	formData.append("file", file);

	// Upload file to server
	const response = await fetch("/upload", {
		method: "POST",
		body: formData,
	});

	const result = await response.text();
	alert(result);

	if (fileList) {
		const listItem = document.createElement("li");
		listItem.textContent = file.name;

		// Add a link to view decrypted content
		const link = document.createElement("a");
		link.href = `download/${file.name}`;
		link.textContent = "(Download Decrypted Content)";
		link.download = file.name;

		listItem.appendChild(link);
		fileList.appendChild(listItem);
	}
}
