export default class Cl_sSolicitud {
    apiUrl = "https://6a108664d2a985707036e6c3.mockapi.io/Proyectos/impresiones"; // Cambiar por tu URL
    async enviarSolicitud(solicitud) {
        try {
            const payload = {
                ...solicitud,
                fecha: new Date().toISOString().split('T')[0],
                items: solicitud.items.map((item) => {
                    const sanitizedItem = { ...item }; //no me pregunten, asi funciona y asi se queda
                    delete sanitizedItem.id;
                    return sanitizedItem;
                })
            };
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            return response.ok;
        }
        catch (error) {
            console.error("Error al enviar la solicitud:", error);
            return false;
        }
    }
}
//# sourceMappingURL=Cl_sSolicitud.js.map