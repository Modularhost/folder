const firebaseConfig = {
  apiKey: "AIzaSyDuF7p0X6N8IE19Bqt78LQAp805tMl84Ds",
  authDomain: "modular-app-16bd6.firebaseapp.com",
  projectId: "modular-app-16bd6",
  storageBucket: "modular-app-16bd6.firebasestorage.app",
  messagingSenderId: "1006327040835",
  appId: "1:1006327040835:web:b8b4f510da46514a3d3df6",
  measurementId: "G-GVKBWL9GT9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const auth = firebase.auth();
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const status = document.getElementById('status');
const fileUrlLink = document.getElementById('fileUrl');

// Sign in anonymously
auth.signInAnonymously().catch(error => {
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
  const storageRef = storage.ref('uploads/' + Date.now() + '_' + file.name);

  // Upload file
  const uploadTask = storageRef.put(file);

  uploadTask.on('state_changed',
    snapshot => {
      // Progress (optional)
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
      uploadTask.snapshot.ref.getDownloadURL().then(url => {
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
