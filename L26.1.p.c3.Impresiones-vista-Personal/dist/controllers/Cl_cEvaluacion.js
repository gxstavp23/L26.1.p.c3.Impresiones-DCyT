import Cl_sAspirante from "../services/Cl_sAspirante.js";
export default class Cl_cEvaluacion {
    modelo;
    vista;
    constructor({ modelo, vista }) {
        this.modelo = modelo;
        this.vista = vista;
        this.vista.onRecargar(() => this.btRecargarOnClick());
        this.vista.onChangeSoloSeleccionados(() => this.onChangeSoloCorrectos());
        this.btRecargarOnClick();
    }
    onChangeSoloCorrectos() {
        this.btRecargarOnClick();
    }
    async btRecargarOnClick() {
        let resultado = await Cl_sAspirante.obtenerAspirantes();
        if (resultado.ok === false) {
            alert("Error: No se pudo conectar con el servidor");
            return;
        }
        this.modelo.setAspirantes(resultado.aspirantes);
        this.vista.mostrarAspirantes(this.modelo.getAspirantes(this.vista.Selecionados));
    }
}
//# sourceMappingURL=Cl_cEvaluacion.js.map