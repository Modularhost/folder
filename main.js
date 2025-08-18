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
const sidebarMenu = document.querySelector('.sidebar-menu');
const sidebarTitle = document.querySelector('.sidebar-title');
const submenuContainer = document.querySelector('.submenu-container');
const submenuText = document.querySelector('.submenu-text');
const submenu = document.querySelector('.submenu');
const backButton = document.querySelector('.submenu-title');
const logoutModal = document.getElementById('logoutModal');
const confirmLogout = document.getElementById('confirmLogout');
const cancelLogout = document.getElementById('cancelLogout');
const content = document.querySelector('.content');

const submenuData = {
  
  Implantes: [
    {
      name: 'Cargar Imp',
      icon: 'fa-tooth',
      html: 'module/implantes/cargosimp/cargosimp.html',
      css: 'module/implantes/cargosimp/cargosimp.css',
      js: 'module/implantes/cargosimp/cargosimp.js'
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
    },
    {
      name: 'Base referencias',
      icon: 'fa-upload',
      html: 'module/completar/base/base.html',
      css: 'module/completar/base/base.css',
      js: 'module/completar/base/base.js'
    }
  ]
};

let currentSubmenuItem = null;
let currentUserPermissions = [];
let currentUserRole = '';

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
      let permissions = Array.isArray(userDoc.permissions) ? userDoc.permissions : [];
      let userRole = userDoc.role || '';
      let lastLogin = userDoc.lastLogin || null;
      if (userName) userName.textContent = displayName;
      if (userLogo) userLogo.src = userIcon;
      if (userRoleBadge) userRoleBadge.textContent = userRole || 'Sin rol';
      if (sessionStatus) updateSessionStatus(lastLogin, sessionStatus);
      const groupedPermissions = {};
      permissions.forEach(perm => {
        const [module, name] = perm.split(':');
        const htmlPath = submenuData[module]?.find(sub => sub.name === name)?.html;
        if (htmlPath) {
          if (!groupedPermissions[module]) {
            groupedPermissions[module] = { module, paths: [] };
          }
          groupedPermissions[module].paths.push(htmlPath);
        }
      });
      currentUserPermissions = Object.values(groupedPermissions);
      currentUserRole = userRole;
      renderSidebarMenu(currentUserPermissions, userRole);
      await loadContent(
        'module/info/informaciones/informaciones.html',
        'module/info/informaciones/informaciones.css',
        'module/info/informaciones/informaciones.js'
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

function renderSidebarMenu(permissions, userRole) {
  if (!sidebarMenu) return;
  const allowedModules = [...new Set(permissions.map(p => p.module).filter(Boolean))];
  sidebarMenu.innerHTML = '';
  Object.keys(submenuData).forEach(section => {
    if (allowedModules.includes(section) || userRole.toLowerCase() === 'administrador') {
      const li = document.createElement('li');
      li.classList.add('sidebar-menu-item');
      li.setAttribute('data-section', section);
      li.innerHTML = `<i class="far fa-circle-check sidebar-icon"></i><span class="sidebar-text">${section}</span>`;
      sidebarMenu.appendChild(li);
    }
  });
  attachMenuListeners();
}

function attachMenuListeners() {
  document.querySelectorAll('.sidebar-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const section = item.getAttribute('data-section');
      if (submenuContainer) submenuContainer.style.display = 'block';
      if (sidebarMenu) sidebarMenu.style.display = 'none';
      if (submenuText) submenuText.textContent = section;
      if (submenu) submenu.innerHTML = '';
      const modulePerms = currentUserPermissions.filter(p => p.module === section);
      const allowedPaths = modulePerms.flatMap(p => p.paths);
      const subItems = currentUserRole.toLowerCase() === 'administrador' ? submenuData[section] : submenuData[section].filter(subItem => allowedPaths.includes(subItem.html));
      subItems.forEach((subItem, index) => {
        const li = document.createElement('li');
        li.classList.add('submenu-item');
        li.setAttribute('data-html', subItem.html);
        li.innerHTML = `<i class="fas ${subItem.icon} submenu-icon"></i><span class="submenu-text">${subItem.name}</span>`;
        li.addEventListener('click', () => {
          if (currentSubmenuItem) {
            currentSubmenuItem.classList.remove('submenu-item-active');
          }
          li.classList.add('submenu-item-active');
          currentSubmenuItem = li;
          loadContent(subItem.html, subItem.css, subItem.js);
        });
        submenu.appendChild(li);
        if (subItem.name === 'Áreas Clínicas' && index + 1 < subItems.length && subItems[index + 1].name === 'CTS Proveedores') {
          const divider = document.createElement('li');
          divider.classList.add('submenu-divider');
          submenu.appendChild(divider);
        }
        if (subItem.name === 'Reporte 2025' && index + 1 < subItems.length && subItems[index + 1].name === 'RP 2024') {
          const divider = document.createElement('li');
          divider.classList.add('submenu-divider');
          submenu.appendChild(divider);
        }
      });
    });
  });
}

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
    script.onload = () => {
      if (htmlFile.includes('module/notas/notas/notas.html') && window.initNotas) {
        window.initNotas(auth.currentUser);
      } else if (htmlFile.includes('module/info/informaciones/informaciones.html') && window.initNotes) {
        window.initNotes(auth.currentUser);
      }
    };
    script.onerror = (error) => {
      content.innerHTML = `<h2>Error</h2><p>No se pudo cargar el script: ${error.message}</p>`;
    };
    document.body.appendChild(script);
  } catch (error) {
    content.innerHTML = `<h2>Error</h2><p>No se pudo cargar el contenido: ${error.message}</p>`;
  }
}

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

function showModulesInfo() {
  if (submenuContainer) submenuContainer.style.display = 'none';
  if (sidebarMenu) sidebarMenu.style.display = 'block';
  if (currentSubmenuItem) {
    currentSubmenuItem.classList.remove('submenu-item-active');
    currentSubmenuItem = null;
  }
  loadContent(
    'module/info/informaciones/informaciones.html',
    'module/info/informaciones/informaciones.css',
    'module/info/informaciones/informaciones.js'
  );
}

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
        if (currentSubmenuItem) {
          currentSubmenuItem.classList.remove('submenu-item-active');
          currentSubmenuItem = null;
        }
        loadContent(
          'module/info/datos-personales/datos-personales.html',
          'module/info/datos-personales/datos-personales.css',
          'module/info/datos-personales/datos-personales.js'
        );
        break;
      case 'change-password':
        if (currentSubmenuItem) {
          currentSubmenuItem.classList.remove('submenu-item-active');
          currentSubmenuItem = null;
        }
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

if (sidebarTitle) {
  sidebarTitle.addEventListener('click', showModulesInfo);
}

if (backButton) {
  backButton.addEventListener('click', () => {
    if (submenuContainer) submenuContainer.style.display = 'none';
    if (sidebarMenu) sidebarMenu.style.display = 'block';
    if (currentSubmenuItem) {
      currentSubmenuItem.classList.remove('submenu-item-active');
      currentSubmenuItem = null;
    }
  });
}

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
