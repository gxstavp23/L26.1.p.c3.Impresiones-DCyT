import Cl_mAspirante from "../models/Cl_mAspirante.js";
import Cl_sAspirante from "../services/Cl_sAspirante.js";
export default class Cl_cAspirante {
    vista;
    constructor(vista) {
        this.vista = vista;
        this.vista.onEnviar(() => this.btEnviarOnClick());
    }
    async btEnviarOnClick() {
        let resultado = new Cl_mAspirante({
            cedula: this.vista.cedula,
            nombre: this.vista.nombre,
            cargo: this.vista.cargo,
            expLaboral: this.vista.expLaboral,
            pregunta1: this.vista.pregunta1,
            pregunta2: this.vista.pregunta2,
            pregunta3: this.vista.pregunta3,
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