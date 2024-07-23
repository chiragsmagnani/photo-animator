document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  document.getElementById('processing').style.display = 'block';
  document.getElementById('uploadForm').style.display = 'none';
});

document.getElementById('resultForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append('video', document.getElementById('videoInput').files[0]);

  try {
    const response = await fetch('/uploadVideo', {
      method: 'POST',
      body: formData
    });
    const result = await response.text();
    document.getElementById('result').innerText = 'Video uploaded and processed: ' + result;
  } catch (error) {
    document.getElementById('result').innerText = 'Error uploading video';
  }
});
