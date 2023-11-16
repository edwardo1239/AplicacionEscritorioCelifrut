import React, { useEffect, useState } from 'react'
import { ContenedoresObj } from '../types'
import ObtenerInfoPrediosListaEmpaque from '../functions/ObtenerInfoPrediosListaEmpaque'
import { format } from 'date-fns'
import ObtenerPrediosContenedor from '../functions/ObtenerPrediosContenedor'
import Api from '../../../../../preload/types';

type propsType = {
  contenedor: ContenedoresObj
  filtro: string
}

type outObjtype = {
  [key: string]: enfType
}

type enfType = {
  [key: string]: {}
}

export default function TablePrediosListaEmpaque(props: propsType) {
  const [tabla, setTabla] = useState<outObjtype>({})
  const [rendimiento, setRendimiento] = useState<object>({})




  useEffect(() => {
   const funcionAuxiliar = async () =>{
    const response: outObjtype = ObtenerInfoPrediosListaEmpaque(props.contenedor, props.filtro)
    //const predios = ObtenerPrediosContenedor(props.contenedor)
    const request = {action:'obtenerRendimiento'}
     const rendimientoReq =  await window.api.ingresoFruta(request)
     console.log(rendimientoReq)
    setRendimiento(rendimientoReq.data)
    setTabla(response)
   }
   funcionAuxiliar()
   window.api.listaEmpaqueInfo('listaEmpaqueInfo', (response:any) =>{
    setRendimiento(response.rendimiento)
    })
  }, [props.contenedor])

  return (
    <div>
      {Object.keys(tabla).map((enf) => (
        <ul style={{listStyleType: 'none',marginLeft:10, marginRight:10, marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', padding: '10px'}}>
          <li>
            <div style={{display:'flex', flexDirection:'row', gap:'15px', alignItems: 'center', marginLeft:10}}>
            <p style={{fontWeight: 'bold', color:'#007BFF'}}>{enf}</p>
            <p style={{fontWeight: 'bold', color:'#007BFF'}}>{tabla[enf][Object.keys(tabla[enf])[0]][0][0]}</p>
            {rendimiento &&
               <p style={{fontWeight: 'bold', color:'#007BFF'}}>{rendimiento[enf].toFixed(2) + '%'}</p> 
            }
         
            </div>
            <ul>
              {Object.keys(tabla[enf]).map((pallet) => (
                <li style={{marginBottom: '10px',listStyleType: 'none', borderLeft: '3px solid #007BFF', paddingLeft: '10px', backgroundColor: '#f8f9fa',}}>
                  <div style={{display:'flex', flexDirection:'row', gap:'15px', alignItems: 'center'}}>
                    <p style={{fontWeight:'bold'}}>Pallet: {pallet}</p>
                  </div>
                  <div>
                    {Object.keys(tabla[enf][pallet]).map((item) => (
                      <div style={{display:'flex',flexDirection:'row',gap:15}} key={item+'div'}>
                        <p key={item+'cajas'}>Cajas: {tabla[enf][pallet][item][1]}</p>
                        <p key={item+'tipocaja'}>Tipo caja: {tabla[enf][pallet][item][2]}</p>
                        <p key={item+'calibre'}>Calibre: {tabla[enf][pallet][item][3]}</p>
                        <p key={item+'calidad'}>Calidad: {tabla[enf][pallet][item][4]}</p>
                        <p key={item+'fecha'}>Fecha: {format(new Date(tabla[enf][pallet][item][5]), 'dd-MM-yyyy')}</p>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      ))}
    </div>
  )
}
