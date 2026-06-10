export default class Cl_mSolicitud {
    _cedula = 0;
    _nombre = "";
    _documento = "";
    _copias = 0;
    _referencia = "";
    _estado = "Verificando pago";
    _fecha = "";
    _codigoOrden = "";
    _items = [];
    _datosPago = null;
    _pago = null;
    _clienteRaw = null;
    constructor({ cedula, nombre, documento, copias, referencia, estado = "Verificando pago", fecha, codigoOrden = "", items = [], datosPago = null, pago = null, clienteRaw = null, }) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.documento = documento;
        this.copias = copias;
        this.referencia = referencia;
        this.estado = estado;
        this.fecha = fecha;
        this._codigoOrden = codigoOrden;
        this._items = items;
        this._datosPago = datosPago;
        this._pago = pago;
        this._clienteRaw = clienteRaw ?? null;
    }
    get cedula() {
        return this._cedula;
    }
    set cedula(value) {
        this._cedula = value;
    }
    get nombre() {
        return this._nombre;
    }
    set nombre(value) {
        this._nombre = value;
    }
    get documento() {
        return this._documento;
    }
    set documento(value) {
        this._documento = value;
    }
    get copias() {
        return this._copias;
    }
    set copias(value) {
        this._copias = value;
    }
    get referencia() {
        return this._referencia;
    }
    set referencia(value) {
        this._referencia = value;
    }
    get estado() {
        return this._estado;
    }
    set estado(value) {
        this._estado = value;
    }
    get fecha() {
        return this._fecha;
    }
    set fecha(value) {
        this._fecha = value;
    }
    tarifaTotal() {
        if (typeof this._datosPago?.totalBs === "number") {
            return this._datosPago.totalBs;
        }
        return this.copias * 5;
    }
    tarifaTotalUsd() {
        if (typeof this._datosPago?.totalUsd === "number") {
            return this._datosPago.totalUsd;
        }
        if (typeof this._datosPago?.totalBs === "number" &&
            typeof this._datosPago?.tasaAplicada === "number" &&
            this._datosPago.tasaAplicada !== 0) {
            return this._datosPago.totalBs / this._datosPago.tasaAplicada;
        }
        return 0;
    }
    isDisponible() {
        return this.estado === "Disponible";
    }
    get codigoOrden() {
        return this._codigoOrden;
    }
    get items() {
        return this._items;
    }
    get datosPago() {
        return this._datosPago;
    }
    get clienteRaw() {
        return this._clienteRaw;
    }
    get pago() {
        return this._pago;
    }
    toJSON() {
        return {
            cedula: this.cedula,
            nombre: this.nombre,
            documento: this.documento,
            copias: this.copias,
            referencia: this.referencia,
            estado: this.estado,
            fecha: this.fecha,
            codigoOrden: this.codigoOrden,
            datosPago: this.datosPago,
            pago: this.pago,
            items: this.items,
        };
    }
}
//# sourceMappingURL=Cl_mSolicitud.js.map