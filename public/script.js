document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const resultDiv = document.getElementById('result');
  const loaderDiv = document.getElementById('loader');
  resultDiv.innerHTML = '';
  loaderDiv.style.display = 'block';

  const formData = new FormData();
  formData.append('photos', document.getElementById('fileInput1').files[0]);
  formData.append('photos', document.getElementById('fileInput2').files[0]);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const result = await response.text();
    resultDiv.innerHTML = result;
  } catch (error) {
    resultDiv.innerHTML = 'Error uploading files: ' + error.message;
  } finally {
    loaderDiv.style.display = 'none';
  }
});
