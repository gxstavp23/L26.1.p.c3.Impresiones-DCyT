export default class Cl_mSolicitud {
    items = [];
    tasaActual;
    // Precios base en DOLARES ($) [Ahorita dicen que no se podia harcodear]
    precios = {
        impresion: {
            carta_bn: 0.10, carta_color: 0.30,
            oficio_bn: 0.12, oficio_color: 0.40
        },
        descarga: 0.50,
        articulos: {
            lapicero: 0.30, lapiz: 0.20, hojas_blancas: 2.00,
            hojas_ministro: 0.40, tijera: 0.80, borrador: 0.20
        }
    };
    constructor() {
        this.tasaActual = this.calcularTasaDelDia();
    }
    //ya que querian que se mostrara dolares y bs y no consegui una API para eso
    //cree estem metodo que es una tasa ficticia que se modifica cada dia
    calcularTasaDelDia() {
        const hoy = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD 
        const baseTasa = 563.29;
        const tasaGuardada = localStorage.getItem('app_tasa_bs');
        const fechaGuardada = localStorage.getItem('app_fecha_tasa');
        if (!tasaGuardada || fechaGuardada !== hoy) { // Si no hay tasa guardada o la fecha no coincide con hoy, se genera una nueva tasa
            let nuevaTasa = tasaGuardada ? parseFloat(tasaGuardada) : baseTasa;
            const rand = Math.floor(Math.random() * (250 - 40 + 1)) + 40; // Genera un número aleatorio entre 40 y 250
            nuevaTasa = nuevaTasa + (nuevaTasa * (rand / 10000)); // Aplica la variación a la tasa
            localStorage.setItem('app_tasa_bs', nuevaTasa.toString()); // Guarda la nueva tasa en localStorage
            localStorage.setItem('app_fecha_tasa', hoy);
            return nuevaTasa;
        }
        return parseFloat(tasaGuardada); //Transformo la tasa guardada en un número y la retorno
    }
    getTasa() { return this.tasaActual; }
    agregarImpresion(nombre, hoja, formato, cantidad) {
        const clavePrecio = `${hoja}_${formato}`; //Solo busca el precio de las hojas del guaro
        const pU = this.precios.impresion[clavePrecio] || 0.10;
        this.agregarItem({
            id: this.generarId(), tipo: 'impresion',
            descripcion: `🖨️ ${nombre} (${hoja}, ${formato})`,
            cantidad, precioUnitario: pU, subtotal: pU * cantidad, detalles: {}
        });
    }
    agregarDescarga(enlace) {
        this.agregarItem({
            id: this.generarId(), tipo: 'descarga',
            descripcion: `⬇️ Descarga de archivo`,
            cantidad: 1, precioUnitario: this.precios.descarga,
            subtotal: this.precios.descarga, detalles: { enlace }
        });
    }
    agregarArticulo(tipo, cantidad) {
        const pU = this.precios.articulos[tipo] || 0;
        const existente = this.items.find(item => item.tipo === 'articulo' && item.detalles.tipo === tipo); // Busca si ya existe el mismo tipo de artículo en el carrito para actualizarlo en lugar de agregar uno nuevo
        if (existente) { // Si ya existe el mismo artículo, solo actualiza la cantidad y subtotal
            existente.cantidad += cantidad;
            existente.subtotal = existente.precioUnitario * existente.cantidad;
            return;
        }
        this.agregarItem({
            id: this.generarId(), tipo: 'articulo',
            descripcion: `✏️ ${tipo}`,
            cantidad, precioUnitario: pU, subtotal: pU * cantidad, detalles: { tipo }
        });
    }
    modificarCantidadItem(id, delta) {
        const item = this.items.find(i => i.id === id); // Busca el item por su ID
        if (!item)
            return;
        item.cantidad = Math.max(0, item.cantidad + delta);
        if (item.cantidad === 0) {
            this.eliminarItem(id);
            return;
        }
        item.subtotal = item.precioUnitario * item.cantidad;
    }
    agregarItem(item) { this.items.push(item); } // Agrega un nuevo item al carrito
    eliminarItem(id) { this.items = this.items.filter(i => i.id !== id); } // Elimina el item completamente del carrito
    getItems() { return this.items; } // Segun lo que entendi, esto es para obtener los items del carrito, no se si es necesario pero lo dejo porque funciona
    getTotalUsd() { return this.items.reduce((acc, i) => acc + i.subtotal, 0); }
    getTotalBs() { return this.getTotalUsd() * this.tasaActual; }
    vaciarCarrito() {
        this.items = []; //vacia la lista de items
    }
    generarDTO(cliente) {
        return {
            cliente: {
                ...cliente,
                estado: 'Verificando pago'
            },
            items: this.items.map(({ id, ...item }) => item), // Elimina el campo 'id' de cada item antes de enviar, ya que el backend no lo necesita
            datosPago: {
                totalUsd: this.getTotalUsd(),
                totalBs: this.getTotalBs(),
                tasaAplicada: this.tasaActual
            },
            pago: {
                tipo: '',
                cedula: '',
                banco: null,
                telefono: null,
                referencia4: null
            }
        };
    }
    generarId() { return Math.random().toString(36).substr(2, 9); } // Genera un ID único para cada item quizas no es necesario
}
//# sourceMappingURL=Cl_mSolicitud.js.map