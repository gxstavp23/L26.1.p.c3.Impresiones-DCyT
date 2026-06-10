export default class Cl_mAspirante {
    _nombre = "";
    _cedula = 0;
    _cargo = "Desarrollador Senior";
    _expLaboral = 0;
    _pregunta1 = 0;
    _pregunta2 = 0;
    _pregunta3 = 0;
    constructor({ cedula, nombre, cargo, expLaboral, pregunta1, pregunta2, pregunta3 }) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.cargo = cargo;
        this.expLaboral = expLaboral;
        this.pregunta1 = pregunta1;
        this.pregunta2 = pregunta2;
        this.pregunta3 = pregunta3;
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
    get cargo() {
        return this._cargo;
    }
    set cargo(value) {
        if (value === "Desarrollador Senior" || value === "Gerente de Proyectos") {
            this._cargo = value;
        }
        else {
            throw new Error("Cargo debe ser 'Desarrollador Senior' o 'Gerente de Proyectos'");
        }
    }
    get pregunta1() {
        return this._pregunta1;
    }
    set pregunta1(value) {
        this._pregunta1 = value;
    }
    get pregunta2() {
        return this._pregunta2;
    }
    set pregunta2(value) {
        this._pregunta2 = value;
    }
    get pregunta3() {
        return this._pregunta3;
    }
    set pregunta3(value) {
        this._pregunta3 = value;
    }
    get expLaboral() {
        return this._expLaboral;
    }
    set expLaboral(value) {
        this._expLaboral = value;
    }
    toJSON() {
        return {
            cedula: this.cedula,
            nombre: this.nombre,
            cargo: this.cargo,
            expLaboral: this.expLaboral,
            pregunta1: this.pregunta1,
            pregunta2: this.pregunta2,
            pregunta3: this.pregunta3
        };
    }
}
//# sourceMappingURL=Cl_mAspirante.js.map