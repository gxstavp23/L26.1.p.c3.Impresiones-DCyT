import type { ISolicitudDTO } from "../interfaces/I_vSolicitarDatos.js";

export default class Cl_sSolicitud {
  private apiUrl = "https://6a108664d2a985707036e6c3.mockapi.io/Proyectos/impresiones"; // Cambiar por tu URL

  public async enviarSolicitud(solicitud: ISolicitudDTO): Promise<boolean> {
    try {
      const payload = { 
        ...solicitud,
        fecha: new Date().toISOString().split('T')[0],
        items: solicitud.items.map((item) => {
          const sanitizedItem = { ...item } as any;  //no me pregunten, asi funciona y asi se queda
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
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      return false;
    }
  }
}