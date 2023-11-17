import { Box } from '@mui/material'

import React, { useState } from 'react'

import VolanteCalidad from '../tables/VolanteCalidad'
import Graficas from '../tables/Graficas'
import BarraDeBusqueda from '../../../utils/BarraDeBusqueda'

export default function VolanteCalidadC() {
  const [filtro, setFiltro] = useState('')
  const [state, setState] = useState('Volante Calidad')

  const changeFilter = (e) => {
    setFiltro(e)
  }

  const seleccion = (title) => {
    setState(title)
  }

  const opcionesMenu = ['Volante Calidad', 'Graficas']

  return (
    <Box sx={{ flexGrow: 2 }}>
      <BarraDeBusqueda
        changeFilter={changeFilter}
        opcionesMenu={opcionesMenu}
        seleccion={seleccion}
        state={state}
      />

      {state === 'Volante Calidad' && <VolanteCalidad filtro={filtro} />}
      {state === 'Graficas' && <Graficas filtro={filtro} />}
    </Box>
  )
}