import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';

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

const particleConfig = {
  light: {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: ['#1a202c', '#3182ce', '#2f855a'] },
      shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
      opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
      size: { value: 3, random: true, anim: { enable: false } },
      line_linked: { enable: true, distance: 150, color: '#1a202c', opacity: 0.4, width: 1 },
      move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
      modes: { grab: { distance: 200, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  },
  dark: {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: ['#e2e8f0', '#63b3ed', '#38a169'] },
      shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
      opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
      size: { value: 3, random: true, anim: { enable: false } },
      line_linked: { enable: true, distance: 150, color: '#e2e8f0', opacity: 0.4, width: 1 },
      move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
      modes: { grab: { distance: 200, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  }
};

const savedMode = localStorage.getItem('theme') || 'dark';
particlesJS('particles-js', particleConfig[savedMode]);

function updateParticles(theme) {
  particlesJS('particles-js', particleConfig[theme]);
}

const toggleModeButton = document.getElementById('toggle-mode');
const body = document.body;
const toggleIcon = toggleModeButton.querySelector('i');
const loginButton = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const closeModalButton = document.getElementById('close-modal');
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('password-toggle');
const capsLockMessage = document.getElementById('caps-lock-message');
const modalLoginButton = document.getElementById('modal-login-btn');

if (savedMode === 'dark') {
  body.classList.add('dark-mode');
  toggleIcon.classList.remove('fa-sun');
  toggleIcon.classList.add('fa-moon');
} else {
  body.classList.remove('dark-mode');
  toggleIcon.classList.remove('fa-moon');
  toggleIcon.classList.add('fa-sun');
}

toggleModeButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDarkMode = body.classList.contains('dark-mode');
  toggleIcon.classList.toggle('fa-sun', !isDarkMode);
  toggleIcon.classList.toggle('fa-moon', isDarkMode);
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  updateParticles(isDarkMode ? 'dark' : 'light');
});

loginButton.addEventListener('click', () => {
  loginModal.classList.remove('hidden');
});

closeModalButton.addEventListener('click', () => {
  loginModal.classList.add('hidden');
  errorMessage.classList.add('hidden');
  loginForm.reset();
  passwordInput.type = 'password';
  passwordToggle.classList.remove('fa-eye-slash');
  passwordToggle.classList.add('fa-eye');
  capsLockMessage.classList.add('hidden');
  modalLoginButton.disabled = false;
  modalLoginButton.classList.remove('loading');
  modalLoginButton.textContent = 'Ingresar';
});

passwordToggle.addEventListener('click', () => {
  const isPasswordVisible = passwordInput.type === 'text';
  passwordInput.type = isPasswordVisible ? 'password' : 'text';
  passwordToggle.classList.toggle('fa-eye', isPasswordVisible);
  passwordToggle.classList.toggle('fa-eye-slash', !isPasswordVisible);
});

passwordInput.addEventListener('input', () => {
  if (!passwordInput.value) {
    passwordInput.type = 'password';
    passwordToggle.classList.remove('fa-eye-slash');
    passwordToggle.classList.add('fa-eye');
  }
});

passwordInput.addEventListener('keydown', (e) => {
  const isCapsLockOn = e.getModifierState('CapsLock');
  capsLockMessage.classList.toggle('hidden', !isCapsLockOn);
});

passwordInput.addEventListener('keyup', (e) => {
  const isCapsLockOn = e.getModifierState('CapsLock');
  capsLockMessage.classList.toggle('hidden', !isCapsLockOn);
});

