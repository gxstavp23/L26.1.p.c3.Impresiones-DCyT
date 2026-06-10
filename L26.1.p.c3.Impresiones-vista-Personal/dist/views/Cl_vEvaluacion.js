export default class Cl_vEvaluacion {
    btRecargar;
    chkSoloSeleccionados;
    tblRegistros;
    constructor() {
        this.tblRegistros = document.getElementById("evaluacion_tblRegistros");
        this.btRecargar = document.getElementById("evaluacion_btRecargar");
        this.chkSoloSeleccionados = document.getElementById("evaluacion_chkSoloSeleccionados");
        // Patrón exacto del profesor para inicializar el evento
        this.chkSoloSeleccionados.onchange = () => this.onChangeSoloSeleccionados(() => { });
    }
    get Selecionados() {
        return this.chkSoloSeleccionados.checked;
    }
    onChangeSoloSeleccionados(callback) {
        this.chkSoloSeleccionados.onchange = callback;
    }
    onRecargar(callback) {
        this.btRecargar.onclick = callback;
    }
    // Método idéntico al 'mostrarQuices' del profesor
    mostrarAspirantes(aspirantes) {
        this.tblRegistros.innerHTML = "";
        aspirantes.forEach((asp) => {
            this.tblRegistros.innerHTML += `<tr>
        <td>${asp.cedula}</td>
        <td>${asp.nombre}</td>
        <td>${asp.cargo}</td>
        <td>${asp.puntajeTotal()}</td>
        <td>${asp.Seleccionado() ? "SELECCIONADO" : "NO PASA"}</td>
      </tr>`;
        });
    }
}
//# sourceMappingURL=Cl_vEvaluacion.js.map