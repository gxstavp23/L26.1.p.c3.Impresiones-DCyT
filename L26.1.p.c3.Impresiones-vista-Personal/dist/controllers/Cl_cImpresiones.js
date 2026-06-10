import Cl_sSolicitud from "../services/Cl_sSolicitud.js";
export default class Cl_cImpresiones {
    modelo;
    vista;
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        // Vinculación de eventos de la interfaz
        this.vista.onRecargar(() => this.cargarDatos());
        this.vista.onChangeFiltroEstado(() => this.actualizarVista());
        this.vista.onChangeFiltroFecha(() => this.actualizarVista());
        this.vista.onChangeBuscarOrden(() => this.actualizarVista());
        this.vista.onAccionCambiarEstado((id, nuevoEstado) => this.cambiarEstadoSolicitud(id, nuevoEstado));
        // Carga inicial automatizada al abrir el panel
        this.cargarDatos();
    }
    async cargarDatos() {
        let resultado = await Cl_sSolicitud.getSolicitudes();
        if (resultado.ok === false) {
            alert("Error: No se pudo obtener la información de MockAPI.");
            return;
        }
        this.modelo.setSolicitudes(resultado.tabla);
        this.actualizarVista();
    }
    actualizarVista() {
        let solicitudesFiltradas = this.modelo.getFiltrados(this.vista.filtroEstado, this.vista.filtroFecha);
        //Si hay algo en la caja de búsqueda, filtramos sobre la lista actual
        if (this.vista.hashCodigo && this.vista.hashCodigo.trim() !== "") {
            const busqueda = this.vista.hashCodigo.toLowerCase().trim();
            // Filtramos la lista para que solo contenga los que coinciden (aunque sea parcial)
            solicitudesFiltradas = solicitudesFiltradas.filter(reg => reg.modelo.codigoOrden.toLowerCase().includes(busqueda));
        }
        let datosPlanos = solicitudesFiltradas.map((reg) => ({
            id: reg.id,
            cedula: reg.modelo.cedula,
            nombre: reg.modelo.nombre,
            documento: reg.modelo.documento,
            copias: reg.modelo.copias,
            referencia: reg.modelo.referencia,
            estado: reg.modelo.estado,
            fecha: reg.modelo.fecha,
            tarifaTotal: reg.modelo.tarifaTotal(),
            tarifaTotalUsd: reg.modelo.tarifaTotalUsd(),
            codigoOrden: reg.modelo.codigoOrden,
            datosPago: reg.modelo.datosPago,
            pago: reg.modelo.pago,
            items: reg.modelo.items,
            clienteRaw: reg.modelo.clienteRaw,
        }));
        this.vista.mostrarImpresiones(datosPlanos);
        this.vista.mostrarEstadisticas(this.modelo.calcularTotalCopias(), this.modelo.calcularTotalIngresos(), this.modelo.calcularTotalIngresosUsd(), this.modelo.calcularPorcentajeIngresosImpresiones(), this.modelo.calcularPorcentajeIngresosArticulos(), this.modelo.calcularPorcentajeIngresosdescargas());
    }
    //
    async cambiarEstadoSolicitud(id, nuevoEstado) {
        let confirmacion = confirm(`¿Está seguro de cambiar el estado de esta solicitud a "${nuevoEstado}"?`);
        if (!confirmacion)
            return;
        const clienteRaw = this.modelo.getClienteRawPorId(id);
        let resultado = await Cl_sSolicitud.cambiarEstado(id, nuevoEstado, clienteRaw);
        alert(resultado.mensaje);
        if (resultado.ok) {
            this.modelo.actualizarEstadoSolicitud(id, nuevoEstado);
            this.actualizarVista();
        }
    }
}
//# sourceMappingURL=Cl_cImpresiones.js.map