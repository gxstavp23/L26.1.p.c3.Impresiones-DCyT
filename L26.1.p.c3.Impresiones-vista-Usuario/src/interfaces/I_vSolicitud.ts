import type { ICliente, IItemCarrito } from "./I_vSolicitarDatos.js";

export interface I_vSolicitud {
  // lectura de datos
  getDatosCliente(): ICliente;
  getDatosImpresion(): { nombre: string, hoja: string, formato: string, copias: number };
  getDatosDescarga(): { enlace: string };
  getDatosArticulo(): { tipo: string, cantidad: number };
  
  // limpia los inputs
  limpiarInputsImpresion(): void;
  limpiarInputsDescarga(): void;
  limpiarInputsArticulo(): void;
  limpiarTodo(): void;

  // Actualiza la vista de la 4runner
  renderizarCarrito(items: IItemCarrito[], totalBs: number, totalUsd: number, tasa: number): void;
  mostrarTasaDelDia(tasa: number): void;
  mostrarMensaje(mensaje: string, tipo: 'exito' | 'error'): void;

  // Binders (Eventos)
  bindAddImpresion(handler: () => void): void;
  bindAddDescarga(handler: () => void): void;
  bindAddArticulo(handler: () => void): void;
  bindEliminarItem(handler: (id: string) => void): void;
  bindModificarItem(handler: (id: string, accion: 'incrementar' | 'decrementar') => void): void;
  bindEnviarPedido(handler: () => void): void;
  // Pago: mostrar modal y confirmar datos de pago
  showPaymentModal(prefillCedula?: string, ordenCodigo?: string): void;
  hidePaymentModal(): void;
  // Este método se llama cuando el usuario confirma los datos de pago en la vista (modal)
  bindConfirmPayment(handler: (pago: { tipo: string, cedula: string, banco: string | null, telefono:string | null, referencia4: string | null }) => void): void;
}