const submenuData = {
  Implantes: [
    {
      name: 'Cargos Imp',
      icon: 'fa-tooth',
      html: 'module/implantes/cargosimp/cargosimp.html',
      css: 'module/implantes/cargosimp/cargosimp.css',
      js: 'module/implantes/cargosimp/cargosimp.js'
    },
    {
      name: 'Cargos ing',
      icon: 'fa-cog',
      html: 'module/implantes/ingcargos/ingcargos.html',
      css: 'module/implantes/ingcargos/ingcargos.css',
      js: 'module/implantes/ingcargos/ingcargos.js'
    },
    {
      name: 'Pacientes Imp',
      icon: 'fa-user',
      html: 'module/implantes/pacientesimp/pacientesimp.html',
      css: 'module/implantes/pacientesimp/pacientesimp.css',
      js: 'module/implantes/pacientesimp/pacientesimp.js'
    },
    {
      name: 'Cargos Cgn',
      icon: 'fa-box',
      html: 'module/implantes/cargoscgn/cargoscgn.html',
      css: 'module/implantes/cargoscgn/cargoscgn.css',
      js: 'module/implantes/cargoscgn/cargoscgn.js'
    },
    {
      name: 'Pacientes Cgn',
      icon: 'fa-user-injured',
      html: 'module/implantes/pacientescgn/pacientescgn.html',
      css: 'module/implantes/pacientescgn/pacientescgn.css',
      js: 'module/implantes/pacientescgn/pacientescgn.js'
    },
    {
      name: 'Referencias',
      icon: 'fa-link',
      html: 'module/implantes/referencias/referencias.html',
      css: 'module/implantes/referencias/referencias.css',
      js: 'module/implantes/referencias/referencias.js'
    },
    {
      name: 'Paquetización',
      icon: 'fa-boxes',
      html: 'module/implantes/paquetizacion/paquetizacion.html',
      css: 'module/implantes/paquetizacion/paquetizacion.css',
      js: 'module/implantes/paquetizacion/paquetizacion.js'
    },
    {
      name: 'Mantenedor',
      icon: 'fa-warehouse',
      html: 'module/implantes/mantenedor/mantenedor.html',
      css: 'module/implantes/mantenedor/mantenedor.css',
      js: 'module/implantes/mantenedor/mantenedor.js'
    },
    {
      name: 'Tránsito',
      icon: 'fa-route',
      html: 'module/implantes/transito/transito.html',
      css: 'module/implantes/transito/transito.css',
      js: 'module/implantes/transito/transito.js'
    },
    {
      name: 'Consumidos',
      icon: 'fa-box-open',
      html: 'module/implantes/consumidos/consumidos.html',
      css: 'module/implantes/consumidos/consumidos.css',
      js: 'module/implantes/consumidos/consumidos.js'
    },
    {
      name: 'Contenedores',
      icon: 'fa-box-archive',
      html: 'module/implantes/contenedores/contenedores.html',
      css: 'module/implantes/contenedores/contenedores.css',
      js: 'module/implantes/contenedores/contenedores.js'
    },
    {
      name: 'Catálogo',
      icon: 'fa-clipboard',
      html: 'module/implantes/catalogo/catalogo.html',
      css: 'module/implantes/catalogo/catalogo.css',
      js: 'module/implantes/catalogo/catalogo.js'
    },
    {
      name: 'Exportar',
      icon: 'fa-file-export',
      html: 'module/implantes/exportar/exportar.html',
      css: 'module/implantes/exportar/exportar.css',
      js: 'module/implantes/exportar/exportar.js'
    }
  ],
  Consignacion: [
    {
      name: 'Asignación',
      icon: 'fa-tasks',
      html: 'module/consignacion/asignacion/asignacion.html',
      css: 'module/consignacion/asignacion/asignacion.css',
      js: 'module/consignacion/asignacion/asignacion.js'
    },
    {
      name: 'Ficha',
      icon: 'fa-id-card',
      html: 'module/consignacion/ficha/ficha.html',
      css: 'module/consignacion/ficha/ficha.css',
      js: 'module/consignacion/ficha/ficha.js'
    },
    {
      name: 'Lotes',
      icon: 'fa-boxes',
      html: 'module/consignacion/lotes/lotes.html',
      css: 'module/consignacion/lotes/lotes.css',
      js: 'module/consignacion/lotes/lotes.js'
    },
    {
      name: 'Guías',
      icon: 'fa-shipping-fast',
      html: 'module/consignacion/guias/guias.html',
      css: 'module/consignacion/guias/guias.css',
      js: 'module/consignacion/guias/guias.js'
    }
  ]
  ,
  Historico: [
    {
      name: 'Historicos',
      icon: 'fa-database',
      html: 'module/historico/historicos/historicos.html',
      css: 'module/historico/historicos/historicos.css',
      js: 'module/historico/historicos/historicos.js'
    },
    {
      name: 'Diferencias',
      icon: 'fa-exclamation-triangle',
      html: 'module/historico/diferencias/diferencias.html',
      css: 'module/historico/diferencias/diferencias.css',
      js: 'module/historico/diferencias/diferencias.js'
    },
    {
      name: 'Provisión',
      icon: 'fa-file-invoice-dollar',
      html: 'module/historico/provision/provision.html',
      css: 'module/historico/provision/provision.css',
      js: 'module/historico/provision/provision.js'
    },
    {
      name: 'Recap',
      icon: 'fa-clipboard-list',
      html: 'module/historico/recap/recap.html',
      css: 'module/historico/recap/recap.css',
      js: 'module/historico/recap/recap.js'
    }
  ],
  Laboratorio: [
    {
      name: 'Facturación',
      icon: 'fa-money-bill',
      html: 'module/laboratorio/facturacion/facturacion.html',
      css: 'module/laboratorio/facturacion/facturacion.css',
      js: 'module/laboratorio/facturacion/facturacion.js'
    },
    {
      name: 'Detalles',
      icon: 'fa-info-circle',
      html: 'module/laboratorio/detalles/detalles.html',
      css: 'module/laboratorio/detalles/detalles.css',
      js: 'module/laboratorio/detalles/detalles.js'
    }
  ],
  Visualización: [
    {
      name: 'Pacientes',
      icon: 'fa-user-injured',
      html: 'module/vizualizacion/pacientes/pacientes.html',
      css: 'module/vizualizacion/pacientes/pacientes.css',
      js: 'module/vizualizacion/pacientes/pacientes.js'
    },
    {
      name: 'Generales',
      icon: 'fa-boxes-packing',
      html: 'module/vizualizacion/generales/generales.html',
      css: 'module/vizualizacion/generales/generales.css',
      js: 'module/vizualizacion/generales/generales.js'
    },
    {
      name: 'Consigna',
      icon: 'fa-clipboard-check',
      html: 'module/resumen/consigna/consigna.html',
      css: 'module/resumen/consigna/consigna.css',
      js: 'module/resumen/consigna/consigna.js'
    }
  ],
  Prestaciones: [
    {
      name: 'Empresas',
      icon: 'fa-building',
      html: 'module/prestaciones/empresas/empresas.html',
      css: 'module/prestaciones/empresas/empresas.css',
      js: 'module/prestaciones/empresas/empresas.js'
    },
    {
      name: 'Médicos',
      icon: 'fa-user-md',
      html: 'module/prestaciones/medicos/medicos.html',
      css: 'module/prestaciones/medicos/medicos.css',
      js: 'module/prestaciones/medicos/medicos.js'
    },
    {
      name: 'Previsiones',
      icon: 'fa-shield-alt',
      html: 'module/prestaciones/previsiones/previsiones.html',
      css: 'module/prestaciones/previsiones/previsiones.css',
      js: 'module/prestaciones/previsiones/previsiones.js'
    },
    {
      name: 'Áreas Clínicas',
      icon: 'fa-hospital',
      html: 'module/prestaciones/areas-clinicas/areas-clinicas.html',
      css: 'module/prestaciones/areas-clinicas/areas-clinicas.css',
      js: 'module/prestaciones/areas-clinicas/areas-clinicas.js'
    },
    {
      name: 'CTS Proveedores',
      icon: 'fa-truck-loading',
      html: 'module/prestaciones/cts-proveedores/cts-proveedores.html',
      css: 'module/prestaciones/cts-proveedores/cts-proveedores.css',
      js: 'module/prestaciones/cts-proveedores/cts-proveedores.js'
    },
    {
      name: 'CTS Clínico',
      icon: 'fa-stethoscope',
      html: 'module/prestaciones/cts-clinico/cts-clinico.html',
      css: 'module/prestaciones/cts-clinico/cts-clinico.css',
      js: 'module/prestaciones/cts-clinico/cts-clinico.js'
    }
  ],
  Herramientas: [
    {
      name: 'Presupuesto',
      icon: 'fa-file-invoice-dollar',
      html: 'module/herramientas/presupuesto/presupuesto.html',
      css: 'module/herramientas/presupuesto/presupuesto.css',
      js: 'module/herramientas/presupuesto/presupuesto.js'
    },
    {
      name: 'Lector',
      icon: 'fa-file-code',
      html: 'module/herramientas/lector/lector.html',
      css: 'module/herramientas/lector/lector.css',
      js: 'module/herramientas/lector/lector.js'
    },
    {
      name: 'DTE',
      icon: 'fa-file-invoice',
      html: 'module/herramientas/dte/dte.html',
      css: 'module/herramientas/dte/dte.css',
      js: 'module/herramientas/dte/dte.js'
    }
  ],
  Importacion: [
    {
      name: 'Pabellones',
      icon: 'fa-notes-medical',
      html: 'module/importacion/reportepabellon/reportepabellon.html',
      css: 'module/importacion/reportepabellon/reportepabellon.css',
      js: 'module/importacion/reportepabellon/reportepabellon.js'
    },
    {
      name: 'OC',
      icon: 'fa-shopping-cart',
      html: 'module/importacion/ordenes-compra/ordenes-compra.html',
      css: 'module/importacion/ordenes-compra/ordenes-compra.css',
      js: 'module/importacion/ordenes-compra/ordenes-compra.js'
    },
    {
      name: 'Medtronic',
      icon: 'fa-file-medical',
      html: 'module/importacion/medtronic/medtronic.html',
      css: 'module/importacion/medtronic/medtronic.css',
      js: 'module/importacion/medtronic/medtronic.js'
    }
  ],
  Apuntes: [
    {
      name: 'Notas',
      icon: 'fa-sticky-note',
      html: 'module/apuntes/notas/notas.html',
      css: 'module/apuntes/notas/notas.css',
      js: 'module/apuntes/notas/notas.js'
    },
    {
      name: 'Bloc',
      icon: 'fa-calendar',
      html: 'module/apuntes/bloc/bloc.html',
      css: 'module/apuntes/bloc/bloc.css',
      js: 'module/apuntes/bloc/bloc.js'
    }
  ],
  Usuarios: [
    {
      name: 'Registros',
      icon: 'fa-user-plus',
      html: 'module/usuarios/registros/registros.html',
      css: 'module/usuarios/registros/registros.css',
      js: 'module/usuarios/registros/registros.js'
    }
  ],
  Migración: [
    {
      name: 'Base de implantes',
      icon: 'fa-upload',
      html: 'module/completar/cargar/cargar.html',
      css: 'module/completar/cargar/cargar.css',
      js: 'module/completar/cargar/cargar.js'
    },
    {
      name: 'Historial de pacientes',
      icon: 'fa-upload',
      html: 'module/completar/actualizar/actualizar.html',
      css: 'module/completar/actualizar/actualizar.css',
      js: 'module/completar/actualizar/actualizar.js'
    },
    {
      name: 'Base de Consignación',
      icon: 'fa-upload',
      html: 'module/completar/integrar/integrar.html',
      css: 'module/completar/integrar/integrar.css',
      js: 'module/completar/integrar/integrar.js'
    },
    {
      name: 'Pacientes de Consignación',
      icon: 'fa-upload',
      html: 'module/completar/iniciar/iniciar.html',
      css: 'module/completar/iniciar/iniciar.css',
      js: 'module/completar/iniciar/iniciar.js'
    },
    {
      name: 'Traspasar Consignación',
      icon: 'fa-upload',
      html: 'module/completar/asignar/asignar.html',
      css: 'module/completar/asignar/asignar.css',
      js: 'module/completar/asignar/asignar.js'
    }
  ]
};


loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  modalLoginButton.disabled = true;
  modalLoginButton.classList.add('loading');
  modalLoginButton.textContent = 'Iniciando sesión...';

  const username = document.getElementById('username').value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    errorMessage.textContent = 'Por favor, complete todos los campos.';
    errorMessage.classList.remove('hidden');
    modalLoginButton.disabled = false;
    modalLoginButton.classList.remove('loading');
    modalLoginButton.textContent = 'Ingresar';
    return;
  }

  try {
    const usernameRef = doc(db, 'usernames', username);
    const usernameSnap = await getDoc(usernameRef);

    if (!usernameSnap.exists()) {
      errorMessage.textContent = 'Usuario no encontrado.';
      errorMessage.classList.remove('hidden');
      modalLoginButton.disabled = false;
      modalLoginButton.classList.remove('loading');
      modalLoginButton.textContent = 'Ingresar';
      return;
    }

    const email = usernameSnap.data().email;
    const userId = usernameSnap.data().userId;

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.uid !== userId) {
      errorMessage.textContent = 'Error: ID de usuario no coincide.';
      errorMessage.classList.remove('hidden');
      modalLoginButton.disabled = false;
      modalLoginButton.classList.remove('loading');
      modalLoginButton.textContent = 'Ingresar';
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      errorMessage.textContent = 'Datos de usuario no encontrados.';
      errorMessage.classList.remove('hidden');
      modalLoginButton.disabled = false;
      modalLoginButton.classList.remove('loading');
      modalLoginButton.textContent = 'Ingresar';
      return;
    }

    const userData = userSnap.data();
    const permissions = Array.isArray(userData.permissions) ? userData.permissions : [];
    const userRole = userData.role || '';

    localStorage.setItem('userDocId', user.uid);
    localStorage.setItem('userPermissions', JSON.stringify(permissions.map(perm => ({
      module: perm.split(':')[0],
      paths: [submenuData[perm.split(':')[0]]?.find(sub => sub.name === perm.split(':')[1])?.html].filter(Boolean)
    }))));
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userEmail', user.email);

    window.location.href = 'main.html';

    loginModal.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loginForm.reset();
    passwordInput.type = 'password';
    passwordToggle.classList.remove('fa-eye-slash');
    passwordToggle.classList.add('fa-eye');
    capsLockMessage.classList.add('hidden');
    modalLoginButton.disabled = false;
    modalLoginButton.classList.remove('loading');
    modalLoginButton.textContent = 'Ingresar';
  } catch (error) {
    console.error('Error en el inicio de sesión:', error.code, error.message);
    let errorText = 'Error al iniciar sesión. Por favor, intenta de nuevo.';
    switch (error.code) {
      case 'auth/wrong-password':
        errorText = 'Contraseña incorrecta.';
        break;
      case 'auth/user-not-found':
        errorText = 'Usuario no encontrado.';
        break;
      case 'auth/too-many-requests':
        errorText = 'Demasiados intentos fallidos. Intenta de nuevo más tarde.';
        break;
      case 'auth/invalid-email':
        errorText = 'El correo asociado al usuario es inválido.';
        break;
      case 'firestore/permission-denied':
        errorText = 'Permiso denegado para acceder a los datos del usuario. Contacta al administrador.';
        break;
      default:
        errorText = `Error: ${error.message}`;
    }
    errorMessage.textContent = errorText;
    errorMessage.classList.remove('hidden');
    modalLoginButton.disabled = false;
    modalLoginButton.classList.remove('loading');
    modalLoginButton.textContent = 'Ingresar';
  }

});
