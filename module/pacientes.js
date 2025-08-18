* {
    box-sizing: border-box;
}

:root {
    --bg-color: #fff;
    --border-color: #e2e8f0;
    --text-color: #2d3748;
    --table-text-color: #4b5563;
    --header-bg: #f8fafc;
    --hover-bg: #e9f2ff;
    --input-bg: #fff;
    --button-bg: #4b5563;
    --button-hover-bg: #374151;
    --disabled-bg: #e5e7eb;
    --success-bg: #f0fff4;
    --success-border: #48bb78;
    --error-bg: #fffaf0;
    --error-border: #f6ad55;
    --primary: #2b6cb0;
    --primary-hover: #2c5282;
    --success: #38a169;
    --success-hover: #2f855a;
    --error: #ef4444;
    --error-hover: #dc2626;
    --scrollbar-bg: #e5e7eb;
    --scrollbar-thumb: #9ca3af;
    --dark-bg-color: #1f2937;
    --dark-border-color: #4b5563;
    --dark-text-color: #f9fafb;
    --dark-table-text-color: #d1d5db;
    --dark-header-bg: #2d3748;
    --dark-hover-bg: #3c4a66;
    --dark-input-bg: #4b5563;
    --dark-button-bg: #6b7280;
    --dark-button-hover-bg: #4b5563;
    --dark-disabled-bg: #4b5563;
    --dark-success-bg: #34d399;
    --dark-error-bg: #f56565;
    --dark-primary: #63b3ed;
    --dark-primary-hover: #4299e1;
    --dark-success: #48bb78;
    --dark-success-hover: #34d399;
    --dark-error: #f87171;
    --dark-error-hover: #ef4444;
    --dark-scrollbar-bg: #4b5563;
    --dark-scrollbar-thumb: #9ca3af;
}

.referencias-container {
    width: 100%;
    height: 100%;
    padding: 10px;
    margin: 0;
    border: 1px solid var(--border-color);
    background-color: var(--bg-color);
}

body.dark-mode .referencias-container {
    background-color: var(--dark-bg-color);
    border-color: var(--dark-border-color);
}

.referencias-container h2 {
    color: var(--text-color);
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
}

body.dark-mode .referencias-container h2 {
    color: var(--dark-text-color);
}

.table-container h3 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 8px;
}

body.dark-mode .table-container h3 {
    color: var(--dark-text-color);
}

.divider {
    border: 0;
    border-top: 1px solid var(--border-color);
    margin: 8px 0;
}

body.dark-mode .divider {
    border-top: 1px solid var(--dark-border-color);
}

.form-container {
    background-color: var(--bg-color);
    padding: 10px 10px 4px;
    border: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 4px;
}

body.dark-mode .form-container {
    background-color: var(--dark-bg-color);
    border-color: var(--dark-border-color);
}

.form-group-button,
.button-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.form-group-button .filter-group {
    display: flex;
    align-items: center;
    gap: 4px;
}

.form-group-button .filter-group label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-color);
    white-space: nowrap;
}

body.dark-mode .form-group-button .filter-group label {
    color: var(--dark-text-color);
}

#year-filter,
#month-filter,
#day-filter,
#admision-filter,
#paciente-filter,
#column-filter,
#column-search {
    min-width: 120px;
    padding: 4px;
    border: 1px solid var(--border-color);
    font-size: 11px;
    background-color: var(--input-bg);
    color: var(--text-color);
    height: 28px;
    transition: border-color 0.2s;
}

body.dark-mode #year-filter,
body.dark-mode #month-filter,
body.dark-mode #day-filter,
body.dark-mode #admision-filter,
body.dark-mode #paciente-filter,
body.dark-mode #column-filter,
body.dark-mode #column-search {
    border-color: var(--dark-border-color);
    background-color: var(--dark-input-bg);
    color: var(--dark-text-color);
}

#year-filter:focus,
#month-filter:focus,
#day-filter:focus,
#admision-filter:focus,
#paciente-filter:focus,
#column-filter:focus,
#column-search:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 5px rgba(43, 108, 176, 0.3);
}

