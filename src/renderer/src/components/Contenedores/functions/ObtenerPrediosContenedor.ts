import { ContenedoresObj } from "../types";

export default function(contenedor:ContenedoresObj) : string[]{
    try{
        let arr:string[] = []
        Object.keys(contenedor).map(pallet => {
            if(pallet !== 'infoContenedor'){
                Object.keys(contenedor[pallet]).map(enf => {
                    if (['listaLiberarPallet', 'settings', 'cajasTotal', 'liberado'].includes(enf)) return;
                    arr.push(enf)
                })
            }
        })

        let set = new Set(arr)
        return Array.from(set)
    } catch(e) {
        return []
    }
}