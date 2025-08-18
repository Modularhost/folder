import { signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

const { auth, storage } = window.firebaseApp;

const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const status = document.getElementById('status');
const fileUrlLink = document.getElementById('fileUrl');

// Sign in anonymously
signInAnonymously(auth).catch(error => {
  console.error('Error en autenticación anónima:', error);
  status.textContent = 'Error al iniciar sesión: ' + error.message;
  status.classList.add('error');
});

// Handle file upload
uploadButton.addEventListener('click', () => {
  const file = fileInput.files[0];
  if (!file) {
    status.textContent = 'Por favor, selecciona un archivo.';
    status.classList.add('error');
    return;
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!validTypes.includes(file.type)) {
    status.textContent = 'Solo se permiten imágenes (JPEG/PNG) o archivos PDF.';
    status.classList.add('error');
    return;
  }

  // Disable button during upload
  uploadButton.disabled = true;
  status.textContent = 'Subiendo...';

  // Create storage reference
  const storageRef = ref(storage, 'uploads/' + Date.now() + '_' + file.name);

  // Upload file
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed',
    snapshot => {
      // Progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      status.textContent = `Subiendo: ${Math.round(progress)}%`;
    },
    error => {
      // Error handling
      console.error('Error al subir:', error);
      status.textContent = 'Error al subir: ' + error.message;
      status.classList.add('error');
      uploadButton.disabled = false;
    },
    () => {
      // Success
      getDownloadURL(uploadTask.snapshot.ref).then(url => {
        status.textContent = '¡Archivo subido con éxito!';
        status.classList.remove('error');
        status.classList.add('success');
        fileUrlLink.href = url;
        fileUrlLink.textContent = 'Ver archivo subido';
        fileUrlLink.classList.remove('hidden');
        uploadButton.disabled = false;
        fileInput.value = ''; // Reset file input
      });
    }
  );
});