body.dark-mode #year-filter:focus,
body.dark-mode #month-filter:focus,
body.dark-mode #day-filter:focus,
body.dark-mode #admision-filter:focus,
body.dark-mode #paciente-filter:focus,
body.dark-mode #column-filter:focus,
body.dark-mode #column-search:focus {
    border-color: var(--dark-primary);
    box-shadow: 0 0 5px rgba(99, 179, 237, 0.3);
}

#admision-filter::placeholder,
#paciente-filter::placeholder,
#column-search::placeholder {
    color: #6b7280;
    opacity: 1;
}

body.dark-mode #admision-filter::placeholder,
body.dark-mode #paciente-filter::placeholder,
body.dark-mode #column-search::placeholder {
    color: var(--dark-text-color);
    opacity: 0.7;
}

.form-group-button button.estado-filter-btn,
.button-group button,
.success-btn {
    padding: 6px 12px;
    border: none;
    cursor: pointer;
    font-size: 12px;
    margin-left: 8px;
}

.success-btn {
    background-color: var(--success);
    color: white;
}

body.dark-mode .success-btn {
    background-color: var(--dark-success);
}

.success-btn:hover {
    background-color: var(--success-hover);
}

body.dark-mode .success-btn:hover {
    background-color: var(--dark-success-hover);
}

.form-group-button button.estado-filter-btn {
    background-color: var(--primary);
    color: white;
}

body.dark-mode .form-group-button button.estado-filter-btn {
    background-color: var(--dark-primary);
}

.form-group-button button.estado-filter-btn:hover {
    background-color: var(--primary-hover);
}

body.dark-mode .form-group-button button.estado-filter-btn:hover {
    background-color: var(--dark-primary-hover);
}

.form-group-button button.estado-filter-btn.active {
    background-color: var(--primary-hover);
    font-weight: bold;
}

body.dark-mode .form-group-button button.estado-filter-btn.active {
    background-color: var(--dark-primary-hover);
    font-weight: bold;
}

.tables-row {
    display: flex;
    gap: 0;
    width: 100%;
    overflow-x: auto;
    position: relative;
}

.table-container {
    flex: 1;
    min-width: 300px;
    height: 700px;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    background-color: var(--bg-color);
}

body.dark-mode .table-container {
    border-color: var(--dark-border-color);
    background-color: var(--dark-bg-color);
}

#tabla1,
#tabla2,
#tabla3,
#oc-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 12px;
    border: 1px solid var(--border-color);
    background-color: var(--bg-color);
    table-layout: auto;
}

body.dark-mode #tabla1,
body.dark-mode #tabla2,
body.dark-mode #tabla3,
body.dark-mode #oc-table {
    border-color: var(--dark-border-color);
    background-color: var(--dark-bg-color);
}

#tabla1 th,
#tabla1 td,
#tabla2 th,
#tabla2 td,
#tabla3 th,
#tabla3 td,
#oc-table th,
#oc-table td {
    border: 1px solid var(--border-color);
    padding: 0 4px;
    text-align: left;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 20px;
    line-height: 20px;
    background-color: var(--bg-color);
}

body.dark-mode #tabla1 th,
body.dark-mode #tabla1 td,
body.dark-mode #tabla2 th,
body.dark-mode #tabla2 td,
body.dark-mode #tabla3 th,
body.dark-mode #tabla3 td,
body.dark-mode #oc-table th,
body.dark-mode #oc-table td {
    border-color: var(--dark-border-color);
    background-color: var(--dark-bg-color);
}

#tabla1 th,
#tabla2 th,
#tabla3 th,
#oc-table th {
    background-color: var(--header-bg);
    color: var(--text-color);
    position: sticky;
    top: 0;
    font-weight: 600;
    min-width: 100px;
    z-index: 10;
}

body.dark-mode #tabla1 th,
body.dark-mode #tabla2 th,
body.dark-mode #tabla3 th,
body.dark-mode #oc-table th {
    background-color: var(--dark-header-bg);
    color: var(--dark-text-color);
}

#tabla1 td,
#tabla2 td,
#tabla3 td,
#oc-table td {
    color: var(--table-text-color);
    font-size: 11px;
}

body.dark-mode #tabla1 td,
body.dark-mode #tabla2 td,
body.dark-mode #tabla3 td,
body.dark-mode #oc-table td {
    color: var(--dark-table-text-color);
}

