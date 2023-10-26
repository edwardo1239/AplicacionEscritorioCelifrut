type Descarte = {
    descarteGeneral: number;
    pareja: number;
    balin: number;
    extra?: number;
  };
  
  type EF1 = {
    descarteLavado: Descarte;
    descarteEncerado: Descarte;
    cliente?: string;
  };
  
  type Objeto = {
    [key: string]: {
      [key: string]: EF1;
    };
  };