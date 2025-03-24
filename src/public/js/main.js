document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const filesList = document.getElementById('files-list');
  
    // Load files when page loads
    loadFiles();
  
    // Handle file upload form submission
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const files = fileInput.files;
      if (files.length === 0) {
        alert('Please select a file to upload');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', files[0]);
  
      fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('File upload failed');
        }
        return response.json();
      })
      .then(data => {
        alert('File uploaded successfully!');
        fileInput.value = '';
        loadFiles(); // Refresh the files list
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to upload file');
      });
    });
  
    // Function to load and display files
    function loadFiles() {
      fetch('/api/files')
        .then(response => response.json())
        .then(files => {
          filesList.innerHTML = '';
          
          if (files.length === 0) {
            filesList.innerHTML = '<p>No files uploaded yet</p>';
            return;
          }
  
          files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.className = 'file-item';
            
            // Format the file size
            const sizeInKB = (file.size / 1024).toFixed(2);
            const formattedSize = sizeInKB > 1024 
              ? (sizeInKB / 1024).toFixed(2) + ' MB' 
              : sizeInKB + ' KB';
            
            // Format the date
            const createdAt = new Date(file.createdAt).toLocaleString();
            
            fileElement.innerHTML = `
              <div class="file-info">
                <strong>${file.name}</strong>
                <span>${formattedSize}</span>
                <span>${createdAt}</span>
              </div>
              <div class="file-actions">
                <a href="/api/files/download/${encodeURIComponent(file.name)}" class="download-btn">Download</a>
              </div>
            `;
            
            filesList.appendChild(fileElement);
          });
        })
        .catch(error => {
          console.error('Error loading files:', error);
          filesList.innerHTML = '<p>Error loading files</p>';
        });
    }
  });