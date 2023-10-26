export interface contenedoresObj {
  [key: string]: contenedorType
}

interface contenedorType {
  pallets: { [key: string]: pallet }
  infoContenedor: typeInfoContenedor
}

interface typeInfoContenedor {
  nombreCliente: string
  tipoFruta: 'Limon' | 'Naranja'
}

interface pallet {
  items : {[key: string]: CustomArray}
  settings: settings
  cajasTotal: number
}

interface settings {
  tipoCaja: string
  calibre: number
  calidad: number
}

type CustomArray = (string | number | Date)[]
