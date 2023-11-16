import React, {useEffect, useState} from 'react'
import InfoPalletsListaEmpaque from '../functions/InfoPalletsListaEmpaque'
import { ContenedoresObj } from '../types'
import { format } from 'date-fns'

type propsType = {
    contenedor: ContenedoresObj
    filtro: string
  }

export default function TablePallets(props:propsType) {

const [tabla, setTabla] = useState({})

    useEffect(()=>{
        const response = InfoPalletsListaEmpaque(props.contenedor, props.filtro)
        setTabla(response)
    },[props.contenedor])

  return (
    <div>
        {Object.keys(tabla).map(pallet => (
            <ul key={pallet + 'div'} style={{listStyleType: 'none',marginLeft:15, marginRight:15, marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', padding: '10px'}}>
                <li>
                    <div style={{fontWeight: 'bold', fontSize: '20px', marginBottom: '10px', color: '#333'}}>
                    {props.contenedor.infoContenedor?.tipoEmpaque === 'Caja' ? 'Pallet: ' : 'Estiba: '}{pallet}
                    </div>
                    <ul style={{marginLeft: '5px'}}>
                        {Object.keys(tabla[pallet]).map(enf => (
                            <li style={{borderRadius:5,marginBottom: '10px', borderLeft: '3px solid #007BFF', paddingLeft: '10px', backgroundColor: '#f8f9fa', listStyleType: 'none'}}>
                                <div style={{display:'flex', flexDirection:'row', gap:'15px', alignItems: 'center'}}>
                                    <p style={{fontWeight: 'bold', color:'#007BFF'}}>{enf}</p>
                                    <p style={{fontWeight: 'bold', color:'#007BFF'}}>{tabla[pallet][enf][0][0]} :</p>
                                </div>
                                {Object.keys(tabla[pallet][enf]).map(item => (
                                    <div style={{display:'flex', flexDirection:'row', gap:'15px', alignItems: 'center'}}>
                                        <p>{props.contenedor.infoContenedor?.tipoEmpaque === 'Caja' ? 'Cajas: ' : 'Sacos: '}{tabla[pallet][enf][item][1]}</p>
                                        <p>Tipo {props.contenedor.infoContenedor?.tipoEmpaque === 'Caja' ? 'Cajas: ' : 'Sacos: '} {tabla[pallet][enf][item][2]}</p>
                                        <p>Calibre: {tabla[pallet][enf][item][3]}</p>
                                        <p>Calidad: {tabla[pallet][enf][item][4]}</p>
                                        <p>Fecha: {format(new Date(tabla[pallet][enf][item][5]), 'dd-MM-yyyy')}</p>
                                    </div>
                                ))}
                            </li>
                        ))}
                    </ul>
                </li>
            </ul>
        ))}
    </div>
  )
}
