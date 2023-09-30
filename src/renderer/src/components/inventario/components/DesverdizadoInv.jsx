import { Box } from '@mui/material'
import React, { useState } from 'react'
import BarraDeBusqueda from '../../utils/BarraDeBusqueda'
import TableDesverdizando from '../tables/TableDesverdizando'

export default function DesverdizadoInv() {
  const [filtro, setFiltro] = useState('')
  const [state, setState] = useState('Desverdizado')

  const changeFilter = (e) => {
    setFiltro(e)
  }

  const seleccion = (title) => {
    setState(title)
  }

  const opcionesMenu = ['Desverdizado']

  return (
    <Box sx={{ flexGrow: 1 }}>
      <BarraDeBusqueda
        changeFilter={changeFilter}
        opcionesMenu={opcionesMenu}
        seleccion={seleccion}
        state={state}
      />

      {state === 'Desverdizado' && <TableDesverdizando filtro={filtro} />}

    </Box>
  )
}
