import { Box } from '@mui/material'
import React, { useState } from 'react'
import BarraDeBusqueda from '../../utils/BarraDeBusqueda'
import TableLotes from '../Tables/TableLotes'

export default function Proveedor() {
  const [filtro, setFiltro] = useState('')
  const [state, setState] = useState('Lotes')

  const changeFilter = (e) => {
    setFiltro(e)
  }

  const seleccion = (title) => {
    setState(title)
  }

  const opcionesMenu = ['Lotes']

  return (
    <Box sx={{ flexGrow: 1 }}>

      {state === 'Lotes' && <TableLotes filtro={filtro} />}

    </Box>
  )
}