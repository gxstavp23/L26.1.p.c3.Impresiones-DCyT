export default class Cl_vQuiz {
    vista;
    inCedula;
    inNombre;
    inRespuesta1;
    inRespuesta2;
    btCancelar;
    btEnviar;
    constructor() {
        this.vista = document.getElementById("vehiculo");
        this.inCedula = document.getElementById("quiz_inCedula");
        this.inNombre = document.getElementById("quiz_inNombre");
        this.inRespuesta1 = document.getElementById("quiz_inRespuesta1");
        this.inRespuesta2 = document.getElementById("quiz_inRespuesta2");
        this.btCancelar = document.getElementById("quiz_btCancelar");
        this.btEnviar = document.getElementById("quiz_btEnviar");
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
    get respuesta1() {
        return parseInt(this.inRespuesta1.value.trim()) || 0;
    }
    get respuesta2() {
        return this.inRespuesta2.value.trim();
    }
}
//# sourceMappingURL=Cl_vQuiz.js.map