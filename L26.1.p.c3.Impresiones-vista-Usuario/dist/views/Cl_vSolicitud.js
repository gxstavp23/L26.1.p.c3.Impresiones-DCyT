export default class Cl_vSolicitud {
    // Elementos del DOM
    listaCarrito;
    carritoVacio;
    spanTotal;
    spanTotalUsd;
    spanTasa;
    badgeCarrito;
    divMensaje;
    // Inputs Cliente
    inCedula;
    inNombre;
    // modal pago elements
    modalPago;
    pagoTitulo;
    pagoDescripcion;
    pagoPreviewText;
    pagoMetodoRadios;
    pagoCedula;
    pagoBanco;
    pagoTelf;
    pagoRef4;
    ordenCodigo;
    btnConfirmPago;
    btnCancelPago;
    // Inputs para la Impresión
    inImpNombre;
    inImpHolja;
    inImpColor;
    inImpCopias;
    btnAddImp;
    // Inputs para la Descarga
    inDescEnlace;
    btnAddDesc;
    // Inputs para el Artículo
    inArtTipo;
    inArtCantidad;
    btnAddArt;
    // Botón Enviar
    btnEnviar;
    constructor() {
        this.listaCarrito = this.getElement("lista-carrito");
        this.carritoVacio = this.getElement("carrito-vacio");
        this.spanTotal = this.getElement("tarifa-total");
        this.spanTotalUsd = this.getElement("tarifa-total-usd");
        this.spanTasa = this.getElement("tasa-dia");
        this.badgeCarrito = this.getElement("carrito-badge");
        this.divMensaje = this.getElement("mensaje-notificacion");
        this.inCedula = this.getElement("cliente-cedula");
        this.inNombre = this.getElement("cliente-nombre");
        // Modal pago (Pago Móvil)
        this.modalPago = this.getElement("modal-pago");
        this.pagoTitulo = this.getElement("modal-pago-titulo");
        this.pagoDescripcion = this.getElement("modal-pago-descripcion");
        this.pagoPreviewText = this.getElement("pago-preview-text");
        this.pagoMetodoRadios = document.querySelectorAll('input[name="pago-metodo"]');
        this.pagoCedula = this.getElement("pago-cedula");
        this.pagoBanco = this.getElement("pago-banco");
        this.pagoTelf = this.getElement("pago-telefono");
        this.pagoRef4 = this.getElement("pago-ref4");
        this.ordenCodigo = this.getElement("orden-codigo");
        this.btnConfirmPago = this.getElement("btn-confirm-pago");
        this.btnCancelPago = this.getElement("btn-cancel-pago");
        this.inImpNombre = this.getElement("imp-nombre");
        this.inImpHolja = this.getElement("imp-hoja");
        this.inImpColor = this.getElement("imp-color");
        this.inImpCopias = this.getElement("imp-copias");
        this.btnAddImp = this.getElement("btn-add-impresion");
        this.inDescEnlace = this.getElement("desc-enlace");
        this.btnAddDesc = this.getElement("btn-add-descarga");
        this.inArtTipo = this.getElement("art-tipo");
        this.inArtCantidad = this.getElement("art-cantidad");
        this.btnAddArt = this.getElement("btn-add-articulo");
        this.btnEnviar = this.getElement("btn-enviar-solicitud");
    }
    getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`No se encontró el elemento con id "${id}"`);
        }
        return element;
    }
    getDatosCliente() {
        return {
            cedula: this.inCedula.value,
            nombre: this.inNombre.value,
            fecha: new Date().toISOString().split('T')[0]
        };
    }
    getDatosImpresion() {
        return {
            nombre: this.inImpNombre.value,
            hoja: this.inImpHolja.value,
            formato: this.inImpColor.value,
            copias: parseInt(this.inImpCopias.value) || 1
        };
    }
    getDatosDescarga() {
        return { enlace: this.inDescEnlace.value };
    }
    getDatosArticulo() {
        return {
            tipo: this.inArtTipo.value,
            cantidad: parseInt(this.inArtCantidad.value) || 1
        };
    }
    limpiarInputsImpresion() {
        this.inImpNombre.value = "";
        this.inImpCopias.value = "1";
    }
    limpiarInputsDescarga() {
        this.inDescEnlace.value = "";
    }
    limpiarInputsArticulo() {
        this.inArtCantidad.value = "1";
    }
    limpiarTodo() {
        this.inCedula.value = "";
        this.inNombre.value = "";
        this.limpiarInputsImpresion();
        this.limpiarInputsDescarga();
        this.limpiarInputsArticulo();
    }
    // Mostrar/ocultar modal de pago
    showPaymentModal(prefillCedula, ordenCodigo) {
        if (prefillCedula)
            this.pagoCedula.value = prefillCedula;
        if (ordenCodigo)
            this.ordenCodigo.textContent = ordenCodigo;
        this.setPaymentMethod('movil');
        this.actualizarCamposPago();
        this.actualizarPagoPreview();
        this.modalPago.classList.remove('hidden');
    }
    // Oculta el modal de pago y resetea los campos para la próxima vez que se abra
    //si le ponen una x al hidden no funciona 
    hidePaymentModal() {
        this.modalPago.classList.add('hidden');
    }
    actualizarCamposPago() {
        const metodo = this.getSelectedPaymentMethod(); // 'divisas', 'bolivares' o 'movil'
        const esEfectivo = metodo === 'divisas' || metodo === 'bolivares'; // Si es efectivo, se deshabilitan los campos de banco y referencia porque no son necesarios
        this.pagoCedula.disabled = false;
        this.pagoBanco.disabled = esEfectivo;
        this.pagoTelf.disabled = esEfectivo;
        this.pagoRef4.disabled = esEfectivo;
        if (esEfectivo) {
            this.pagoBanco.classList.add('bg-gray-100', 'cursor-not-allowed');
            this.pagoTelf.classList.add('bg-gray-100', 'cursor-not-allowed');
            this.pagoRef4.classList.add('bg-gray-100', 'cursor-not-allowed');
        }
        else {
            this.pagoBanco.classList.remove('bg-gray-100', 'cursor-not-allowed');
            this.pagoTelf.classList.remove('bg-gray-100', 'cursor-not-allowed');
            this.pagoRef4.classList.remove('bg-gray-100', 'cursor-not-allowed');
        }
    }
    actualizarPagoPreview() {
        const metodo = this.getSelectedPaymentMethod();
        if (metodo === 'divisas') {
            this.pagoTitulo.textContent = 'Confirmar Pago - Divisas';
            this.pagoDescripcion.textContent = 'El usuario pagará en efectivo en dólares. No se requieren datos bancarios ni referencia.';
            this.pagoPreviewText.textContent = 'Vista previa: Pago en Divisas seleccionado. Se enviará un objeto pago con banco y referencia como null.';
        }
        else if (metodo === 'bolivares') {
            this.pagoTitulo.textContent = 'Confirmar Pago - Bolívares';
            this.pagoDescripcion.textContent = 'El usuario pagará en efectivo en bolívares. No se requieren datos bancarios ni referencia.';
            this.pagoPreviewText.textContent = 'Vista previa: Pago en Bolívares seleccionado. Se enviará un objeto pago con banco y referencia como null.';
        }
        else {
            this.pagoTitulo.textContent = 'Confirmar Pago - Pago Móvil';
            this.pagoDescripcion.textContent = 'Completa los datos de Pago Móvil para enviar la referencia correctamente.';
            this.pagoPreviewText.textContent = 'Vista previa: Pago Móvil activo. Ingresa cédula, banco y referencia.';
        }
    }
    getSelectedPaymentMethod() {
        const seleccionado = Array.from(this.pagoMetodoRadios).find(radio => radio.checked);
        return seleccionado?.value ?? 'movil';
    }
    setPaymentMethod(value) {
        this.pagoMetodoRadios.forEach(radio => {
            radio.checked = radio.value === value;
        });
    }
    bindConfirmPayment(handler) {
        this.pagoMetodoRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.actualizarCamposPago();
                this.actualizarPagoPreview();
            });
        });
        // Esto es para cuando le dan ceaptar y solo valida toda la cuestion
        this.btnConfirmPago.addEventListener('click', () => {
            const metodo = this.getSelectedPaymentMethod();
            const ced = this.pagoCedula.value.trim();
            if (!ced) {
                this.mostrarMensaje('Ingrese la cédula para el pago.', 'error');
                return;
            }
            if (metodo === 'divisas') {
                handler({ tipo: 'Divisas', cedula: ced, banco: null, telefono: null, referencia4: null });
                this.hidePaymentModal();
                return;
            }
            if (metodo === 'bolivares') {
                handler({ tipo: 'Bolívares', cedula: ced, banco: null, telefono: null, referencia4: null });
                this.hidePaymentModal();
                return;
            }
            const banco = this.pagoBanco.value;
            const ref4 = this.pagoRef4.value.trim();
            const telf = this.pagoTelf.value;
            if (!/^\d{4}$/.test(ref4)) { // Validación simple para asegurarse de que sean 4 dígitos numéricos
                this.mostrarMensaje('Ingrese los últimos 4 dígitos de la referencia (solo números).', 'error');
                return;
            }
            handler({ tipo: 'movil', cedula: ced, banco, telefono: telf, referencia4: ref4 });
            this.hidePaymentModal();
        });
        this.btnCancelPago.addEventListener('click', () => this.hidePaymentModal());
    }
    //renderiza la tasa del dia en la vista, se llama desde el controlador cada vez que se actualiza la tasa
    mostrarTasaDelDia(tasa) {
        if (this.spanTasa) {
            this.spanTasa.textContent = `${tasa.toFixed(2)} Bs/$`;
        }
    }
    // Creo que el nombre lo explica a la perfeccion...
    renderizarCarrito(items, totalBs, totalUsd, tasa) {
        this.spanTotal.textContent = `${totalBs.toFixed(2)} Bs`;
        // Actualizamos el total general en dólares
        if (this.spanTotalUsd) {
            this.spanTotalUsd.textContent = `${totalUsd.toFixed(2)} $`;
        }
        this.badgeCarrito.textContent = `${items.length} items`;
        if (items.length === 0) {
            this.listaCarrito.innerHTML = '';
            // Clonar el elemento vacío para no moverlo del DOM original
            const emptyClone = this.carritoVacio.cloneNode(true);
            emptyClone.style.display = 'block';
            this.listaCarrito.appendChild(emptyClone);
            return;
        }
        this.carritoVacio.style.display = 'none';
        this.listaCarrito.innerHTML = ''; // Limpiar lista
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = "flex flex-col gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100";
            const subtotalBs = item.subtotal * tasa;
            // Esto es solo para poner bonito el div desde aqui, ya que no supe hacer en el html
            div.innerHTML = `
        <div class="flex justify-between items-start gap-4">
          <div class="pr-2 flex-1">
            <p class="text-sm font-bold text-gray-800">${item.descripcion}</p>
            <p class="text-xs text-gray-500">Cant: ${item.cantidad} | P/U: ${item.precioUnitario.toFixed(2)} $</p>
            <p class="text-sm font-semibold text-blue-600 mt-1">
              ${subtotalBs.toFixed(2)} Bs 
              <span class="text-green-600 text-xs ml-1 font-bold">(${item.subtotal.toFixed(2)} $)</span>
            </p>
          </div>
          <div class="flex flex-col items-end gap-2">
            <button class="text-red-400 hover:text-red-600 p-1 btn-eliminar-item" data-id="${item.id}" title="Eliminar">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
            <div class="flex items-center gap-1">
              <button class="text-gray-500 hover:text-gray-900 p-1 rounded-full border border-gray-200 btn-modificar-item" data-id="${item.id}" data-action="decrementar" title="Disminuir cantidad">-</button>
              <span class="text-sm font-semibold">${item.cantidad}</span>
              <button class="text-gray-500 hover:text-gray-900 p-1 rounded-full border border-gray-200 btn-modificar-item" data-id="${item.id}" data-action="incrementar" title="Aumentar cantidad">+</button>
            </div>
          </div>
        </div>
      `;
            this.listaCarrito.appendChild(div); // Agrega el div al contenedor del carrito
        });
    }
    mostrarMensaje(mensaje, tipo) {
        this.divMensaje.textContent = mensaje;
        this.divMensaje.className = `p-3 mb-3 rounded-lg text-sm font-semibold text-center transition-all ${tipo === 'exito' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
        this.divMensaje.classList.remove('hidden');
        setTimeout(() => this.divMensaje.classList.add('hidden'), 5000);
    }
    bindAddImpresion(handler) {
        this.btnAddImp.addEventListener("click", handler);
    }
    bindAddDescarga(handler) {
        this.btnAddDesc.addEventListener("click", handler);
    }
    bindAddArticulo(handler) {
        this.btnAddArt.addEventListener("click", handler);
    }
    bindEliminarItem(handler) {
        // Usamos delegación de eventos en el contenedor padre
        this.listaCarrito.addEventListener("click", (e) => {
            const target = e.target;
            const btn = target.closest('.btn-eliminar-item');
            if (btn) {
                const id = btn.getAttribute('data-id');
                if (id)
                    handler(id);
            }
        });
    }
    // Similar al eliminar, pero para los botones de modificar cantidad
    bindModificarItem(handler) {
        this.listaCarrito.addEventListener("click", (e) => {
            const target = e.target;
            const btn = target.closest('.btn-modificar-item');
            if (btn) {
                const id = btn.getAttribute('data-id');
                const accion = btn.getAttribute('data-action');
                if (id && accion && (accion === 'incrementar' || accion === 'decrementar')) {
                    handler(id, accion);
                }
            }
        });
    }
    // Ya esto es pa' cuando lo mandan a solicitar
    bindEnviarPedido(handler) {
        this.btnEnviar.addEventListener("click", handler);
    }
}
//# sourceMappingURL=Cl_vSolicitud.js.map