import Cl_mSolicitud from "../models/Cl_mSolicitud.js";
export default class Cl_cSolicitud {
    vista;
    servicio;
    modelo;
    constructor(vista, servicio) {
        this.vista = vista;
        this.servicio = servicio;
        this.modelo = new Cl_mSolicitud();
        // Renderiza el carrito y la tasa del dia
        this.vista.mostrarTasaDelDia(this.modelo.getTasa());
        this.actualizarVistaCarrito();
        // Enlazamos los eventos de la vista con los metodos del controlador
        this.vista.bindAddImpresion(this.handleAddImpresion.bind(this));
        this.vista.bindAddDescarga(this.handleAddDescarga.bind(this));
        this.vista.bindAddArticulo(this.handleAddArticulo.bind(this));
        this.vista.bindEliminarItem(this.handleEliminarItem.bind(this));
        this.vista.bindModificarItem(this.handleModificarItem.bind(this));
        this.vista.bindEnviarPedido(this.handleEnviarPedido.bind(this));
        // Bind para confirmar datos de pago desde la vista (modal)
        this.vista.bindConfirmPayment(this.handleConfirmPayment.bind(this));
    }
    //si hay algun cambio, esta vaina actualiza el carro y lo renderiza, 
    actualizarVistaCarrito() {
        this.vista.renderizarCarrito(this.modelo.getItems(), this.modelo.getTotalBs(), this.modelo.getTotalUsd(), this.modelo.getTasa());
    }
    handleAddImpresion() {
        const datos = this.vista.getDatosImpresion();
        if (!datos.nombre) {
            this.vista.mostrarMensaje("Debe ingresar el nombre del archivo a imprimir.", "error");
            return;
        }
        this.modelo.agregarImpresion(datos.nombre, datos.hoja, datos.formato, datos.copias);
        this.vista.limpiarInputsImpresion();
        this.actualizarVistaCarrito();
    }
    handleAddDescarga() {
        const datos = this.vista.getDatosDescarga();
        if (!datos.enlace) {
            this.vista.mostrarMensaje("Debe ingresar el enlace de descarga.", "error");
            return;
        }
        this.modelo.agregarDescarga(datos.enlace);
        this.vista.limpiarInputsDescarga();
        this.actualizarVistaCarrito();
    }
    handleAddArticulo() {
        const datos = this.vista.getDatosArticulo();
        if (datos.cantidad <= 0) {
            this.vista.mostrarMensaje("La cantidad debe ser mayor a 0.", "error");
            return;
        }
        this.modelo.agregarArticulo(datos.tipo, datos.cantidad);
        this.vista.limpiarInputsArticulo();
        this.actualizarVistaCarrito();
    }
    handleEliminarItem(id) {
        this.modelo.eliminarItem(id);
        this.actualizarVistaCarrito();
    }
    handleModificarItem(id, accion) {
        const delta = accion === 'incrementar' ? 1 : -1;
        this.modelo.modificarCantidadItem(id, delta); // El modelo se encarga de eliminar el item si la cantidad llega a 0
        this.actualizarVistaCarrito();
    }
    ordenIdActual = null;
    async handleEnviarPedido() {
        const cliente = this.vista.getDatosCliente();
        const items = this.modelo.getItems();
        if (!cliente.cedula || !cliente.nombre) {
            this.vista.mostrarMensaje("Por favor complete sus datos personales.", "error");
            return;
        }
        if (items.length === 0) {
            this.vista.mostrarMensaje("El carrito está vacío. Agregue algún servicio antes de enviar.", "error");
            return;
        }
        this.ordenIdActual = this.generarOrdenId();
        // Mostrar modal de pago con el código de orden para que el usuario lo acepte
        this.vista.showPaymentModal(cliente.cedula, this.ordenIdActual);
    }
    generarOrdenId() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const bytes = new Uint8Array(5);
        crypto.getRandomValues(bytes); // Genera un código aleatorio de 5 caracteres para la orden
        return Array.from(bytes).map((byte) => chars[byte % chars.length]).join("");
    }
    // Este método se llama cuando el usuario confirma los datos de pago en la vista (modal)
    async handleConfirmPayment(pago) {
        const ordenId = this.ordenIdActual ?? this.generarOrdenId();
        const cliente = { ...this.vista.getDatosCliente(), codigoOrden: ordenId };
        this.vista.mostrarMensaje("Procesando solicitud, por favor espere...", "exito");
        const dto = {
            ...this.modelo.generarDTO(cliente),
            pago
        };
        const exito = await this.servicio.enviarSolicitud(dto);
        if (exito) {
            this.vista.mostrarMensaje("¡Solicitud enviada con éxito! Verificaremos su pago en breve.", "exito");
            //Se llaman estos metodos que son para limpiar la vista entera :)
            this.modelo.vaciarCarrito();
            this.vista.limpiarTodo();
            this.actualizarVistaCarrito();
        }
        else {
            this.vista.mostrarMensaje("Ocurrió un error al enviar la solicitud. Intente nuevamente.", "error");
        }
    }
}
//# sourceMappingURL=Cl_cSolicitud.js.map