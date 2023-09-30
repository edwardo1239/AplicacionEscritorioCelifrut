import { Box } from '@mui/material'

import React, { useState } from 'react'
import CheckBoxTable from '../tables/CheckBoxTable'
import BarraDeBusqueda from '../../utils/BarraDeBusqueda'
import TablaHistorialVaciado from '../tables/TablaHistorialVaciado'
import TablaHistorialDirectoNacional from '../tables/TablaHistorialDirectoNacional'

export default function FrutaSinProcesar() {
  const [filtro, setFiltro] = useState('')
  const [state, setState] = useState('Fruta sin procesar')

  const changeFilter = (e) => {
    setFiltro(e)
  }

  const seleccion = (title) => {
    setState(title)
  }

  const opcionesMenu = ['Fruta sin procesar', 'Historial procesado', 'Historial Directo nacional']

  return (
    <Box sx={{ flexGrow: 1 }}>
      <BarraDeBusqueda
        changeFilter={changeFilter}
        opcionesMenu={opcionesMenu}
        seleccion={seleccion}
        state={state}
      />

      {state === 'Fruta sin procesar' && <CheckBoxTable filtro={filtro} />}
      {state === 'Historial procesado' && <TablaHistorialVaciado filtro={filtro} />}
      {state === 'Historial Directo nacional' && <TablaHistorialDirectoNacional filtro={filtro} />}
    </Box>
  )
}
