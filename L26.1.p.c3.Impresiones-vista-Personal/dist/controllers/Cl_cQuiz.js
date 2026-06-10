import Cl_mQuiz from "../models/Cl_mQuiz.js";
import Cl_sQuiz from "../services/Cl_sQuiz.js";
export default class Cl_cQuiz {
    vista;
    constructor(vista) {
        this.vista = vista;
        this.vista.onEnviar(() => this.btEnviarOnClick());
    }
    async btEnviarOnClick() {
        let resultado = new Cl_mQuiz({
            cedula: this.vista.cedula,
            nombre: this.vista.nombre,
            respuesta1: this.vista.respuesta1,
            respuesta2: this.vista.respuesta2,
        });
        let chkExiste = await Cl_sQuiz.existeQuiz(resultado.cedula);
        if (chkExiste.ok === false) {
            alert("Error: No se pudo conectar con el servidor");
            return;
        }
        if (chkExiste.existe) {
            alert("Ya existe un quiz registrado con esa cédula");
            return;
        }
        Cl_sQuiz.guardarRegistro(resultado).then((resultado) => {
            alert(resultado.mensaje);
        });
    }
}
//# sourceMappingURL=Cl_cQuiz.js.map