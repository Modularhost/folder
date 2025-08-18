import { getFirestore, collection, getDocs, query, where, Timestamp } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js';

export async function initFolderDrive(user) {
    const db = getFirestore();
    const storage = getStorage();

    async function waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                resolve();
            } else {
                document.addEventListener('DOMContentLoaded', resolve);
            }
        });
    }

    async function getDOMElements() {
        await waitForDOM();
        const table = document.getElementById('patients-table');
        const tableBody = table?.querySelector('#patients-table-body');
        const filterYearSelect = document.getElementById('filter-year');
        const filterMonthSelect = document.getElementById('filter-month');
        const estadoButtonsContainer = document.getElementById('estado-buttons');
        const loadingModal = document.getElementById('loading-modal');
        const messageContainer = document.getElementById('message-container');
        const prevPageBtn = document.getElementById('prev-page-btn');
        const nextPageBtn = document.getElementById('next-page-btn');
        const pageInfo = document.getElementById('page-info');
        const uploadModal = document.getElementById('upload-modal');
        const uploadForm = document.getElementById('upload-form');
        const fileInput = document.getElementById('file-input');
        const uploadPatientId = document.getElementById('upload-patient-id');
        const uploadCollection = document.getElementById('upload-collection');
        const cancelUploadBtn = document.getElementById('cancel-upload');
        const filesModal = document.getElementById('files-modal');
        const filesList = document.getElementById('files-list');
        const closeFilesModalBtn = document.getElementById('close-files-modal');

        const elements = {
            table,
            tableBody,
            filterYearSelect,
            filterMonthSelect,
            estadoButtonsContainer,
            loadingModal,
            messageContainer,
            prevPageBtn,
            nextPageBtn,
            pageInfo,
            uploadModal,
            uploadForm,
            fileInput,
            uploadPatientId,
            uploadCollection,
            cancelUploadBtn,
            filesModal,
            filesList,
            closeFilesModalBtn
        };

        Object.entries(elements).forEach(([key, el]) => {
            if (!el) console.warn(`Elemento ${key} no encontrado en el DOM`);
        });

        return elements;
    }

    let allRecords = [];
    let selectedEstado = '';
    let columnFilters = {};
    let currentPage = 1;
    const recordsPerPage = 100;
    let initialTableWidth = 0;

    function showMessage(messageText, type = 'success') {
        const messageContainer = document.getElementById('message-container');
        if (!messageContainer) {
            console.error('Contenedor de mensajes no encontrado');
            return;
        }
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = messageText;
        messageContainer.appendChild(message);
        setTimeout(() => {
            message.classList.add('fade-out');
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    function formatDate(date, withTime = false) {
        if (!date) return 'Sin fecha';
        let d;
        if (date instanceof Timestamp) {
            d = date.toDate();
        } else if (date instanceof Date) {
            d = date;
        } else if (typeof date === 'string') {
            const [year, month, day] = date.split('-').map(Number);
            if (year && month && day && year >= 1000 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                d = new Date(year, month - 1, day);
            } else {
                return 'Sin fecha';
            }
        } else {
            return 'Sin fecha';
        }
        if (isNaN(d.getTime())) return 'Sin fecha';
        d.setHours(0, 0, 0, 0);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    async function loadRecords() {
        if (!user) throw new Error('Usuario no autenticado');

        const implantesQuery = query(
            collection(db, 'pacientesimplantes'),
            where('uid', '==', user.uid)
        );
        const implantesSnapshot = await getDocs(implantesQuery);
        const implantes = implantesSnapshot.docs.map(doc => ({
            id: doc.id,
            fuente: 'Implantes',
            ...doc.data()
        }));

        const consignacionQuery = query(
            collection(db, 'pacientesconsignacion'),
            where('uid', '==', user.uid)
        );
        const consignacionSnapshot = await getDocs(consignacionQuery);
        const consignaciones = consignacionSnapshot.docs.map(doc => ({
            id: doc.id,
            fuente: 'Consignación',
            ...doc.data()
        }));

        return [...implantes, ...consignaciones].map(record => ({
            id: doc.id,
            fuente: record.fuente,
            admision: record.admision || '',
            nombrePaciente: record.nombrePaciente || '',
            fechaCX: record.fechaCX || null,
            estado: record.estado || '',
            collection: record.fuente === 'Implantes' ? 'pacientesimplantes' : 'pacientesconsignacion'
        }));
    }

    function getYearsAndMonths(records) {
        const years = new Set([new Date().getFullYear()]);
        const monthsByYear = {};
        records.forEach(record => {
            if (record.fechaCX instanceof Timestamp && !isNaN(record.fechaCX.toDate().getTime())) {
                const date = record.fechaCX.toDate();
                date.setHours(0, 0, 0, 0);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                years.add(year);
                if (!monthsByYear[year]) monthsByYear[year] = new Set();
                monthsByYear[year].add(month);
            }
        });
        return {
            years: Array.from(years).sort((a, b) => b - a),
            monthsByYear: Object.fromEntries(
                Object.entries(monthsByYear).map(([year, months]) => [year, Array.from(months).sort((a, b) => a - b)])
            )
        };
    }

    function populateYearFilter(years) {
        const filterYearSelect = document.getElementById('filter-year');
        if (!filterYearSelect) return;
        filterYearSelect.innerHTML = '<option value="all">Todos</option>';
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            filterYearSelect.appendChild(option);
        });
        const currentYear = new Date().getFullYear();
        filterYearSelect.value = years.includes(currentYear) ? currentYear.toString() : 'all';
    }

    function populateMonthFilter(months, selectedMonth = '') {
        const filterMonthSelect = document.getElementById('filter-month');
        if (!filterMonthSelect) return;
        const monthNames = [
            { value: '1', name: 'Enero' },
            { value: '2', name: 'Febrero' },
            { value: '3', name: 'Marzo' },
            { value: '4', name: 'Abril' },
            { value: '5', name: 'Mayo' },
            { value: '6', name: 'Junio' },
            { value: '7', name: 'Julio' },
            { value: '8', name: 'Agosto' },
            { value: '9', name: 'Septiembre' },
            { value: '10', name: 'Octubre' },
            { value: '11', name: 'Noviembre' },
            { value: '12', name: 'Diciembre' }
        ];
        const validMonths = Array.isArray(months) ? months : [];
        filterMonthSelect.innerHTML = `
            <option value="" disabled selected>Seleccione un mes</option>
            ${monthNames
                .filter(month => validMonths.includes(parseInt(month.value)))
                .map(month => `<option value="${month.value}">${month.name}</option>`)
                .join('')}
        `;
        filterMonthSelect.value = validMonths.includes(parseInt(selectedMonth)) ? selectedMonth : '';
    }

    function filterRecords(records, year, month, estado) {
        if (month === '') return [];
        return records.filter(record => {
            if (!(record.fechaCX instanceof Timestamp) || isNaN(record.fechaCX.toDate().getTime())) return false;
            const date = record.fechaCX.toDate();
            date.setHours(0, 0, 0, 0);
            const recordYear = date.getFullYear();
            const recordMonth = date.getMonth() + 1;
            if (year !== 'all' && recordYear !== parseInt(year)) return false;
            if (month && recordMonth !== parseInt(month)) return false;
            if (estado && record.estado !== estado) return false;
            const fields = ['admision', 'nombrePaciente', 'fechaCX'];
            return Object.entries(columnFilters).every(([index, filterValue]) => {
                if (!filterValue) return true;
                const field = fields[parseInt(index)];
                let value;
                try {
                    if (field === 'fechaCX') {
                        value = formatDate(record[field], false);
                    } else {
                        value = (record[field] || '').toString().trim();
                    }
                    return value.toLowerCase().includes(filterValue.toLowerCase());
                } catch (error) {
                    console.warn(`Error al filtrar el campo ${field} en el registro ${record.id}: ${error.message}`);
                    return false;
                }
            });
        });
    }

    function renderEstadoButtons(records) {
        const estadoButtonsContainer = document.getElementById('estado-buttons');
        if (!estadoButtonsContainer) return;
        estadoButtonsContainer.innerHTML = '';
        const estados = Array.from(new Set(records.map(record => record.estado || 'Sin estado'))).sort();
        if (estados.length === 0) {
            estadoButtonsContainer.style.display = 'none';
            return;
        }
        estadoButtonsContainer.style.display = 'flex';
        estados.forEach(estado => {
            const button = document.createElement('button');
            button.className = 'estado-button';
            button.textContent = estado;
            if (estado === selectedEstado) button.classList.add('active');
            button.addEventListener('click', () => {
                selectedEstado = estado === selectedEstado ? '' : estado;
                const filterYearSelect = document.getElementById('filter-year');
                const filterMonthSelect = document.getElementById('filter-month');
                const selectedYear = filterYearSelect?.value || 'all';
                const selectedMonth = filterMonthSelect?.value || '';
                const filteredRecords = filterRecords(allRecords, selectedYear, selectedMonth, selectedEstado);
                renderRecords(filteredRecords);
                renderEstadoButtons(filteredRecords);
                updatePagination(filteredRecords);
            });
            estadoButtonsContainer.appendChild(button);
        });
    }

    function renderRecords(records) {
        const tableBody = document.querySelector('#patients-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        if (records.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No hay datos para mostrar. Seleccione un mes para ver los registros.</td></tr>';
            return;
        }
        const sortedRecords = records.sort((a, b) => {
            const dateA = a.fechaCX instanceof Timestamp ? a.fechaCX.toDate().getTime() : 0;
            const dateB = b.fechaCX instanceof Timestamp ? b.fechaCX.toDate().getTime() : 0;
            if (dateA !== dateB) return dateA - dateB;
            const nameA = (a.nombrePaciente || '').toLowerCase();
            const nameB = (b.nombrePaciente || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const paginatedRecords = sortedRecords.slice(startIndex, endIndex);
        paginatedRecords.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.admision}</td>
                <td>${record.nombrePaciente}</td>
                <td>${formatDate(record.fechaCX, false)}</td>
                <td>
                    <button class="action-button upload-button" data-id="${record.id}" data-collection="${record.collection}" title="Subir archivo">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </button>
                    <button class="action-button folder-button" data-id="${record.id}" data-collection="${record.collection}" title="Ver carpeta">
                        <i class="fas fa-folder-open"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        setupColumnFilters();
        setupResizeHandles();
        setupActionButtons();
    }

    function initializeColumnWidths() {
        const initialWidths = ['80px', '120px', '80px', '120px'];
        const headers = document.querySelectorAll('#patients-table th');
        const table = document.getElementById('patients-table');
        headers.forEach((header, index) => {
            const width = initialWidths[index] || '100px';
            header.style.width = width;
            header.style.minWidth = width;
            document.querySelectorAll(`#patients-table td:nth-child(${index + 1})`).forEach(cell => {
                cell.style.width = width;
                cell.style.minWidth = width;
            });
        });
        if (table) {
            initialTableWidth = initialWidths.reduce((sum, w) => sum + parseInt(w), 0);
            table.style.minWidth = `${initialTableWidth}px`;
        }
    }

    function setupColumnFilters() {
        const filterIcons = document.querySelectorAll('.filter-icon');
        const tableContainer = document.querySelector('.table-container');
        const headers = document.querySelectorAll('#patients-table th');
        if (!tableContainer || filterIcons.length === 0) {
            console.warn('No se encontraron íconos de filtro o table-container');
            return;
        }
        function closeAllFilters() {
            document.querySelectorAll('.filter-container').forEach(container => container.remove());
            headers.forEach((header, idx) => {
                header.classList.toggle('filter-active', !!columnFilters[idx]);
                header.title = columnFilters[idx] ? `Filtro: ${columnFilters[idx]}` : '';
            });
        }
        filterIcons.forEach(icon => {
            icon.removeEventListener('click', handleFilterIconClick);
            icon.addEventListener('click', handleFilterIconClick);
        });

        function handleFilterIconClick(e) {
            e.stopPropagation();
            const columnIndex = parseInt(e.target.getAttribute('data-column')) - 1;
            const th = e.target.parentElement;
            const existingContainer = document.querySelector('.filter-container');

            if (existingContainer) {
                closeAllFilters();
            }

            const container = document.createElement('div');
            container.className = 'filter-container';

            const clearButton = document.createElement('button');
            clearButton.className = 'clear-filter-button';
            clearButton.textContent = 'Borrar Filtro';
            clearButton.disabled = !columnFilters[columnIndex];
            clearButton.addEventListener('click', () => {
                columnFilters[columnIndex] = '';
                const filterYearSelect = document.getElementById('filter-year');
                const filterMonthSelect = document.getElementById('filter-month');
                const selectedYear = filterYearSelect?.value || 'all';
                const selectedMonth = filterMonthSelect?.value || '';
                const filteredRecords = filterRecords(allRecords, selectedYear, selectedMonth, selectedEstado);
                renderRecords(filteredRecords);
                renderEstadoButtons(filteredRecords);
                updatePagination(filteredRecords);
                closeAllFilters();
            });
            container.appendChild(clearButton);

            const label = document.createElement('label');
            label.className = 'filter-label';
            label.textContent = 'Filtrar por:';
            container.appendChild(label);

            const input = document.createElement('input');
            input.type = 'text';
            input.value = columnFilters[columnIndex] || '';
            input.placeholder = `Filtrar ${th.textContent.trim().replace(/[\n\r]+/g, '')}...`;
            container.appendChild(input);

            const iconRect = e.target.getBoundingClientRect();
            const tableRect = tableContainer.getBoundingClientRect();
            const thRect = th.getBoundingClientRect();
            const topPosition = iconRect.bottom - tableRect.top + tableContainer.scrollTop + 2;
            const leftPosition = iconRect.left - tableRect.left + tableContainer.scrollLeft;
            container.style.top = `${topPosition}px`;
            container.style.left = `${leftPosition}px`;
            container.style.width = `${Math.min(thRect.width - 12, 200)}px`;

            let timeout;
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    columnFilters[columnIndex] = input.value.trim();
                    const filterYearSelect = document.getElementById('filter-year');
                    const filterMonthSelect = document.getElementById('filter-month');
                    const selectedYear = filterYearSelect?.value || 'all';
                    const selectedMonth = filterMonthSelect?.value || '';
                    const filteredRecords = filterRecords(allRecords, selectedYear, selectedMonth, selectedEstado);
                    renderRecords(filteredRecords);
                    renderEstadoButtons(filteredRecords);
                    updatePagination(filteredRecords);
                    headers.forEach((header, idx) => {
                        header.classList.toggle('filter-active', !!columnFilters[idx]);
                        header.title = columnFilters[idx] ? `Filtro: ${columnFilters[idx]}` : '';
                    });
                    clearButton.disabled = !columnFilters[columnIndex];
                }, 300);
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    columnFilters[columnIndex] = input.value.trim();
                    const filterYearSelect = document.getElementById('filter-year');
                    const filterMonthSelect = document.getElementById('filter-month');
                    const selectedYear = filterYearSelect?.value || 'all';
                    const selectedMonth = filterMonthSelect?.value || '';
                    const filteredRecords = filterRecords(allRecords, selectedYear, selectedMonth, selectedEstado);
                    renderRecords(filteredRecords);
                    renderEstadoButtons(filteredRecords);
                    updatePagination(filteredRecords);
                    closeAllFilters();
                } else if (e.key === 'Escape') {
                    closeAllFilters();
                }
            });

            tableContainer.appendChild(container);
            container.style.display = 'block';
            input.focus();
        }

        document.removeEventListener('click', handleOutsideClick);
        document.addEventListener('click', handleOutsideClick);

        function handleOutsideClick(e) {
            if (!e.target.closest('.filter-container') && !e.target.classList.contains('filter-icon')) {
                closeAllFilters();
            }
        }
    }

    function setupResizeHandles() {
        const table = document.getElementById('patients-table');
        const thElements = table?.querySelectorAll('th');
        if (!table || thElements.length === 0) {
            console.warn('Tabla o encabezados no encontrados para redimensionamiento.');
            return;
        }
        thElements.forEach((th, index) => {
            const resizeHandle = th.querySelector('.resize-handle') || document.createElement('div');
            resizeHandle.className = 'resize-handle';
            th.style.position = 'relative';
            if (!th.contains(resizeHandle)) th.appendChild(resizeHandle);
            let startX, startWidth, columnWidths;
            resizeHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                startX = e.clientX;
                startWidth = parseFloat(getComputedStyle(th).width) || th.getBoundingClientRect().width;
                columnWidths = Array.from(thElements).map(header => 
                    parseFloat(getComputedStyle(header).width) || header.getBoundingClientRect().width
                );
                resizeHandle.classList.add('active');
                const onMouseMove = (e) => {
                    const newWidth = Math.max(50, Math.min(500, startWidth + (e.clientX - startX)));
                    th.style.width = `${newWidth}px`;
                    th.style.minWidth = `${newWidth}px`;
                    document.querySelectorAll(`#patients-table td:nth-child(${index + 1})`).forEach(cell => {
                        cell.style.width = `${newWidth}px`;
                        cell.style.minWidth = `${newWidth}px`;
                    });
                    thElements.forEach((header, idx) => {
                        if (idx !== index) {
                            header.style.width = `${columnWidths[idx]}px`;
                            header.style.minWidth = `${columnWidths[idx]}px`;
                            document.querySelectorAll(`#patients-table td:nth-child(${idx + 1})`).forEach(cell => {
                                cell.style.width = `${columnWidths[idx]}px`;
                                cell.style.minWidth = `${columnWidths[idx]}px`;
                            });
                        }
                    });
                    let totalWidth = 0;
                    thElements.forEach((header, idx) => {
                        const width = idx === index ? newWidth : columnWidths[idx];
                        totalWidth += width;
                    });
                    table.style.minWidth = `${Math.max(totalWidth, initialTableWidth)}px`;
                };
                const onMouseUp = () => {
                    resizeHandle.classList.remove('active');
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        });
    }

    async function setupActionButtons() {
        const uploadButtons = document.querySelectorAll('.upload-button');
        const folderButtons = document.querySelectorAll('.folder-button');

        uploadButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const collection = button.getAttribute('data-collection');
                const uploadModal = document.getElementById('upload-modal');
                const uploadPatientId = document.getElementById('upload-patient-id');
                const uploadCollection = document.getElementById('upload-collection');
                if (uploadModal && uploadPatientId && uploadCollection) {
                    uploadPatientId.value = id;
                    uploadCollection.value = collection;
                    uploadModal.style.display = 'flex';
                }
            });
        });

        folderButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                const collection = button.getAttribute('data-collection');
                await showFilesModal(id, collection);
            });
        });
    }

    async function showLoadingModal(show) {
        const loadingModal = document.getElementById('loading-modal');
        if (loadingModal) {
            loadingModal.style.display = show ? 'flex' : 'none';
        }
    }

    async function checkUserPermissions() {
        if (!user) return false;
        try {
            const { getDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js');
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                console.error('Documento de usuario no encontrado');
                return false;
            }
            const userData = userDoc.data();
            const isAdminOrOperator = ['Administrador', 'Operador'].includes(userData.role);
            const hasImplantesPermission = userData.permissions && userData.permissions.includes('Implantes:PacientesImplantes');
            const hasConsignacionPermission = userData.permissions && userData.permissions.includes('Consignacion:PacientesConsignacion');
            return isAdminOrOperator || hasImplantesPermission || hasConsignacionPermission;
        } catch (error) {
            console.error(`Error al verificar permisos: ${error.message}`);
            showMessage(`Error al verificar permisos: ${error.message}`, 'error');
            return false;
        }
    }

    function updatePagination(records) {
        const pageInfo = document.getElementById('page-info');
        const prevButton = document.getElementById('prev-page-btn');
        const nextButton = document.getElementById('next-page-btn');
        if (!pageInfo || !prevButton || !nextButton) return;
        const totalPages = Math.ceil(records.length / recordsPerPage);
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages || totalPages === 0;
    }

    function setupPaginationListeners() {
        const prevButton = document.getElementById('prev-page-btn');
        const nextButton = document.getElementById('next-page-btn');
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    const filterYearSelect = document.getElementById('filter-year');
                    const filterMonthSelect = document.getElementById('filter-month');
                    const selectedYear = filterYearSelect?.value || 'all';
                    const selectedMonth = filterMonthSelect?.value || '';
                    const filteredRecords = filterRecords(allRecords, selectedYear, selectedMonth, selectedEstado);
                    renderRecords(filteredRecords);
                    updatePagination(filteredRecords);
                }
            });
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const totalPages = Math.ceil(allRecords.length / recordsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    const filterYearSelect = document.getElementById('filter-year');
                    const filterMonthSelect = document.getElementById('filter-month');
                    const selectedYear = filterYearSelect?.value || 'all';
                    const selectedMonth = filterMonthSelect?.value || '';
                    const filteredRecords = filterRecords(allRecords, selectedYear, selectedMonth, selectedEstado);
                    renderRecords(filteredRecords);
                    updatePagination(filteredRecords);
                }
            });
        }
    }

    async function setupUploadForm() {
        const uploadForm = document.getElementById('upload-form');
        const cancelUploadBtn = document.getElementById('cancel-upload');
        if (!uploadForm || !cancelUploadBtn) return;

        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById('file-input');
            const patientId = document.getElementById('upload-patient-id').value;
            const collection = document.getElementById('upload-collection').value;
            const file = fileInput.files[0];
            if (!file) {
                showMessage('Por favor, seleccione un archivo.', 'error');
                return;
            }
            await showLoadingModal(true);
            try {
                const storagePath = `presupuestos/${user.uid}/${collection}/${patientId}/${file.name}`;
                const fileRef = ref(storage, storagePath);
                await uploadBytes(fileRef, file);
                showMessage('Archivo subido exitosamente.', 'success');
                document.getElementById('upload-modal').style.display = 'none';
                uploadForm.reset();
            } catch (error) {
                console.error('Error al subir archivo:', error);
                showMessage(`Error al subir archivo: ${error.message}`, 'error');
            } finally {
                await showLoadingModal(false);
            }
        });

        cancelUploadBtn.addEventListener('click', () => {
            document.getElementById('upload-modal').style.display = 'none';
            uploadForm.reset();
        });
    }

    async function showFilesModal(patientId, collection) {
        const filesModal = document.getElementById('files-modal');
        const filesList = document.getElementById('files-list');
        if (!filesModal || !filesList) return;

        filesList.innerHTML = '';
        await showLoadingModal(true);
        try {
            const storagePath = `presupuestos/${user.uid}/${collection}/${patientId}/`;
            const folderRef = ref(storage, storagePath);
            const fileList = await listAll(folderRef);
            if (fileList.items.length === 0) {
                filesList.innerHTML = '<p>No hay archivos subidos para este paciente.</p>';
            } else {
                for (const itemRef of fileList.items) {
                    const url = await getDownloadURL(itemRef);
                    const fileName = itemRef.name;
                    const fileItem = document.createElement('a');
                    fileItem.href = url;
                    fileItem.textContent = fileName;
                    fileItem.target = '_blank';
                    filesList.appendChild(fileItem);
                }
            }
            filesModal.style.display = 'flex';
        } catch (error) {
            console.error('Error al listar archivos:', error);
            showMessage(`Error al listar archivos: ${error.message}`, 'error');
        } finally {
            await showLoadingModal(false);
        }
    }

    function setupFilesModal() {
        const closeFilesModalBtn = document.getElementById('close-files-modal');
        if (closeFilesModalBtn) {
            closeFilesModalBtn.addEventListener('click', () => {
                document.getElementById('files-modal').style.display = 'none';
            });
        }
    }

    async function loadAndRenderRecords(preserveFilters = false) {
        const { tableBody, filterYearSelect, filterMonthSelect } = await getDOMElements();
        if (!tableBody) {
            showMessage('No se encontró el cuerpo de la tabla. Verifica el HTML.', 'error');
            return;
        }
        await showLoadingModal(true);
        try {
            allRecords = await loadRecords();
            const { years, monthsByYear } = getYearsAndMonths(allRecords);
            let selectedYear, selectedMonth;
            if (!preserveFilters) {
                populateYearFilter(years);
                selectedYear = filterYearSelect?.value || 'all';
                populateMonthFilter(monthsByYear[selectedYear] || []);
                selectedMonth = '';
                if (filterMonthSelect) filterMonthSelect.value = '';
                selectedEstado = '';
                columnFilters = {};
            } else {
                selectedYear = filterYearSelect?.value || 'all';
                selectedMonth = filterMonthSelect?.value || '';
                populateMonthFilter(monthsByYear[selectedYear] || [], selectedMonth);
                if (filterMonthSelect) {
                    filterMonthSelect.value = (selectedMonth && monthsByYear[selectedYear]?.includes(parseInt(selectedMonth))) ? selectedMonth : '';
                }
                selectedMonth = filterMonthSelect?.value || '';
            }
            const filteredRecords = filterRecords(allRecords, selectedYear, selectedMonth, selectedEstado);
            renderRecords(filteredRecords);
            renderEstadoButtons(filteredRecords);
            updatePagination(filteredRecords);
            setupPaginationListeners();
        } catch (error) {
            console.error('Error al cargar registros:', error);
            showMessage(`Error al cargar registros: ${error.message}`, 'error');
        } finally {
            await showLoadingModal(false);
        }
    }

    function setupFilterListeners() {
        const filterYearSelect = document.getElementById('filter-year');
        const filterMonthSelect = document.getElementById('filter-month');
        if (!filterYearSelect || !filterMonthSelect) return;
        filterYearSelect.addEventListener('change', () => {
            const selectedYear = filterYearSelect.value;
            const months = getYearsAndMonths(allRecords).monthsByYear[selectedYear] || [];
            populateMonthFilter(months);
            selectedEstado = '';
            const selectedMonth = filterMonthSelect.value || '';
            const filteredRecords = filterRecords(allRecords, selectedYear, selectedMonth, selectedEstado);
            currentPage = 1;
            renderRecords(filteredRecords);
            renderEstadoButtons(filteredRecords);
            updatePagination(filteredRecords);
        });
        filterMonthSelect.addEventListener('change', () => {
            const selectedYear = filterYearSelect.value;
            const selectedMonth = filterMonthSelect.value;
            selectedEstado = '';
            const filteredRecords = filterRecords(allRecords, selectedYear, selectedMonth, selectedEstado);
            currentPage = 1;
            renderRecords(filteredRecords);
            renderEstadoButtons(filteredRecords);
            updatePagination(filteredRecords);
        });
    }

    async function init() {
        try {
            const hasPermissions = await checkUserPermissions();
            if (!hasPermissions) {
                showMessage('No tienes permisos para gestionar pacientesimplantes o pacientesconsignacion.', 'error');
                return;
            }
            await waitForDOM();
            await Promise.all([
                setupFilterListeners(),
                setupUploadForm(),
                setupFilesModal(),
                loadAndRenderRecords()
            ]);
            initializeColumnWidths();
            setupResizeHandles();
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
            showMessage(`Error al inicializar la aplicación: ${error.message}`, 'error');
        }
    }

    init();

    // Limpiar eventos al salir del módulo
    window.addEventListener('moduleCleanup', () => {
        document.querySelectorAll('.filter-icon').forEach(icon => {
            icon.replaceWith(icon.cloneNode(true));
        });
        document.querySelectorAll('.estado-button').forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        document.querySelectorAll('.upload-button, .folder-button').forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        document.querySelectorAll('#prev-page-btn, #next-page-btn, #cancel-upload, #close-files-modal').forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        document.removeEventListener('click', handleOutsideClick);
        const uploadForm = document.getElementById('upload-form');
        if (uploadForm) {
            uploadForm.replaceWith(uploadForm.cloneNode(true));
        }
    });

    function handleOutsideClick(e) {
        if (!e.target.closest('.filter-container') && !e.target.classList.contains('filter-icon')) {
            document.querySelectorAll('.filter-container').forEach(container => container.remove());
            document.querySelectorAll('#patients-table th').forEach((header, idx) => {
                header.classList.toggle('filter-active', !!columnFilters[idx]);
                header.title = columnFilters[idx] ? `Filtro: ${columnFilters[idx]}` : '';
            });
        }
    }
}