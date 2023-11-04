import React, { useEffect, useState, useRef } from 'react'
import { ContenedoresObj } from '../types'
import PrincipalGeneral from '../functions/PrincipalGeneral'
import * as echarts from 'echarts'

type propsType = {
  contenedor: ContenedoresObj
}
type calidadType = {
  1.5: number
  1: number
}
type calibreType = {
  [key: string]: number
}

type PrincipalGeneralType = [number, calidadType, calibreType, calibreType]

export default function TablePrincipalGeneral(props: propsType) {
  const [total, setTotal] = useState<number>(0)
  const [calidad, setCalidad] = useState<calidadType>({ 1: 0, 1.5: 0 })
  const [calibre, setCalibre] = useState<calibreType>({})
  const [tipoCaja, setTipoCaja] = useState<calibreType>({})


  useEffect(() => {
    const result = PrincipalGeneral(props.contenedor)

    if (Array.isArray(result)) {
      const [total, calidad, calibre, tipoCaja]: PrincipalGeneralType = result
      setTotal(total)
      setCalidad(calidad)
      setCalibre(calibre)
      setTipoCaja(tipoCaja)


    } else {
      // Manejar el caso cuando el resultado es 0
    }
  }, [props.contenedor])

  return (
    <div
      style={{
        padding: 10,
        marginLeft: 10,
        marginTop: 10,
        backgroundColor: '#f8f9fa',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}
    >
      <h1>Resumen</h1>
      <hr />
      <h3 style={{ color: '#007BFF' }}>Total</h3>

      <div
        style={{
          backgroundColor: '#fff',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '10px'
        }}
      >
        <span style={{ fontWeight: 'bold' }}>Cajas :</span>
        {total}
      </div>
      <hr />
      <h3 style={{ color: '#007BFF' }}>Calidad</h3>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#fff',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '10px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {' '}
          <div style={{ display: 'flex', flexDirection: 'row', gap: 50 }}>
            <div>
              <span style={{ fontWeight: 'bold' }}>Calidad 1:</span> {calidad[1]} Cajas
            </div>
            <div>
              <span style={{ fontWeight: 'bold' }}>Calidad 1.5:</span> {calidad['1.5']} Cajas
            </div>
          </div>
        
        </div>
      </div>
      <hr />
      <h3 style={{ color: '#007BFF' }}>Calibre</h3>
      {calibre !== null &&
        Object.keys(calibre).map((item) => (
          <div
          key={item+'div'}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              backgroundColor: '#fff',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '10px'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>Calibre {item}:</div>
            <div>{calibre[item]} cajas</div>
          </div>
        ))}
      <hr />
      <h3 style={{ color: '#007BFF' }}>Tipo Caja</h3>
      {tipoCaja !== null &&
        Object.keys(tipoCaja).map((item) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              backgroundColor: '#fff',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '10px'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>Tipo de Caja {item}</div>
            <div>Cajas:{tipoCaja[item]}</div>
          </div>
        ))}
    </div>
  )
}