#tabla1 th.fecha-ingreso,
#tabla1 th.admision,
#tabla1 th.codigo,
#tabla1 th.cantidad,
#tabla1 th.venta,
#tabla1 th.estado,
#tabla1 th.fecha-carga,
#tabla2 th.descripcion,
#tabla2 th.validacion,
#tabla2 th.cotizacion,
#tabla2 th.referencia,
#tabla2 th.lote,
#tabla2 th.fecha-vencimiento,
#tabla2 th.corpo,
#tabla2 th.total-cotizacion,
#tabla2 th.total-grupo,
#tabla3 th.convenio,
#tabla3 th.prevision,
#tabla3 th.admision,
#tabla3 th.paciente,
#tabla3 th.medico,
#tabla3 th.fecha-cx,
#tabla3 th.proveedor,
#tabla3 th.codigo,
#tabla3 th.descripcion,
#tabla3 th.cantidad,
#tabla3 th.precio-sistema,
#tabla3 th.modalidad,
#tabla3 th.categoria,
#tabla3 th.total-item,
#tabla3 th.margen,
#oc-table th.admision,
#oc-table th.paciente,
#oc-table th.medico,
#oc-table th.fecha-cx,
#oc-table th.proveedor,
#oc-table th.codigo,
#oc-table th.descripcion,
#oc-table th.cantidad,
#oc-table th.precio-sistema,
#oc-table th.modalidad,
#oc-table th.oc,
#oc-table th.oc-monto,
#oc-table th.estado,
#oc-table th.fecha-ingreso,
#oc-table th.fecha-cargo,
#oc-table th.cotizacion,
#oc-table th.factura,
#oc-table th.fecha-factura,
#oc-table th.fecha-emision,
#oc-table th.lote,
#oc-table th.fecha-vencimiento {
    min-width: 100px;
}

#tabla1 th.seleccion {
    min-width: 40px;
    text-align: center;
}

#tabla1 th.acciones {
    min-width: 80px;
    text-align: center;
}

#tabla1 td.seleccion,
#tabla1 td.acciones {
    text-align: center;
    padding: 0 4px;
}

#tabla2 th.descripcion,
#tabla3 th.descripcion,
#oc-table th.descripcion {
    min-width: 150px;
}

#tabla1 th.cantidad,
#tabla1 th.venta,
#tabla2 th.cotizacion,
#tabla2 th.lote,
#tabla2 th.corpo,
#tabla2 th.total-cotizacion,
#tabla2 th.total-grupo,
#tabla3 th.cantidad,
#tabla3 th.precio-sistema,
#tabla3 th.total-item,
#tabla3 th.margen,
#oc-table th.cantidad,
#oc-table th.precio-sistema,
#oc-table th.oc,
#oc-table th.oc-monto,
#oc-table th.estado,
#oc-table th.cotizacion,
#oc-table th.factura,
#oc-table th.fecha-factura,
#oc-table th.fecha-emision,
#oc-table th.lote,
#oc-table th.fecha-vencimiento {
    min-width: 80px;
}

.validacion-tick {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: rgba(56, 161, 105, 0.1);
    color: var(--success);
    font-size: 10px;
    line-height: 1;
    text-align: center;
}

body.dark-mode .validacion-tick {
    background-color: rgba(72, 187, 120, 0.1);
    color: var(--dark-success);
}

.validacion-x {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--error);
    font-size: 10px;
    line-height: 1;
    text-align: center;
}

body.dark-mode .validacion-x {
    background-color: rgba(248, 113, 113, 0.1);
    color: var(--dark-error);
}

#tabla1 tbody tr:hover,
#tabla1 tbody tr:hover td,
#tabla2 tbody tr:hover,
#tabla2 tbody tr:hover td,
#tabla3 tbody tr:hover,
#tabla3 tbody tr:hover td,
#oc-table tbody tr:hover,
#oc-table tbody tr:hover td,
#tabla1 tbody tr.row-hover,
#tabla1 tbody tr.row-hover td,
#tabla2 tbody tr.row-hover,
#tabla2 tbody tr.row-hover td,
#tabla3 tbody tr.row-hover,
#tabla3 tbody tr.row-hover td,
#oc-table tbody tr.row-hover,
#oc-table tbody tr.row-hover td {
    background-color: var(--hover-bg) !important;
    transition: background-color 0.2s ease;
}

