//Esta clase es exclusiva para crear los objetos y enviar la info

export interface ICliente {
  cedula: string;
  nombre: string;
  codigoOrden?: string;
  estado?: string;
  fecha: string
}

export interface IItemCarrito {
  id: string;
  tipo: 'impresion' | 'descarga' | 'articulo';
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  detalles: any;
}

export interface IItemCarritoDTO {
  tipo: 'impresion' | 'descarga' | 'articulo';
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  detalles: any;
}

export interface IPago {
  tipo: string;
  cedula: string;
  banco: string | null;
  telefono: string | null;
  referencia4: string | null;
}

// Todos hacen los mismo, me dio flojera escribir
export interface IDatosPago {
  totalUsd: number;
  totalBs: number;
  tasaAplicada: number;
}

//Envia lo que tiene en forma de diccionario al mockapi
export interface ISolicitudDTO { 
  cliente: ICliente;
  items: IItemCarritoDTO[];
  datosPago: IDatosPago;
  pago: IPago;
}
