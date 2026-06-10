export default class Cl_mSolicitud {
  private _cedula: number = 0;
  private _nombre: string = "";
  private _documento: string = "";
  private _copias: number = 0;
  private _referencia: string = "";
  private _estado:
    | "Verificando pago"
    | "Esperando documento"
    | "Imprimiendo"
    | "Disponible"
    | "Aprobado"
    | "Rechazado" = "Verificando pago";
  private _fecha: string = "";
  private _codigoOrden: string = "";
  private _items: any[] = [];
  private _datosPago: { totalUsd?: number; totalBs?: number; tasaAplicada?: number } | null = null;
  private _pago: any = null;
  private _clienteRaw: any = null;

  constructor({
    cedula,
    nombre,
    documento,
    copias,
    referencia,
    estado = "Verificando pago",
    fecha,
    codigoOrden = "",
    items = [],
    datosPago = null,
    pago = null,
    clienteRaw = null,
  }: {
    id?: string;
    cedula: number;
    nombre: string;
    documento: string;
    copias: number;
    referencia: string;
    estado?: "Verificando pago" | "Esperando documento" | "Imprimiendo" | "Disponible" | "Aprobado" | "Rechazado";
    fecha: string;
    codigoOrden?: string;
    items?: any[];
    datosPago?: { totalUsd?: number; totalBs?: number; tasaAplicada?: number } | null;
    pago?: any;
    clienteRaw?: any;

  }) {
  
    this.cedula = cedula;
    this.nombre = nombre;
    this.documento = documento;
    this.copias = copias;
    this.referencia = referencia;
    this.estado = estado;
    this.fecha = fecha;
    this._codigoOrden = codigoOrden;
    this._items = items;
    this._datosPago = datosPago;
    this._pago = pago;
    this._clienteRaw = clienteRaw ?? null;
  }
 

  public get cedula(): number {
    return this._cedula;
  }

  public set cedula(value: number) {
    this._cedula = value;
  }

  public get nombre(): string {
    return this._nombre;
  }

  public set nombre(value: string) {
    this._nombre = value;
  }

  public get documento(): string {
    return this._documento;
  }

  public set documento(value: string) {
    this._documento = value;
  }

  public get copias(): number {
    return this._copias;
  }

  public set copias(value: number) {
    this._copias = value;
  }

  public get referencia(): string {
    return this._referencia;
  }

  public set referencia(value: string) {
    this._referencia = value;
  }

   public get estado():
    | "Verificando pago"
    | "Esperando documento"
    | "Imprimiendo"
    | "Disponible"
    | "Aprobado"
    | "Rechazado" {
    return this._estado;
  }

  public set estado(
    value:
      | "Verificando pago"
      | "Esperando documento"
      | "Imprimiendo"
      | "Disponible"
      | "Aprobado"
      | "Rechazado",
  ) {
      this._estado = value;
  }

   public get fecha(): string {
    return this._fecha;
  }

  public set fecha(value: string) {
    this._fecha = value;
  }

  tarifaTotal(): number {
    if (typeof this._datosPago?.totalBs === "number") {
      return this._datosPago.totalBs;
    }
    return this.copias * 5;
  }

  tarifaTotalUsd(): number {
    if (typeof this._datosPago?.totalUsd === "number") {
      return this._datosPago.totalUsd;
    }
    if (
      typeof this._datosPago?.totalBs === "number" &&
      typeof this._datosPago?.tasaAplicada === "number" &&
      this._datosPago.tasaAplicada !== 0
    ) {
      return this._datosPago.totalBs / this._datosPago.tasaAplicada;
    }
    return 0;
  }

  isDisponible(): boolean {
    return this.estado === "Disponible";
  }

  public get codigoOrden(): string {
    return this._codigoOrden;
  }

  public get items(): any[] {
    return this._items;
  }

  public get datosPago() {
    return this._datosPago;
  }

  public get clienteRaw(): any {
    return this._clienteRaw;
  }

  public get pago() {
    return this._pago;
  }

  toJSON() {
    return {
      cedula: this.cedula,
      nombre: this.nombre,
      documento: this.documento,
      copias: this.copias,
      referencia: this.referencia,
      estado: this.estado,
      fecha: this.fecha,
      codigoOrden: this.codigoOrden,
      datosPago: this.datosPago,
      pago: this.pago,
      items: this.items,
    };
  }
}