import { Box } from '@mui/material'

import React, { useState } from 'react'

import BarraDeBusqueda from '../../../utils/BarraDeBusqueda'
import TableInformes from '../Tables/TableInformes'

export default function  InformesCalidad() {
  const [filtro, setFiltro] = useState('')
  const [state, setState] = useState('Informes')

  const changeFilter = (e) => {
    setFiltro(e)
  }

  const seleccion = (title) => {
    setState(title)
  }

  const opcionesMenu = ['Informes']

  return (
    <Box sx={{ flexGrow: 2 }}>

      {state === 'Informes' && <TableInformes filtro={filtro} />}
    </Box>
  )
}