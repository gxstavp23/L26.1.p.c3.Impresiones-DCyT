import I_vImpresiones from "../interfaces/I_vImpresiones.js";
import Cl_mSolicitud from "../models/Cl_mSolicitud.js";

export default class Cl_vImpresiones implements I_vImpresiones {
  vista: HTMLElement;
  lblTotalCopias: HTMLElement;
  lblTotalIngresos: HTMLElement;
  lblTotalIngresosUsd: HTMLElement;
  btRecargar: HTMLButtonElement;
  selFiltroEstado: HTMLSelectElement;
  selFiltroFecha: HTMLInputElement
  selHashCodigo: HTMLInputElement;
  tblRegistros: HTMLTableSectionElement;
  //porcentajes
lblPorcImpresiones: HTMLElement;
lblPorcArticulos: HTMLElement;
lblPorcDescargas: HTMLElement;
  
  private _onCambiarEstadoCallback: ((id: string, nuevoEstado: string) => void) | null = null;

  constructor() {
    this.vista = document.body as HTMLElement;
    this.lblTotalCopias = document.getElementById("stat-copias") as HTMLElement;
    this.lblTotalIngresos = document.getElementById("stat-ingresos") as HTMLElement;
    this.lblTotalIngresosUsd = document.getElementById("stat-ingresos-usd") as HTMLElement;
    this.lblPorcImpresiones = document.getElementById("stat-porc-impresiones") as HTMLElement;
    this.lblPorcArticulos = document.getElementById("stat-porc-articulos") as HTMLElement;
    this.lblPorcDescargas = document.getElementById("stat-porc-descargas") as HTMLElement;
    this.btRecargar = document.getElementById("btn-recargar") as HTMLButtonElement;
    this.selFiltroEstado = document.getElementById("sel-filtro-estado") as HTMLSelectElement;
    this.selFiltroFecha = document.getElementById("sel-filtro-fecha") as HTMLInputElement;
    this.selHashCodigo = document.getElementById("sel-hash-codigo") as HTMLInputElement
    this.tblRegistros = document.getElementById("tbl-body") as HTMLTableSectionElement;

    if (!this.selHashCodigo) {
        console.error("ERROR: No se encontró el elemento con id 'sel-hash-codigo' en tu HTML");
    }
  }

  get filtroEstado(): string {
    return this.selFiltroEstado.value;
  }

   get filtroFecha(): string {
    return this.selFiltroFecha.value;
  }

   get hashCodigo(): string {
    return this.selHashCodigo.value;
  }

  onRecargar(callback: () => void): void {
    this.btRecargar.onclick = callback;
  }

  onChangeFiltroEstado(callback: () => void): void {
    this.selFiltroEstado.onchange = callback;
  }

  onChangeFiltroFecha(callback: () => void): void {
    this.selFiltroFecha.onchange = callback;
  }

  // Vincula el evento de escritura tiempo real al campo de búsqueda
  onChangeBuscarOrden(callback: () => void): void { 
  this.selHashCodigo.oninput = callback
} 

  onAccionCambiarEstado(callback: (id: string, nuevoEstado: string) => void): void {
    this._onCambiarEstadoCallback = callback; 
  }

  // formatea un número a formato de moneda en Bolívares (Bs.) con separadores de miles y dos decimales
  private formatBs(value: number): string {
    return value.toLocaleString("es-VE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  // formatea un número a formato de moneda en Dólares (USD) con separadores de miles y dos decimales
  private formatUsd(value: number): string {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // recibe un arreglo de solicitudes planas (datos sin procesar) y los muestra en la tabla de registros
  mostrarEstadisticas(totalCopias: number, totalIngresos: number, totalIngresosUsd: number, porcImpresiones: number, porcArticulos: number, porcDescargas: number): void {
    this.lblTotalCopias.innerText = totalCopias.toString();
    this.lblTotalIngresos.innerText = this.formatBs(totalIngresos);
    this.lblTotalIngresosUsd.innerText = this.formatUsd(totalIngresosUsd);
    this.lblPorcImpresiones.innerText = porcImpresiones.toFixed(2) + "%";
    this.lblPorcArticulos.innerText = porcArticulos.toFixed(2) + "%";
    this.lblPorcDescargas.innerText = porcDescargas.toFixed(2) + "%";
  }

  
  mostrarImpresiones(solicitudesPlanas: any[]): void {
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
      } else {
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
            .map((item: any) => {
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
      (btn as HTMLButtonElement).onclick = () => {
        const id = btn.getAttribute("data-id");
        if (id && this._onCambiarEstadoCallback) {
          this._onCambiarEstadoCallback(id, "Aprobado");
        }
      };
    });

    // Agrega el evento click a los botones de rechazar y llama al callback con el nuevo estado "Rechazado"
    this.tblRegistros.querySelectorAll(".btn-rechazar").forEach((btn) => {
      (btn as HTMLButtonElement).onclick = () => {
        const id = btn.getAttribute("data-id");
        if (id && this._onCambiarEstadoCallback) {
          this._onCambiarEstadoCallback(id, "Rechazado");
        }
      };
    });
  }
}