body.dark-mode #tabla1 tbody tr:hover,
body.dark-mode #tabla1 tbody tr:hover td,
body.dark-mode #tabla2 tbody tr:hover,
body.dark-mode #tabla2 tbody tr:hover td,
body.dark-mode #tabla3 tbody tr:hover,
body.dark-mode #tabla3 tbody tr:hover td,
body.dark-mode #oc-table tbody tr:hover,
body.dark-mode #oc-table tbody tr:hover td,
body.dark-mode #tabla1 tbody tr.row-hover,
body.dark-mode #tabla1 tbody tr.row-hover td,
body.dark-mode #tabla2 tbody tr.row-hover,
body.dark-mode #tabla2 tbody tr.row-hover td,
body.dark-mode #tabla3 tbody tr.row-hover,
body.dark-mode #tabla3 tbody tr.row-hover td,
body.dark-mode #oc-table tbody tr.row-hover,
body.dark-mode #oc-table tbody tr.row-hover td {
    background-color: var(--dark-hover-bg) !important;
}

.action-icon {
    cursor: pointer;
    margin: 0 4px;
    font-size: 11px;
    line-height: 18px;
    vertical-align: middle;
}

.action-icon.fa-edit {
    color: var(--success);
}

.action-icon.fa-edit:hover {
    color: var(--success-hover);
}

.action-icon.fa-trash {
    color: var(--error);
}

.action-icon.fa-trash:hover {
    color: var(--error-hover);
}

.action-icon.fa-history {
    color: var(--primary);
}

.action-icon.fa-history:hover {
    color: var(--primary-hover);
}

body.dark-mode .action-icon.fa-edit {
    color: var(--dark-success);
}

body.dark-mode .action-icon.fa-edit:hover {
    color: var(--dark-success-hover);
}

body.dark-mode .action-icon.fa-trash {
    color: var(--dark-error);
}

body.dark-mode .action-icon.fa-trash:hover {
    color: var(--dark-error-hover);
}

body.dark-mode .action-icon.fa-history {
    color: var(--dark-primary);
}

body.dark-mode .action-icon.fa-history:hover {
    color: var(--dark-primary-hover);
}

#tabla1 th .resize-handle,
#tabla2 th .resize-handle,
#tabla3 th .resize-handle,
#oc-table th .resize-handle {
    position: absolute;
    right: 0;
    top: 0;
    width: 6px;
    height: 100%;
    cursor: col-resize;
    background-color: transparent;
    z-index: 11;
}

#tabla1 th .resize-handle:hover,
#tabla1 th .resize-handle.active,
#tabla2 th .resize-handle:hover,
#tabla2 th .resize-handle.active,
#tabla3 th .resize-handle:hover,
#tabla3 th .resize-handle.active,
#oc-table th .resize-handle:hover,
#oc-table th .resize-handle.active {
    background-color: var(--primary);
}

body.dark-mode #tabla1 th .resize-handle:hover,
body.dark-mode #tabla1 th .resize-handle.active,
body.dark-mode #tabla2 th .resize-handle:hover,
body.dark-mode #tabla2 th .resize-handle.active,
body.dark-mode #tabla3 th .resize-handle:hover,
body.dark-mode #tabla3 th .resize-handle.active,
body.dark-mode #oc-table th .resize-handle:hover,
body.dark-mode #oc-table th .resize-handle.active {
    background-color: var(--dark-primary);
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
    padding: 8px;
    background-color: var(--bg-color);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

body.dark-mode .pagination {
    background-color: var(--dark-bg-color);
}

.pagination button {
    padding: 6px 12px;
    border: none;
    cursor: pointer;
    font-size: 12px;
    background-color: var(--button-bg);
    color: white;
    transition: background-color 0.2s;
}

body.dark-mode .pagination button {
    background-color: var(--dark-button-bg);
}

.pagination button:hover:not(:disabled) {
    background-color: var(--button-hover-bg);
}

