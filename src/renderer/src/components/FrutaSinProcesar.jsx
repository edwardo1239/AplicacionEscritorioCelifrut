import { Box, } from '@mui/material'

import React, { useState } from 'react'
import CheckBoxTable from './tables/CheckBoxTable'
import BarraDeBusqueda from './utils/BarraDeBusqueda'

export default function FrutaSinProcesar() {
  const title = "Fruta sin Procesar"
  const [filtro, setFiltro] = useState('')

  const changeFilter = (e) => {
    setFiltro(e)
  }

  //buscador

  return (
    <Box sx={{ flexGrow: 1 }}>
     <BarraDeBusqueda changeFilter={changeFilter} filtro={filtro} title={title}/>

      <CheckBoxTable filtro={filtro} />
    </Box>
  )
}
