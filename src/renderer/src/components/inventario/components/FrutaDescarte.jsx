import { Box } from '@mui/material'
import React, { useState } from 'react'
import BarraDeBusqueda from '../../utils/BarraDeBusqueda'
import TablaDescarte from '../tables/TablaDescarte';
import TablaHistorialDescarte from '../tables/TablaHistorialDescarte';

export default function FrutaDescarte() {
  const [filtro, setFiltro] = useState('')
  const [state, setState] = useState('Descarte')

  const changeFilter = (e) => {
    setFiltro(e)
  }

  const seleccion = (title) => {
    setState(title)
  }

  const opcionesMenu = ['Descarte', 'Historial Descarte']

  return (
    <Box sx={{ flexGrow: 1 }}>
      <BarraDeBusqueda
        changeFilter={changeFilter}
        opcionesMenu={opcionesMenu}
        seleccion={seleccion}
        state={state}
      />

      {state === 'Descarte' && <TablaDescarte filtro={filtro} />}
      {state === 'Historial Descarte' && <TablaHistorialDescarte filtro={filtro} />}
      
     
    </Box>
  )
}
