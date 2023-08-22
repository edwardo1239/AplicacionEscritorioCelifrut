//app donde se muestra los datos de Directo nacional y donde se pueden modificar
import { Box } from '@mui/material'
import React, { useState } from 'react'
import BarraDeBusqueda from './utils/BarraDeBusqueda'
import TablaHistorialDirectoNacional from './tables/TablaHistorialDirectoNacional';

export default function DirectoNacional() {
    const title = "Directo Nacional"
    const [filtro, setFiltro] = useState('');
    const changeFilter = (e) =>{
      setFiltro(e)
    }
    return (
      <Box>
        <BarraDeBusqueda changeFilter={changeFilter} filtro={filtro} title={title}/>
       <TablaHistorialDirectoNacional filtro={filtro} />
      </Box>
    )
  }
  