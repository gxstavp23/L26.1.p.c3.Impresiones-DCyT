import Cl_mSolicitud from "./Cl_mSolicitud.js";
export default class Cl_mImpresiones {
    _registros = []; //Crea el arreglo vacío para almacenar los registros de solicitudes
    _mapaHash = new Map();
    setSolicitudes(array) {
        this._registros = [];
        this._mapaHash.clear(); // limpia el indice viejo
        array.forEach((item) => {
            const cliente = item.cliente ?? item;
            const items = item.items ?? []; // Se asegura de que "items" sea un arreglo
            const copias = items.length > 0 // Si hay items, suma cantidades a la impresion
                ? items.reduce((acc, actual) => {
                    const tipo = String(actual.tipo ?? "").trim().toLowerCase(); // manda a todo en minuscula 
                    return acc + ((tipo.includes("impres") ? Number(actual.cantidad) || 0 : 0)); // Solo suma las cantidades de los items que sean de tipo "impresion"
                }, 0)
                : Number(item.copias) || 0; // Si no hay items, toma el valor de "copias" directamente
            const documento = items.length > 0 // Si hay items, concatena las descripciones de los items para mostrar en la tabla
                ? items.map((it) => it.descripcion).join(" | ") // Si no hay items, toma el valor de "documento" directamente
                : item.documento ?? "";
            const referencia = item.referencia ?? item.pago?.tipo ?? ""; // Intenta obtener la referencia de pago, si no existe, deja vacío
            const estado = cliente.estado ?? item.estado ?? "Verificando pago"; // Intenta obtener el estado del cliente, si no existe, intenta obtenerlo del item, si tampoco existe, asigna "Verificando pago"
            const fecha = cliente.fecha ?? item.fecha ?? ""; // Intenta obtener la fecha del cliente, si no existe, intenta obtenerlo del item, si tampoco existe, asigna ""
            const datosPago = item.datosPago ?? item.datosPago ?? null; // Intenta obtener los datos de pago, si no existen, asigna null
            // Crea una instancia de Cl_mSolicitud con los datos obtenidos y la agrega al arreglo de registros
            const modeloSolicitud = new Cl_mSolicitud({
                cedula: Number(cliente.cedula) || 0,
                nombre: cliente.nombre ?? "",
                documento,
                copias,
                referencia,
                estado,
                fecha,
                codigoOrden: cliente.codigoOrden ?? "",
                items,
                datosPago,
                pago: item.pago ?? null,
                clienteRaw: cliente,
            });
            this._registros.push({
                id: item.id,
                modelo: modeloSolicitud,
            });
            const llave = modeloSolicitud.codigoOrden.toLowerCase().trim(); // se limpia la llave borrando los espacios en blancos y dejandola en minusculas 
            if (llave)
                this._mapaHash.set(llave, this._registros[this._registros.length - 1]); // esto vincula el código de la orden con su respectivo registro en el mapa.
        });
    }
    //hash
    buscarPorHash(codigo) {
        return this._mapaHash.get(codigo.toLowerCase().trim());
    }
    // calcila el total de copias sumando las copias de cada solicitud en el arreglo de registros
    calcularTotalCopias() {
        return this._registros.reduce((acc, reg) => acc + reg.modelo.copias, 0);
    }
    //
    calcularTotalIngresos() {
        return this._registros.reduce((acc, reg) => acc + reg.modelo.tarifaTotal(), 0);
    }
    // calcula el total de ingresos en USD sumando los ingresos en USD de cada solicitud en el arreglo de registros
    calcularTotalIngresosUsd() {
        return this._registros.reduce((acc, reg) => acc + reg.modelo.tarifaTotalUsd(), 0);
    }
    // actualiza el estado de una solicitud específica buscando por su ID en el arreglo de registros y modificando su estado
    actualizarEstadoSolicitud(id, nuevoEstado) {
        const registro = this._registros.find((reg) => reg.id === id);
        if (registro) {
            registro.modelo.estado = nuevoEstado;
        }
    }
    // devuelve el arreglo de registros completo
    get registros() {
        return this._registros;
    }
    // obtiene los datos del cliente sin procesar (clienteRaw) de una solicitud específica buscando por su ID en el arreglo de registros
    getClienteRawPorId(id) {
        const registro = this._registros.find((reg) => reg.id === id);
        return registro ? registro.modelo.clienteRaw : null;
    }
    // Regla de filtrado solicitada
    getFiltrados(filtroEstado, filtroFecha) {
        let resultado = this._registros;
        // Paso 1: Filtrar por Estado
        if (filtroEstado === "Aprobados") {
            resultado = resultado.filter(reg => reg.modelo.estado === "Aprobado");
        }
        else if (filtroEstado === "Rechazados") {
            resultado = resultado.filter(reg => reg.modelo.estado === "Rechazado");
        }
        // Paso 2: Filtrar sobre el resultado anterior usando la Fecha
        if (filtroFecha && filtroFecha !== "") {
            resultado = resultado.filter(reg => {
                const fechaReg = reg.modelo.fecha || "";
                return fechaReg.includes(filtroFecha);
            });
        }
        return resultado;
    }
    //porcentaje
    calcularPorcentajeIngresosImpresiones() {
        let acImpresiones = 0;
        let totalUsdGlobal = this.calcularTotalIngresosUsd();
        if (totalUsdGlobal === 0)
            return 0;
        this._registros.forEach(reg => {
            if (reg.modelo.items && reg.modelo.items.length > 0) {
                reg.modelo.items.forEach((item) => {
                    if (item.tipo === "impresion") {
                        acImpresiones += item.subtotal;
                    }
                });
            }
        });
        return (acImpresiones / totalUsdGlobal) * 100;
    }
    calcularPorcentajeIngresosArticulos() {
        let acArticulos = 0;
        let totalUsdGlobal = this.calcularTotalIngresosUsd();
        if (totalUsdGlobal === 0)
            return 0;
        this._registros.forEach(reg => {
            if (reg.modelo.items && reg.modelo.items.length > 0) {
                reg.modelo.items.forEach((item) => {
                    if (item.tipo === "articulo") {
                        acArticulos += item.subtotal;
                    }
                });
            }
        });
        return (acArticulos / totalUsdGlobal) * 100;
    }
    calcularPorcentajeIngresosdescargas() {
        let acDescargas = 0;
        let totalUsdGlobal = this.calcularTotalIngresosUsd();
        if (totalUsdGlobal === 0)
            return 0;
        this._registros.forEach(reg => {
            if (reg.modelo.items && reg.modelo.items.length > 0) {
                reg.modelo.items.forEach((item) => {
                    if (item.tipo === "descarga") {
                        acDescargas += item.subtotal;
                    }
                });
            }
        });
        return (acDescargas / totalUsdGlobal) * 100;
    }
}
//# sourceMappingURL=Cl_mImpresiones.js.map