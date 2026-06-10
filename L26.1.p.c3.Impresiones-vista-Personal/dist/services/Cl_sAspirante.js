export default class Cl_sQuiz {
    static apiUrl = "https://6a108664d2a985707036e6c3.mockapi.io/Concurso/ConcursoV2";
    static async obtenerAspirantes() {
        try {
            const respuesta = await fetch(this.apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!respuesta.ok) {
                return { ok: false, aspirantes: [] };
            }
            const data = await respuesta.json();
            return { ok: true, aspirantes: data };
        }
        catch (error) {
            return { ok: false, aspirantes: [] };
        }
    }
}
//# sourceMappingURL=Cl_sAspirante.js.map