interface liberarPallet {
  rotulado: boolean;
  paletizado: boolean;
  enzunchado: boolean;
  estadoCajas: boolean;
  estiba: boolean;
  
}
interface settings {
  tipoCaja: string;
  calidad: number;
  calibre: number;
}

type ENFArray = [string, number, string, number, number, string][];

interface pallet {
  settings: settings;
  [key: string]: ENFArray | settings | number | liberarPallet | boolean;
  cajasTotal: number;
  listaLiberarPallet: liberarPallet;
  liberado: boolean;
}


export interface ContenedoresObj {
  [key: number]: {
    [key: number]: pallet
  }
}
