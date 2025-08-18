import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDuF7p0X6N8IE19Bqt78LQAp805tMl84Ds",
  authDomain: "modular-app-16bd6.firebaseapp.com",
  projectId: "modular-app-16bd6",
  storageBucket: "modular-app-16bd6.firebasestorage.app",
  messagingSenderId: "1006327040835",
  appId: "1:1006327040835:web:b8b4f510da46514a3d3df6",
  measurementId: "G-GVKBWL9GT9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Elementos del DOM
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const status = document.getElementById('status');
const fileUrlLink = document.getElementById('fileUrl');

// Iniciar sesión anónima
signInAnonymously(auth).catch(error => {
  console.error('Error en autenticación anónima:', error);
  status.textContent = 'Error al iniciar sesión: ' + error.message;
  status.classList.add('error');
});

// Manejar la subida de archivos
uploadButton.addEventListener('click', () => {
  const file = fileInput.files[0];
  if (!file) {
    status.textContent = 'Por favor, selecciona un archivo.';
    status.classList.add('error');
    return;
  }

  // Validar tipo de archivo
  const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!validTypes.includes(file.type)) {
    status.textContent = 'Solo se permiten imágenes (JPEG/PNG) o archivos PDF.';
    status.classList.add('error');
    return;
  }

  // Deshabilitar botón durante la subida
  uploadButton.disabled = true;
  status.textContent = 'Subiendo...';

  // Crear referencia de almacenamiento
  const storageRef = ref(storage, 'uploads/' + Date.now() + '_' + file.name);

  // Subir archivo
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed',
    snapshot => {
      // Progreso
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      status.textContent = `Subiendo: ${Math.round(progress)}%`;
    },
    error => {
      // Manejo de errores
      console.error('Error al subir:', error);
      status.textContent = 'Error al subir: ' + error.message;
      status.classList.add('error');
      uploadButton.disabled = false;
    },
    () => {
      // Éxito
      getDownloadURL(uploadTask.snapshot.ref).then(url => {
        status.textContent = '¡Archivo subido con éxito!';
        status.classList.remove('error');
        status.classList.add('success');
        fileUrlLink.href = url;
        fileUrlLink.textContent = 'Ver archivo subido';
        fileUrlLink.classList.remove('hidden');
        uploadButton.disabled = false;
        fileInput.value = ''; // Reiniciar input
      });
    }
  );
});
