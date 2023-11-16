import { Box } from '@mui/material'

import React, { useState } from 'react'
import BarraDeBusqueda from '../../../utils/BarraDeBusqueda'
import TablaHigienePersonal from '../tables/TablaHigienePersonal'
import TablaControlPlagas from '../tables/TablaControlPlagas'
import TablaLimpiezaPostcosecha from '../tables/TablaLimpiezaPostcosecha'
import TablaLimpiezaMensual from '../tables/TablaLimpiezaMensual'

export default function Formulario() {
  const [filtro, setFiltro] = useState('')
  const [state, setState] = useState('Higiene Personal')

  const changeFilter = (e) => {
    setFiltro(e)
  }

  const seleccion = (title) => {
    setState(title)
  }

  const opcionesMenu = ['Higiene Personal', 'Control Plagas', 'Inspección Postcosecha', 'Inspeccion Mensual']

  return (
    <Box sx={{ flexGrow: 2 }}>
      <BarraDeBusqueda
        changeFilter={changeFilter}
        opcionesMenu={opcionesMenu}
        seleccion={seleccion}
        state={state}
      />

      {state === 'Higiene Personal' && <TablaHigienePersonal filtro={filtro} />}
      {state === 'Control Plagas' && <TablaControlPlagas filtro={filtro} />}
      {state === 'Inspección Postcosecha' && <TablaLimpiezaPostcosecha filtro={filtro} />}
      {state === 'Inspeccion Mensual' && <TablaLimpiezaMensual filtro={filtro} />}
    </Box>
  )
}