body.dark-mode .pagination button:hover:not(:disabled) {
    background-color: var(--dark-button-hover-bg);
}

.pagination button:disabled {
    background-color: var(--disabled-bg);
    cursor: not-allowed;
    opacity: 0.6;
}

body.dark-mode .pagination button:disabled {
    background-color: var(--dark-disabled-bg);
}

.pagination #page-info {
    font-size: 12px;
    color: var(--text-color);
    font-weight: 500;
}

body.dark-mode .pagination #page-info {
    color: var(--dark-text-color);
}

#message-container {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 300px;
}

.message {
    background-color: var(--success-bg);
    border: 1px solid var(--success-border);
    color: var(--text-color);
    padding: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    font-size: 12px;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
}

.message.fade-out {
    opacity: 0;
}

.message.error {
    background-color: var(--error-bg);
    border: 1px solid var(--error-border);
}

body.dark-mode .message {
    background-color: var(--dark-success-bg);
    border-color: var(--dark-success);
    color: var(--dark-text-color);
}

body.dark-mode .message.error {
    background-color: var(--dark-error-bg);
    border-color: var(--dark-error);
}

.modal,
#oc-modal,
#delete-modal,
#loading-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.modal.active,
#oc-modal.active,
#delete-modal.active,
#loading-overlay.active {
    display: flex;
}

.modal-content {
    background: var(--bg-color);
    padding: 10px;
    border: 1px solid var(--border-color);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

body.dark-mode .modal-content {
    background: var(--dark-bg-color);
    border-color: var(--dark-border-color);
}

#loading-overlay .modal-content {
    max-width: 250px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

#loading-overlay .modal-content p {
    margin: 0;
    font-size: 12px;
    color: var(--text-color);
}

body.dark-mode #loading-overlay .modal-content {
    background: var(--dark-bg-color);
    border-color: var(--dark-border-color);
}

body.dark-mode #loading-overlay .modal-content p {
    color: var(--dark-text-color);
}

.modal-content h2 {
    margin: 0 0 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
}

body.dark-mode .modal-content h2 {
    color: var(--dark-text-color);
}

.modal-content p {
    font-size: 12px;
    color: var(--text-color);
    margin-bottom: 8px;
}

body.dark-mode .modal-content p {
    color: var(--dark-text-color);
}

.modal-buttons {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 8px;
}

.modal-buttons button {
    padding: 6px 12px;
    border: none;
    cursor: pointer;
    font-size: 12px;
    color: white;
}

.modal-buttons #download-excel-btn,
.modal-buttons #confirmar-delete-btn {
    background-color: var(--success);
}

body.dark-mode .modal-buttons #download-excel-btn,
body.dark-mode .modal-buttons #confirmar-delete-btn {
    background-color: var(--dark-success);
}

.modal-buttons #download-excel-btn:hover,
.modal-buttons #confirmar-delete-btn:hover {
    background-color: var(--success-hover);
}

body.dark-mode .modal-buttons #download-excel-btn:hover,
body.dark-mode .modal-buttons #confirmar-delete-btn:hover {
    background-color: var(--dark-success-hover);
}

.modal-buttons #cancelar-oc-btn,
.modal-buttons #cancelar-delete-btn {
    background-color: var(--error);
}

body.dark-mode .modal-buttons #cancelar-oc-btn,
body.dark-mode .modal-buttons #cancelar-delete-btn {
    background-color: var(--dark-error);
}

.modal-buttons #cancelar-oc-btn:hover,
.modal-buttons #cancelar-delete-btn:hover {
    background-color: var(--error-hover);
}

body.dark-mode .modal-buttons #cancelar-oc-btn:hover,
body.dark-mode .modal-buttons #cancelar-delete-btn:hover {
    background-color: var(--dark-error-hover);
}

td.estado {
    cursor: pointer;
}

