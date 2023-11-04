import { ContenedoresObj } from "../types";

export default function (contenedor:ContenedoresObj) {
    try{
        let objOut = {}
        const pallets = Object.keys(contenedor)
        for(let i=0; i<pallets.length; i++){
            if(pallets[i] !== 'infoContenedor'){
                let enfs = Object.keys(contenedor[pallets[i]])
                for(let ii = 0; ii<enfs.length; ii++){
                    if(enfs[ii] !== 'settings' && enfs[ii] !== 'cajasTotal' && enfs[ii] !== 'listaLiberarPallet' && enfs[ii] !== 'liberado' ){
                        if(!objOut.hasOwnProperty(enfs[ii])){
                            objOut[enfs[ii]] = {}
                        }
                        objOut[enfs[ii]] = {
                            pallet:pallets[i],
                            predio:contenedor[pallets[i]][enfs[ii]][0]

                        }
                    }
                }
                
            }
        }
    } catch(e) {
        return e
    }
}