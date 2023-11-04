import { ContenedoresObj } from "../types";
import ObtenerPrediosContenedor from "./ObtenerPrediosContenedor";

type outObjtype = {
    [key: string]: enfType
} 

type enfType = {
    [key: string] : {}
}
export default function(contenedor:ContenedoresObj, filtro:string){
    try{
        let outObj: outObjtype = {}
        let enfs = ObtenerPrediosContenedor(contenedor)
        enfs.forEach(enf =>{
            outObj[enf] = {}
            Object.keys(contenedor).forEach(pallet => {
                if(pallet !== 'infoContenedor'){
                    if(contenedor[pallet][enf] !== undefined){
                        outObj[enf][pallet] = {}
                        outObj[enf][pallet] = contenedor[pallet][enf]
                    }
                }
            })
        })

        if(filtro !== ''){
            Object.keys(outObj).map(pallet => {
                if(pallet !== filtro){
                    delete outObj[pallet]
                }
            })
        }
        return outObj
    } catch(e){
        return {}
    }
}