.spinner {
    width: 30px;
    height: 30px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

body.dark-mode .spinner {
    border: 3px solid var(--dark-border-color);
    border-top: 3px solid var(--dark-primary);
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .tables-row {
        flex-direction: column;
    }

    .table-container {
        min-width: 100%;
        height: auto;
        overflow-y: auto;
        overflow-x: auto;
    }

    #tabla1,
    #tabla2,
    #tabla3,
    #oc-table {
        width: 100%;
    }

    #tabla1 th,
    #tabla2 th,
    #tabla3 th,
    #oc-table th {
        position: static;
    }

    #tabla1 th,
    #tabla1 td,
    #tabla2 th,
    #tabla2 td,
    #tabla3 th,
    #tabla3 td,
    #oc-table th,
    #oc-table td {
        padding: 0 6px;
        font-size: 11px;
        height: 18px;
        line-height: 18px;
    }

    #tabla1 th.seleccion,
    #tabla1 td.seleccion {
        min-width: 30px;
    }

    #tabla1 th.acciones,
    #tabla1 td.acciones {
        min-width: 60px;
    }

    #tabla2 th.descripcion,
    #tabla3 th.descripcion,
    #oc-table th.descripcion {
        min-width: 120px;
    }

    #tabla2 th.validacion,
    #tabla2 th.total-cotizacion,
    #tabla2 th.total-grupo {
        min-width: 80px;
    }

    .validacion-tick,
    .validacion-x {
        width: 14px;
        height: 14px;
        font-size: 9px;
    }

    .action-icon {
        font-size: 10px;
        margin: 0 3px;
        line-height: 18px;
    }

    .form-group-button,
    .button-group {
        flex-direction: column;
        align-items: flex-start;
    }

    .form-group-button button.estado-filter-btn,
    .button-group button,
    .success-btn,
    #year-filter,
    #month-filter,
    #day-filter,
    #admision-filter,
    #paciente-filter,
    #column-filter,
    #column-search {
        margin-left: 0;
        width: 100%;
        text-align: center;
    }

    .modal-content {
        width: 95%;
        padding: 8px;
        max-height: 80vh;
    }

    #loading-overlay .modal-content {
        max-width: 95%;
        padding: 10px;
    }

    .modal-content h2 {
        font-size: 13px;
    }

    .modal-content p {
        font-size: 11px;
    }

    .modal-buttons button {
        font-size: 11px;
        padding: 5px 10px;
    }

    .spinner {
        width: 25px;
        height: 25px;
        border: 2px solid var(--border-color);
        border-top: 2px solid var(--primary);
    }

    body.dark-mode .spinner {
        border: 2px solid var(--dark-border-color);
        border-top: 2px solid var(--dark-primary);
    }
}

@media (max-width: 480px) {
    .referencias-container {
        padding: 8px;
    }

    .form-container {
        padding: 8px;
    }

    .form-group-button .filter-group label {
        font-size: 10px;
    }

    #year-filter,
    #month-filter,
    #day-filter,
    #admision-filter,
    #paciente-filter,
    #column-filter,
    #column-search {
        min-width: 100px;
        font-size: 10px;
        height: 26px;
    }

    .pagination button {
        font-size: 11px;
        padding: 5px 10px;
    }

    .pagination #page-info {
        font-size: 11px;
    }

    #message-container {
        max-width: 90%;
        right: 5px;
        top: 5px;
    }

    .message {
        font-size: 11px;
        padding: 6px;
    }

    .validacion-tick,
    .validacion-x {
        width: 12px;
        height: 12px;
        font-size: 8px;
    }

    #oc-table {
        font-size: 10px;
    }

    #oc-table th,
    #oc-table td {
        padding: 0 3px;
        height: 18px;
        line-height: 18px;
    }

    #oc-table th.descripcion,
    #oc-table td.descripcion {
        min-width: 100px;
    }

    #oc-table th.cantidad,
    #oc-table th.precio-sistema,
    #oc-table th.oc,
    #oc-table th.oc-monto,
    #oc-table th.estado,
    #oc-table th.cotizacion,
    #oc-table th.factura,
    #oc-table th.fecha-factura,
    #oc-table th.fecha-emision,
    #oc-table th.lote,
    #oc-table th.fecha-vencimiento {
        min-width: 60px;
    }

    .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid var(--border-color);
        border-top: 2px solid var(--primary);
    }

    body.dark-mode .spinner {
        border: 2px solid var(--dark-border-color);
        border-top: 2px solid var(--dark-primary);
    }
}