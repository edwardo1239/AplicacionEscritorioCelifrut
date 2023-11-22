import { Box } from '@mui/material'
import React, { useState } from 'react'
import TableProveedor from '../Tables/TableProveedor'

export default function Proveedor() {
  const [filtro, setFiltro] = useState('')
  const [state, setState] = useState('ProveedorBase')

  const changeFilter = (e) => {
    setFiltro(e)
  }

  const seleccion = (title) => {
    setState(title)
  }

  const opcionesMenu = ['ProveedorBase']

  return (
    <Box sx={{ flexGrow: 1 }}>

      {state === 'ProveedorBase' && <TableProveedor filtro={filtro} />}

    </Box>
  )
}