
import Cl_mSolicitud from "./Cl_mSolicitud.js";

// esto ya estaba aqui, no se
export interface ISolicitudRegistro {
  id: string;
  modelo: Cl_mSolicitud;
}

export default class Cl_mImpresiones {
  private _registros: ISolicitudRegistro[] = []; //Crea el arreglo vacío para almacenar los registros de solicitudes
  private _mapaHash: Map<string, ISolicitudRegistro> = new Map();

  public setSolicitudes(array: any[]): void {
    this._registros = [];
    this._mapaHash.clear(); // limpia el indice viejo
    array.forEach((item) => { // Recorre cada elemento del arreglo recibido
      const cliente = item.cliente ?? item;
      const items = item.items ?? []; // Se asegura de que "items" sea un arreglo
      const copias = items.length > 0 // Si hay items, suma cantidades a la impresion
        ? items.reduce((acc: number, actual: any) => {
            const tipo = String(actual.tipo ?? "").trim().toLowerCase(); // manda a todo en minuscula 
            return acc + ((tipo.includes("impres") ? Number(actual.cantidad) || 0 : 0)); // Solo suma las cantidades de los items que sean de tipo "impresion"
          }, 0)
        : Number(item.copias) || 0; // Si no hay items, toma el valor de "copias" directamente
      const documento = items.length > 0 // Si hay items, concatena las descripciones de los items para mostrar en la tabla
        ? items.map((it: any) => it.descripcion).join(" | ") // Si no hay items, toma el valor de "documento" directamente
        : item.documento ?? "";
      const referencia = item.referencia ?? item.pago?.tipo ?? ""; // Intenta obtener la referencia de pago, si no existe, deja vacío
      const estado = cliente.estado ?? item.estado ?? "Verificando pago"; // Intenta obtener el estado del cliente, si no existe, intenta obtenerlo del item, si tampoco existe, asigna "Verificando pago"
      const fecha = cliente.fecha ?? item.fecha ?? ""; // Intenta obtener la fecha del cliente, si no existe, intenta obtenerlo del item, si tampoco existe, asigna ""
      const datosPago = item.datosPago ?? item.datosPago ?? null; // Intenta obtener los datos de pago, si no existen, asigna null

      // Crea una instancia de Cl_mSolicitud con los datos obtenidos y la agrega al arreglo de registros
      const modeloSolicitud = new Cl_mSolicitud({
        cedula: Number(cliente.cedula) || 0,
        nombre: cliente.nombre ?? "",
        documento,
        copias,
        referencia,
        estado,
        fecha,
        codigoOrden: cliente.codigoOrden ?? "",
        items,
        datosPago,
        pago: item.pago ?? null,
        clienteRaw: cliente,
      });
      this._registros.push({ // Agrega el nuevo registro al arreglo de registros
        id: item.id,
        modelo: modeloSolicitud,
      });

      const llave = modeloSolicitud.codigoOrden.toLowerCase().trim();// se limpia la llave borrando los espacios en blancos y dejandola en minusculas 
      if (llave) this._mapaHash.set(llave, this._registros[this._registros.length - 1]);// esto vincula el código de la orden con su respectivo registro en el mapa.

      

      
    });
  }
  
 //hash
  public buscarPorHash(codigo: string): ISolicitudRegistro | undefined {
    return this._mapaHash.get(codigo.toLowerCase().trim());
  }

  // calcila el total de copias sumando las copias de cada solicitud en el arreglo de registros
  public calcularTotalCopias(): number {
    return this._registros.reduce((acc, reg) => acc + reg.modelo.copias, 0);
  }

  //
  public calcularTotalIngresos(): number {
    return this._registros.reduce((acc, reg) => acc + reg.modelo.tarifaTotal(), 0);
  }

  // calcula el total de ingresos en USD sumando los ingresos en USD de cada solicitud en el arreglo de registros
  public calcularTotalIngresosUsd(): number {
    return this._registros.reduce((acc, reg) => acc + reg.modelo.tarifaTotalUsd(), 0);
  }

  // actualiza el estado de una solicitud específica buscando por su ID en el arreglo de registros y modificando su estado
  public actualizarEstadoSolicitud(id: string, nuevoEstado: string): void {
    const registro = this._registros.find((reg) => reg.id === id);
    if (registro) {
      registro.modelo.estado = nuevoEstado as any;
    }
  }

  // devuelve el arreglo de registros completo
  public get registros(): ISolicitudRegistro[] {
    return this._registros;
  }

  // obtiene los datos del cliente sin procesar (clienteRaw) de una solicitud específica buscando por su ID en el arreglo de registros
  public getClienteRawPorId(id: string): any {
    const registro = this._registros.find((reg) => reg.id === id);
    return registro ? registro.modelo.clienteRaw : null;
  }

  // Regla de filtrado solicitada
  public getFiltrados(filtroEstado: string, filtroFecha: string): ISolicitudRegistro[] {
    let resultado = this._registros;

    // Paso 1: Filtrar por Estado
    if (filtroEstado === "Aprobados") {
      resultado = resultado.filter(reg => reg.modelo.estado === "Aprobado");
    } else if (filtroEstado === "Rechazados") {
      resultado = resultado.filter(reg => reg.modelo.estado === "Rechazado");
    }

    // Paso 2: Filtrar sobre el resultado anterior usando la Fecha
    if (filtroFecha && filtroFecha !== "") {
      resultado = resultado.filter(reg => {
        const fechaReg = reg.modelo.fecha || "";
        return fechaReg.includes(filtroFecha);
      });
    }

    return resultado;
  }

  //porcentaje
  
public calcularPorcentajeIngresosImpresiones(): number {
    
  let acImpresiones = 0 ;
  let totalUsdGlobal = this.calcularTotalIngresosUsd();

  if (totalUsdGlobal === 0) return 0;

  this._registros.forEach(reg => {
    if (reg.modelo.items && reg.modelo.items.length > 0) {
      reg.modelo.items.forEach((item: any) => {
           if (item.tipo === "impresion"){
        acImpresiones += item.subtotal
      } 
   });
  }
    
  });

    return (acImpresiones / totalUsdGlobal) * 100;
  }

  public calcularPorcentajeIngresosArticulos():number{

  let acArticulos = 0 ;
  let totalUsdGlobal = this.calcularTotalIngresosUsd();

  if (totalUsdGlobal === 0) return 0;

  this._registros.forEach(reg => {
    if (reg.modelo.items && reg.modelo.items.length > 0) {
      reg.modelo.items.forEach((item: any) => {
           if (item.tipo === "articulo"){
        acArticulos += item.subtotal
      } 
   });
  }
    
  });
      return (acArticulos / totalUsdGlobal) * 100;
}

  public calcularPorcentajeIngresosdescargas():number{

  let acDescargas = 0 ;
  let totalUsdGlobal = this.calcularTotalIngresosUsd();

  if (totalUsdGlobal === 0) return 0;

  this._registros.forEach(reg => {
    if (reg.modelo.items && reg.modelo.items.length > 0) {
      reg.modelo.items.forEach((item: any) => {
           if (item.tipo === "descarga"){
        acDescargas += item.subtotal
      } 
   });
  }
    
  });
      return (acDescargas / totalUsdGlobal) * 100;
}
}



