import React, { useEffect, useState } from 'react'
import { ContenedoresObj } from '../types'
import Buscador from '../utils/Buscador'
import TablePrincipalGeneral from './TablePrincipalGeneral'
import TablePallets from './TablePallets'
import TablePrediosListaEmpaque from './TablePrediosListaEmpaque'

type propsType = {
  contenedor: ContenedoresObj
}

export default function TableListaEmpaque(props: propsType) {

  const [filtro, setFiltro] = useState<string>('')
  const [filtro2, setFiltro2] = useState<string>('')


  const filtroPrincipal = (value: string, value2: string) => {
    setFiltro(value)
    setFiltro2(value2)
    console.log(value2)
  }

  return (
    <div>
      <Buscador filtroPrincipal={filtroPrincipal} contenedor={props.contenedor} />

      <div>{filtro === '' ? <TablePrincipalGeneral contenedor={props.contenedor} /> : null}</div>
      <div>{filtro === 'pallet' ? <TablePallets contenedor={props.contenedor} filtro={filtro2}/> : null}</div>
      <div>{filtro === 'predio' ? <TablePrediosListaEmpaque contenedor={props.contenedor} filtro={filtro2}/> : null}</div>
     
    </div>
  )
}

const styles = {
  fontSize: 14
}
