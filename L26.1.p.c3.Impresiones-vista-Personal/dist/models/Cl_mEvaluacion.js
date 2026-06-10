import Cl_mAspirante from "./Cl_mAspirante.js";
export default class Cl_mEvaluacion {
    aspirantes = [];
    setAspirantes(array) {
        this.aspirantes = [];
        array.forEach((asp) => {
            this.aspirantes.push(new Cl_mAspirante({
                cedula: asp.cedula,
                nombre: asp.nombre,
                cargo: asp.cargo,
                ptsPruebaTecnica: asp.ptsPruebaTecnica,
                ptsPruebaPsicologica: asp.ptsPruebaPsicologica,
                ptsEntrevista: asp.ptsEntrevista,
            }));
        });
    }
    getAspirantes(Seleccionados = false) {
        if (Seleccionados) {
            // .filter se encarga de crear el arreglo y retornar solo los que pasen la prueba
            return this.aspirantes.filter((asp) => asp.Seleccionado());
        }
        return this.aspirantes;
    }
}
//# sourceMappingURL=Cl_mEvaluacion.js.map