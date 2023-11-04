import { ContenedoresObj } from "../types";

type outObjtype = {
    [key: string]: enfType
} 

type enfType = {
    [key: string] : []
}

export default function(contenedores: ContenedoresObj|'', filtro:string): outObjtype{
    try{
        let outObj: outObjtype = {}
        Object.keys(contenedores).forEach(pallet => {
            if(pallet !== 'infoContenedor'){
                outObj[pallet] = {}
                Object.keys(contenedores[pallet]).forEach(enf =>{
                    if (['listaLiberarPallet', 'settings', 'cajasTotal', 'liberado'].includes(enf)) return;
                    outObj[pallet][enf] = contenedores[pallet][enf]
                })
            }
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