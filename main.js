import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence, getIdToken } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuF7p0X6N8IE19Bqt78LQAp805tMl84Ds",
  authDomain: "modular-app-16bd6.firebaseapp.com",
  projectId: "modular-app-16bd6",
  storageBucket: "modular-app-16bd6.firebasestorage.app",
  messagingSenderId: "1006327040835",
  appId: "1:1006327040835:web:b8b4f510da46514a3d3df6",
  measurementId: "G-GVKBWL9GT9"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserSessionPersistence)
  .catch(error => console.error('Error al configurar persistencia:', error));

const checkSessionExpiration = async (user) => {
  const sessionDuration = 5 * 60 * 60 * 1000;
  const tokenResult = await user.getIdTokenResult();
  const issuedAtTime = new Date(tokenResult.issuedAtTime).getTime();
  const now = new Date().getTime();
  return (now - issuedAtTime) <= sessionDuration;
};

let inactivityTimeout;
const resetInactivityTimeout = () => {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(async () => {
    try {
      await signOut(auth);
      window.location.href = 'index.html?error=' + encodeURIComponent('La sesión ha expirado por inactividad.');
    } catch (error) {
      console.error('Error al cerrar sesión por inactividad:', error);
    }
  }, 5 * 60 * 60 * 1000);
};

['click', 'mousemove', 'keydown'].forEach(eventType => {
  document.addEventListener(eventType, resetInactivityTimeout);
});

const loadingScreen = document.getElementById('loadingScreen');
const headerDate = document.querySelector('.header-date');
const userName = document.getElementById('userName');
const userLogo = document.getElementById('userLogo');
const userRoleBadge = document.getElementById('user-role');
const sessionStatus = document.getElementById('session-status');
const userDropdown = document.getElementById('userDropdown');
const toggleModeBtn = document.getElementById('toggle-mode');
const content = document.querySelector('.content');
const logoutModal = document.getElementById('logoutModal');
const confirmLogout = document.getElementById('confirmLogout');
const cancelLogout = document.getElementById('cancelLogout');

const updateSessionStatus = (lastLoginTimestamp, sessionStatusElement) => {
  if (!sessionStatusElement) return;
  const now = new Date();
  const lastLogin = lastLoginTimestamp ? new Date(lastLoginTimestamp) : null;
  const diffMinutes = lastLogin ? (now - lastLogin) / (1000 * 60) : 0;
  if (diffMinutes < 5) {
    sessionStatusElement.textContent = 'Conectado';
    sessionStatusElement.style.backgroundColor = '#2f855a';
    sessionStatusElement.style.color = '#ffffff';
  } else {
    const hours = Math.floor(diffMinutes / 60);
    const minutes = Math.floor(diffMinutes % 60);
    let timeString = 'Último acceso: ';
    if (hours > 0) timeString += `${hours} hora${hours > 1 ? 's' : ''} `;
    timeString += `${minutes} min`;
    sessionStatusElement.textContent = timeString;
    sessionStatusElement.style.backgroundColor = '#a0aec0';
    sessionStatusElement.style.color = '#ffffff';
  }
};

