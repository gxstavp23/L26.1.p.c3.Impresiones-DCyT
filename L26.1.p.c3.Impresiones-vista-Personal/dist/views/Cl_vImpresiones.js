export default class Cl_vImpresiones {
    vista;
    lblTotalCopias;
    lblTotalIngresos;
    lblTotalIngresosUsd;
    btRecargar;
    selFiltroEstado;
    selFiltroFecha;
    selHashCodigo;
    tblRegistros;
    //porcentajes
    lblPorcImpresiones;
    lblPorcArticulos;
    lblPorcDescargas;
    _onCambiarEstadoCallback = null;
    constructor() {
        this.vista = document.body;
        this.lblTotalCopias = document.getElementById("stat-copias");
        this.lblTotalIngresos = document.getElementById("stat-ingresos");
        this.lblTotalIngresosUsd = document.getElementById("stat-ingresos-usd");
        this.lblPorcImpresiones = document.getElementById("stat-porc-impresiones");
        this.lblPorcArticulos = document.getElementById("stat-porc-articulos");
        this.lblPorcDescargas = document.getElementById("stat-porc-descargas");
        this.btRecargar = document.getElementById("btn-recargar");
        this.selFiltroEstado = document.getElementById("sel-filtro-estado");
        this.selFiltroFecha = document.getElementById("sel-filtro-fecha");
        this.selHashCodigo = document.getElementById("sel-hash-codigo");
        this.tblRegistros = document.getElementById("tbl-body");
        if (!this.selHashCodigo) {
            console.error("ERROR: No se encontró el elemento con id 'sel-hash-codigo' en tu HTML");
        }
    }
    get filtroEstado() {
        return this.selFiltroEstado.value;
    }
    get filtroFecha() {
        return this.selFiltroFecha.value;
    }
    get hashCodigo() {
        return this.selHashCodigo.value;
    }
    onRecargar(callback) {
        this.btRecargar.onclick = callback;
    }
    onChangeFiltroEstado(callback) {
        this.selFiltroEstado.onchange = callback;
    }
    onChangeFiltroFecha(callback) {
        this.selFiltroFecha.onchange = callback;
    }
    // Vincula el evento de escritura tiempo real al campo de búsqueda
    onChangeBuscarOrden(callback) {
        this.selHashCodigo.oninput = callback;
    }
    onAccionCambiarEstado(callback) {
        this._onCambiarEstadoCallback = callback;
    }
    // formatea un número a formato de moneda en Bolívares (Bs.) con separadores de miles y dos decimales
    formatBs(value) {
        return value.toLocaleString("es-VE", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    }
    // formatea un número a formato de moneda en Dólares (USD) con separadores de miles y dos decimales
    formatUsd(value) {
        return value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }
    // recibe un arreglo de solicitudes planas (datos sin procesar) y los muestra en la tabla de registros
    mostrarEstadisticas(totalCopias, totalIngresos, totalIngresosUsd, porcImpresiones, porcArticulos, porcDescargas) {
        this.lblTotalCopias.innerText = totalCopias.toString();
        this.lblTotalIngresos.innerText = this.formatBs(totalIngresos);
        this.lblTotalIngresosUsd.innerText = this.formatUsd(totalIngresosUsd);
        this.lblPorcImpresiones.innerText = porcImpresiones.toFixed(2) + "%";
        this.lblPorcArticulos.innerText = porcArticulos.toFixed(2) + "%";
        this.lblPorcDescargas.innerText = porcDescargas.toFixed(2) + "%";
    }
    mostrarImpresiones(solicitudesPlanas) {
        this.tblRegistros.innerHTML = "";
        solicitudesPlanas.forEach((sol) => {
            const fila = document.createElement("tr");
            // Si el estado es "Verificando pago", mostramos los botones de acción para el personal
            let columnaAccion = "";
            if (sol.estado === "Verificando pago") {
                columnaAccion = `
          <div class="action-buttons">
            <button class="btn-aprobar btn-action" data-id="${sol.id}">Aprobar</button>
            <button class="btn-rechazar btn-action" data-id="${sol.id}">Rechazar</button>
          </div>
        `;
            }
            else {
                const resultadoLabel = sol.estado === "Aprobado" ? "Procesado" : sol.estado === "Rechazado" ? "Procesado" : "Procesado";
                const resultadoClass = sol.estado === "Aprobado" ? "result-approved" : sol.estado === "Rechazado" ? "result-rejected" : "result-processed";
                columnaAccion = `<span class="action-result ${resultadoClass}">${resultadoLabel}</span>`;
            }
            // Estilos de color para identificar estados rápidamente
            let colorEstado = "orange";
            let estadoLabel = sol.estado;
            if (sol.estado === "Aprobado") {
                colorEstado = "green";
                estadoLabel = "Pago aprobado";
            }
            if (sol.estado === "Rechazado") {
                colorEstado = "red";
                estadoLabel = "Pago rechazado";
            }
            const serviciosHtml = Array.isArray(sol.items)
                ? sol.items
                    .map((item) => {
                    const descripcion = item.descripcion ?? "";
                    const cantidad = item.tipo === "articulo" && item.cantidad != null ? ` (x${item.cantidad})` : "";
                    return `${descripcion}${cantidad}`;
                })
                    .join("<br/>")
                : sol.documento;
            fila.innerHTML = `
        <td>${sol.codigoOrden ?? ""}</td>
        <td>${sol.fecha}</td>
        <td>${sol.cedula}</td>
        <td>${sol.nombre}</td>
        <td>${serviciosHtml}</td>
        <td>${sol.copias}</td>
        <td>${sol.pago?.referencia4 ?? sol.referencia ?? (sol.pago?.tipo ?? "")}</td>
        <td>${this.formatBs(sol.tarifaTotal)} Bs.</td>
        <td>${this.formatUsd(sol.tarifaTotalUsd)} $</td>
        <td class="text-center" style="font-weight: bold; color: ${colorEstado};">${estadoLabel}</td>
        
        <td style="padding: 5px;">${columnaAccion}</td>
      `;
            this.tblRegistros.appendChild(fila);
        });
        // Asignar eventos a los botones de aprobar
        this.tblRegistros.querySelectorAll(".btn-aprobar").forEach((btn) => {
            btn.onclick = () => {
                const id = btn.getAttribute("data-id");
                if (id && this._onCambiarEstadoCallback) {
                    this._onCambiarEstadoCallback(id, "Aprobado");
                }
            };
        });
        // Agrega el evento click a los botones de rechazar y llama al callback con el nuevo estado "Rechazado"
        this.tblRegistros.querySelectorAll(".btn-rechazar").forEach((btn) => {
            btn.onclick = () => {
                const id = btn.getAttribute("data-id");
                if (id && this._onCambiarEstadoCallback) {
                    this._onCambiarEstadoCallback(id, "Rechazado");
                }
            };
        });
    }
}
//# sourceMappingURL=Cl_vImpresiones.js.map