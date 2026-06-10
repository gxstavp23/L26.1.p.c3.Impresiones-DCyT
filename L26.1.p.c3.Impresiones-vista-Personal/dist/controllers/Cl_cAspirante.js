import Cl_mAspirante from "../models/Cl_mAspirante.js";
import Cl_sAspirante from "../services/Cl_sAspirante.js";
export default class Cl_cAspirante {
    vista;
    constructor(vista) {
        this.vista = vista;
        this.vista.onEnviar(() => this.btEnviarOnClick());
    }
    async btEnviarOnClick() {
        if (this.vista.ptsPruebaTecnica < 0 || this.vista.ptsPruebaTecnica > 100 ||
            this.vista.ptsPruebaPsicologica < 0 || this.vista.ptsPruebaPsicologica > 100 ||
            this.vista.ptsEntrevista < 0 || this.vista.ptsEntrevista > 100) {
            alert("Error: Las calificaciones de las pruebas deben estar estrictamente entre 0 y 100 puntos.");
            return;
        }
        let resultado = new Cl_mAspirante({
            cedula: this.vista.cedula,
            nombre: this.vista.nombre,
            cargo: this.vista.cargo,
            ptsPruebaTecnica: this.vista.ptsPruebaTecnica,
            ptsPruebaPsicologica: this.vista.ptsPruebaPsicologica,
            ptsEntrevista: this.vista.ptsEntrevista,
        });
        let chkExiste = await Cl_sAspirante.existeAspirante(resultado.cedula);
        if (chkExiste.ok === false) {
            alert("Error: No se pudo conectar con el servidor");
            return;
        }
        if (chkExiste.existe) {
            alert("Ya existe un Aspirante registrado con esa cédula");
            return;
        }
        Cl_sAspirante.guardarRegistro(resultado).then((resultado) => {
            alert(resultado.mensaje);
        });
    }
}
//# sourceMappingURL=Cl_cAspirante.js.map