async function loadContent(htmlFile, cssFile, jsFile) {
  try {
    if (!content) throw new Error('Elemento .content no encontrado');
    const cleanupEvent = new CustomEvent('moduleCleanup');
    window.dispatchEvent(cleanupEvent);
    content.innerHTML = '';
    const existingStyles = document.querySelectorAll('style[data-submodule]');
    existingStyles.forEach(style => style.remove());
    const existingScripts = document.querySelectorAll('script[data-submodule]');
    existingScripts.forEach(script => script.remove());
    let htmlContent = await (await fetch(htmlFile)).text();
    let cssContent = await (await fetch(cssFile)).text();
    if (!htmlContent || !cssContent) {
      throw new Error('Contenido HTML o CSS vacío');
    }
    content.innerHTML = htmlContent;
    const style = document.createElement('style');
    style.setAttribute('data-submodule', htmlFile);
    style.textContent = cssContent;
    document.head.appendChild(style);
    await new Promise((resolve, reject) => {
      const maxAttempts = 100;
      let attempts = 0;
      const checkDOM = () => {
        if (document.querySelector('.content-container') || content.innerHTML) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Timeout esperando el DOM'));
        } else {
          attempts++;
          setTimeout(checkDOM, 10);
        }
      };
      checkDOM();
    });
    const script = document.createElement('script');
    script.setAttribute('data-submodule', htmlFile);
    script.type = 'module';
    const timestamp = new Date().getTime();
    script.src = `${jsFile}?t=${timestamp}`;
    script.onerror = (error) => {
      content.innerHTML = `<h2>Error</h2><p>No se pudo cargar el script: ${error.message}</p>`;
    };
    document.body.appendChild(script);
  } catch (error) {
    content.innerHTML = `<h2>Error</h2><p>No se pudo cargar el contenido: ${error.message}</p>`;
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    if (!(await checkSessionExpiration(user))) {
      await signOut(auth);
      window.location.href = 'index.html?error=' + encodeURIComponent('La sesión ha expirado. Por favor, inicia sesión nuevamente.');
      return;
    }
    resetInactivityTimeout();
    if (loadingScreen) loadingScreen.style.display = 'flex';
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        throw new Error('No se encontró el documento del usuario');
      }
      const userDoc = userSnap.data();
      let displayName = userDoc.fullName || userDoc.username || user.email.split('@')[0];
      let userIcon = userDoc.gender === 'Hombre' ? 'img/icono-hombre.png' : userDoc.gender === 'Mujer' ? 'img/icono-mujer.png' : 'img/icono-otro.png';
      let userRole = userDoc.role || '';
      let lastLogin = userDoc.lastLogin || null;
      if (userName) userName.textContent = displayName;
      if (userLogo) userLogo.src = userIcon;
      if (userRoleBadge) userRoleBadge.textContent = userRole || 'Sin rol';
      if (sessionStatus) updateSessionStatus(lastLogin, sessionStatus);
      await loadContent(
        'module/folderdrive.html',
        'module/folderdrive.css',
        'module/folderdrive.js'
      );
      if (loadingScreen) loadingScreen.style.display = 'none';
      await getIdToken(user);
      setInterval(() => updateSessionStatus(lastLogin, sessionStatus), 60000);
    } catch (error) {
      if (content) {
        content.innerHTML = `<h2>Error</h2><p>Error al cargar la aplicación: ${error.message}. Contacta al administrador.</p>`;
      }
      if (loadingScreen) loadingScreen.style.display = 'none';
      setTimeout(async () => {
        await signOut(auth);
        window.location.href = 'index.html?error=' + encodeURIComponent(error.message);
      }, 3000);
    }
  } else {
    window.location.href = 'index.html';
  }
});

const updateDate = () => {
  const date = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  if (headerDate) headerDate.textContent = date.toLocaleDateString('es-ES', options);
};
updateDate();

if (toggleModeBtn) {
  toggleModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = toggleModeBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-sun');
      icon.classList.toggle('fa-moon');
    }
  });
}

document.body.classList.remove('dark-mode');
if (toggleModeBtn) {
  toggleModeBtn.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

if (userLogo) {
  userLogo.addEventListener('click', () => {
    if (userDropdown) userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
  });
}

if (userName) {
  userName.addEventListener('click', () => {
    if (userDropdown) userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
  });
}

document.addEventListener('click', (e) => {
  if (userLogo && userName && userDropdown && !userLogo.contains(e.target) && !userName.contains(e.target) && !userDropdown.contains(e.target)) {
    userDropdown.style.display = 'none';
  }
});

document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', () => {
    const action = item.getAttribute('data-action');
    switch (action) {
      case 'personal-data':
        loadContent(
          'module/info/datos-personales/datos-personales.html',
          'module/info/datos-personales/datos-personales.css',
          'module/info/datos-personales/datos-personales.js'
        );
        break;
      case 'change-password':
        loadContent(
          'module/info/cambiar-contrasena/cambiar-contrasena.html',
          'module/info/cambiar-contrasena/cambiar-contrasena.css',
          'module/info/cambiar-contrasena/cambiar-contrasena.js'
        );
        break;
      case 'logout':
        if (logoutModal) logoutModal.style.display = 'flex';
        break;
    }
    if (userDropdown) userDropdown.style.display = 'none';
  });
});

if (confirmLogout) {
  confirmLogout.addEventListener('click', async () => {
    try {
      await signOut(auth);
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  });
}

if (cancelLogout) {
  cancelLogout.addEventListener('click', () => {
    if (logoutModal) logoutModal.style.display = 'none';
  });
}

if (logoutModal) {
  logoutModal.addEventListener('click', (e) => {
    if (e.target === logoutModal) {
      logoutModal.style.display = 'none';
    }
  });
}
