document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = 'Uploading and processing...';

  const formData = new FormData();
  formData.append('photos', document.getElementById('fileInput1').files[0]);
  formData.append('photos', document.getElementById('fileInput2').files[0]);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.text();
    resultDiv.innerHTML = result;
  } catch (error) {
    resultDiv.innerHTML = 'Error uploading files';
  }
});
