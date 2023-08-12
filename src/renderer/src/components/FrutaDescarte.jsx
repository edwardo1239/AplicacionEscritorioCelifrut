import { Box } from '@mui/material'
import React, { useState } from 'react'
import BarraDeBusqueda from './utils/BarraDeBusqueda'

export default function FrutaDescarte() {
  const title = "Fruta Descarte"
  const [filtro, setFiltro] = useState('');
  const changeFilter = (e) =>{
    setFiltro(e)
  }
  return (
    <Box>
      <BarraDeBusqueda changeFilter={changeFilter} filtro={filtro} title={title}/>
    </Box>
  )
}
