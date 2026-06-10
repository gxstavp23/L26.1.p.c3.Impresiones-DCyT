export default class Cl_vConcurso {
    btRecargar;
    chkSoloSeleccionados;
    tblRegistros;
    constructor() {
        this.tblRegistros = document.getElementById("evaluacion_tblRegistros");
        this.btRecargar = document.getElementById("evaluacion_btRecargar");
        this.chkSoloSeleccionados = document.getElementById("evaluacion_chkSoloSeleccionados");
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
    mostrarAspirantes(aspirantes) {
        this.tblRegistros.innerHTML = "";
        aspirantes.forEach((asp) => {
            this.tblRegistros.innerHTML += `<tr>
        <td>${asp.cedula}</td>
        <td>${asp.nombre}</td>
        <td>${asp.cargo}</td>
        <td>${asp.expLaboral} Años</td>
        <td>${asp.pregunta1}Pts</td>
        <td>${asp.pregunta2}Pts</td>
        <td>${asp.pregunta3}Pts</td>
        <td>${asp.puntajeTotal()}</td>
        <td>${asp.Seleccionado() ? "SELECCIONADO" : "NO PASA"}</td>
      </tr>`;
        });
    }
}
//# sourceMappingURL=Cl_vConcurso.js.map