export default class Cl_vAspirante {
    vista;
    inCedula;
    inNombre;
    inCargo;
    inPtsPruebaTecnica;
    inPtsPruebaPsicologica;
    inPtsEntrevista;
    btEnviar;
    constructor() {
        this.vista = document.getElementById("aspirante");
        this.inCedula = document.getElementById("aspirante_inCedula");
        this.inNombre = document.getElementById("aspirante_inNombre");
        this.inCargo = document.getElementById("aspirante_inCargo");
        this.inPtsPruebaTecnica = document.getElementById("aspirante_ptsTecnica");
        this.inPtsPruebaPsicologica = document.getElementById("aspirante_ptsPsicologica");
        this.inPtsEntrevista = document.getElementById("aspirante_ptsEntrevista");
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
    get ptsPruebaTecnica() {
        return parseInt(this.inPtsPruebaTecnica.value.trim()) || 0;
    }
    get ptsPruebaPsicologica() {
        return parseInt(this.inPtsPruebaPsicologica.value.trim()) || 0;
    }
    get ptsEntrevista() {
        return parseInt(this.inPtsEntrevista.value.trim()) || 0;
    }
}
//# sourceMappingURL=Cl_vAspirante.js.map