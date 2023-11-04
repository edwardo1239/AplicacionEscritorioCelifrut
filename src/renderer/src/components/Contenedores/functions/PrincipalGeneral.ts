import { ContenedoresObj } from "../types";

type calidadType = {
    1.5: number
    1: number
  }
  type calibreType = {
      [key:string]: number
  }
  
  type PrincipalGeneralType = [number, calidadType, calibreType, calibreType];

export default function (contenedor:ContenedoresObj|''): PrincipalGeneralType|0 {
    try{
        if(contenedor === '') return 0
        let total = 0;
        let calidad = { 1: 0, 1.5: 0 };
        let calibre = {};
        let tipoCaja = {}
    
    
    
        Object.keys(contenedor).forEach(pallet => {
          if (['infoContenedor'].includes(pallet)) return;
          if(contenedor[pallet].hasOwnProperty('cajasTotal')){
            total += contenedor[pallet]['cajasTotal']
          }
            Object.keys(contenedor[pallet]).forEach(enf => {
                if (['listaLiberarPallet', 'settings', 'cajasTotal', 'liberado'].includes(enf)) return;
                //console.log(contenedor[pallet][enf])
                if(contenedor[pallet].hasOwnProperty(enf)){
                    calidad[contenedor[pallet][enf][0][4]]  += contenedor[pallet][enf][0][1]
                    //tipo caja
                    if(!tipoCaja.hasOwnProperty(contenedor[pallet][enf][0][2])){
                        tipoCaja[contenedor[pallet][enf][0][2]] = 0
                    }
                    tipoCaja[contenedor[pallet][enf][0][2]] += contenedor[pallet][enf][0][1]
                    //calibre
                    if(!calibre.hasOwnProperty(contenedor[pallet][enf][0][3])){
                        calibre[contenedor[pallet][enf][0][3]] = 0
                    }
                    calibre[contenedor[pallet][enf][0][3]] += contenedor[pallet][enf][0][1]
                }
                
            })
        });
    
       return [total, calidad, calibre, tipoCaja]
    } catch(e){
        return [0, {1.5:0,1:0}, {}, {}]
    }
}