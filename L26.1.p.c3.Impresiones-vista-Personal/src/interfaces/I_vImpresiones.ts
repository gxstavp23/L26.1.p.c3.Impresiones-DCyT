export default interface I_vImpresiones {
  get filtroEstado(): string;
  get filtroFecha(): string;
  get hashCodigo(): string;
  
  
  mostrarImpresiones(solicitudesPlanas: any[]): void;
  mostrarEstadisticas(totalCopias: number, totalIngresos: number, totalIngresosUsd: number,porcImpresiones: number, porcArticulos: number,porcDescargas: number ): void;
  
  onRecargar(callback: () => void): void;
  onChangeFiltroEstado(callback: () => void): void;
  onChangeFiltroFecha(callback: () => void): void;
  onChangeBuscarOrden(callback: () => void): void;
  
  onAccionCambiarEstado(callback: (id: string, nuevoEstado: string) => void): void;
}