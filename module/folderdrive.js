import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

export async function initFolderDrive(user) {
    const db = getFirestore();
    const tableBody = document.getElementById('patients-table-body');

    if (!tableBody) {
        console.error('No se encontró el elemento #patients-table-body');
        return;
    }

    try {
        // Ejemplo: Cargar datos desde Firestore (ajusta la colección según tu base de datos)
        const patientsCollection = collection(db, 'patients');
        const patientsSnapshot = await getDocs(patientsCollection);
        tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        // Datos de ejemplo si no hay datos en Firestore
        let patients = patientsSnapshot.empty ? [
            { id: 'ADM001', name: 'Juan Pérez', surgeryDate: '15/08/2025' },
            { id: 'ADM002', name: 'María Gómez', surgeryDate: '16/08/2025' },
            { id: 'ADM003', name: 'Carlos López', surgeryDate: '17/08/2025' }
        ] : patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        patients.forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.surgeryDate}</td>
                <td><button class="action-button" data-id="${patient.id}">Ver</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Añadir eventos a los botones de acción
        document.querySelectorAll('.action-button').forEach(button => {
            button.addEventListener('click', () => {
                const patientId = button.getAttribute('data-id');
                alert(`Ver detalles del paciente con Admisión: ${patientId}`);
                // Aquí puedes implementar lógica para mostrar detalles, editar, etc.
            });
        });

    } catch (error) {
        console.error('Error al cargar los datos de la tabla:', error);
        tableBody.innerHTML = '<tr><td colspan="4">Error al cargar los datos</td></tr>';
    }

    // Limpiar eventos al salir del módulo
    window.addEventListener('moduleCleanup', () => {
        // Remover eventos si es necesario
        document.querySelectorAll('.action-button').forEach(button => {
            button.replaceWith(button.cloneNode(true)); // Clonar para eliminar eventos
        });
    });
}

// Inicializar el módulo si el usuario está autenticado
window.initFolderDrive = initFolderDrive;

