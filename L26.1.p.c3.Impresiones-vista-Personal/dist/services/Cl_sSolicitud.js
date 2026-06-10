export default class Cl_sSolicitud {
    static apiUrl = "https://6a108664d2a985707036e6c3.mockapi.io/Proyectos/impresiones";
    static async getSolicitudes() {
        try {
            const respuesta = await fetch(this.apiUrl);
            if (respuesta.status === 404) {
                return { ok: true, tabla: [] };
            }
            if (!respuesta.ok) {
                return { ok: false, tabla: [] };
            }
            const data = await respuesta.json();
            return { ok: true, tabla: data };
        }
        catch (error) {
            return { ok: false, tabla: [] };
        }
    }
    static async cambiarEstado(id, nuevoEstado, clienteRaw) {
        try {
            const respuesta = await fetch(`${this.apiUrl}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cliente: { ...(clienteRaw ?? {}), estado: nuevoEstado } }),
            });
            if (!respuesta.ok) {
                return { ok: false, mensaje: "No se pudo actualizar el estado de la solicitud en el servidor." };
            }
            return { ok: true, mensaje: "Solicitud procesada con éxito. Nuevo estado: " + nuevoEstado };
        }
        catch (error) {
            return { ok: false, mensaje: "Error de red: " + error.message };
        }
    }
}
//# sourceMappingURL=Cl_sSolicitud.js.map