export default class Cl_vAspirante {
    vista;
    inCedula;
    inNombre;
    inCargo;
    inExpLaboral;
    inPregunta1;
    inPregunta2;
    inPregunta3;
    btEnviar;
    constructor() {
        this.vista = document.getElementById("aspirante");
        this.inCedula = document.getElementById("aspirante_inCedula");
        this.inNombre = document.getElementById("aspirante_inNombre");
        this.inCargo = document.getElementById("aspirante_inCargo");
        this.inExpLaboral = document.getElementById("aspirante_inExpLaboral");
        this.inPregunta1 = document.getElementById("aspirante_inPregunta1");
        this.inPregunta2 = document.getElementById("aspirante_inPregunta2");
        this.inPregunta3 = document.getElementById("aspirante_inPregunta3");
        this.btEnviar = document.getElementById("aspirante_btEnviar");
    }
    onEnviar(callback) {
        this.btEnviar.onclick = callback;
    }
    get cedula() {
        return parseInt(this.inCedula.value.trim()) || 0;
    }
    get nombre() {
        return this.inNombre.value.trim();
    }
    get cargo() {
        return this.inCargo.value.trim();
    }
    get pregunta1() {
        const radio = this.inPregunta1.querySelector('input[name="p1"]:checked');
        return radio ? parseInt(radio.value) : 0;
    }
    get pregunta2() {
        const radio = this.inPregunta2.querySelector('input[name="p2"]:checked');
        return radio ? parseInt(radio.value) : 0;
    }
    get pregunta3() {
        const radio = this.inPregunta3.querySelector('input[name="p3"]:checked');
        return radio ? parseInt(radio.value) : 0;
    }
    get expLaboral() {
        return parseInt(this.inExpLaboral.value.trim()) || 0;
    }
}
//# sourceMappingURL=Cl_vAspirante.js.map