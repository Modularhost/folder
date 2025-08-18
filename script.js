import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
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
const db = getFirestore(app);
const storage = getStorage(app);

// Elementos del DOM
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const loginStatus = document.getElementById('loginStatus');
const uploadModal = document.getElementById('uploadModal');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const closeModal = document.getElementById('closeModal');
const status = document.getElementById('status');
const fileUrlLink = document.getElementById('fileUrl');

// Manejar inicio de sesión
loginButton.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    loginStatus.textContent = 'Por favor, ingresa el RUT y la contraseña.';
    loginStatus.classList.add('error');
    return;
  }

  loginButton.disabled = true;
  loginStatus.textContent = 'Iniciando sesión...';

  try {
    // Buscar el email en la colección usernames usando el username
    const usernamesRef = collection(db, 'usernames');
    const q = query(usernamesRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      loginStatus.textContent = 'RUT no encontrado.';
      loginStatus.classList.add('error');
      loginButton.disabled = false;
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const email = userDoc.data().email;

    // Iniciar sesión con email y contraseña
    await signInWithEmailAndPassword(auth, email, password);

    loginStatus.textContent = '¡Inicio de sesión exitoso!';
    loginStatus.classList.remove('error');
    loginStatus.classList.add('success');

    // Mostrar el modal de subida
    loginForm.classList.add('hidden');
    uploadModal.classList.remove('hidden');
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    loginStatus.textContent = 'Error al iniciar sesión: ' + error.message;
    loginStatus.classList.add('error');
    loginButton.disabled = false;
  }
});

// Cerrar el modal
closeModal.addEventListener('click', () => {
  uploadModal.classList.add('hidden');
  loginForm.classList.remove('hidden');
  loginStatus.textContent = '';
  usernameInput.value = '';
  passwordInput.value = '';
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
