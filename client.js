async function uploadFile() {
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
		let fileName = file.name;

		const listItem = document.createElement("li");
		listItem.classList.add("file-item");

		const fileText = document.createElement("span");
		if (fileName.length > 20) {
			fileName = fileName.substring(0, 20);
			fileText.textContent = fileName + "...";
		} else {
			fileText.textContent = fileName;
		}
		console.log(file.name);

		// Add a link to view decrypted content
		const link = document.createElement("a");
		link.href = `download/${file.name}`;
		link.textContent = "Download Decrypted Content";
		link.download = file.name;
		link.classList.add("btn", "btn-download");

		listItem.appendChild(fileText);
		listItem.appendChild(link);
		fileList.appendChild(listItem);
	}
}
