//app donde se muestra los datos de vaciado y donde se pueden modificar
import {  Box } from '@mui/material'
import React, { useState } from 'react'
import TablaHistorialVaciado from './tables/TablaHistorialVaciado'
import BarraDeBusqueda from './utils/BarraDeBusqueda'


export default function Procesado() {

  const title = "Fruta Procesada"
  const [filtro, setFiltro] = useState('')

  const changeFilter = (e) => {
    setFiltro(e)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
  
  <BarraDeBusqueda changeFilter={changeFilter} filtro={filtro} title={title}/>

      <TablaHistorialVaciado filtro={filtro} />
    </Box>
  )
}
