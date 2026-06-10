export default class Cl_mQuiz {
    _cedula = 0;
    _nombre = "";
    _respuesta1 = 0;
    _respuesta2 = "negro";
    constructor({ cedula, nombre, respuesta1, respuesta2, }) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.respuesta1 = respuesta1;
        this.respuesta2 = respuesta2;
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
    get respuesta1() {
        return this._respuesta1;
    }
    set respuesta1(value) {
        this._respuesta1 = value;
    }
    get respuesta2() {
        return this._respuesta2;
    }
    set respuesta2(value) {
        if (value === "negro" || value === "verde" || value === "plateado") {
            this._respuesta2 = value;
        }
        else {
            throw new Error("Respuesta2 debe ser 'negro', 'verde' o 'plateado'");
        }
    }
    toJSON() {
        return {
            cedula: this.cedula,
            nombre: this.nombre,
            respuesta1: this.respuesta1,
            respuesta2: this.respuesta2,
        };
    }
}
//# sourceMappingURL=Cl_mQuiz.js.map