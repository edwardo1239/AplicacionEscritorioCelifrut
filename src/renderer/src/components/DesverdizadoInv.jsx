import { Box } from '@mui/material'
import React, { useState } from 'react'
import BarraDeBusqueda from './utils/BarraDeBusqueda'
import TableDesverdizando from './tables/TableDesverdizando';


export default function DesverdizadoInv() {
    const title = "Desverdizando"
    const [filtro, setFiltro] = useState('');
    const changeFilter = (e) =>{
      setFiltro(e)
    }
    return (
      <Box>
        <BarraDeBusqueda changeFilter={changeFilter} filtro={filtro} title={title}/>
        <TableDesverdizando filtro={filtro} />

      </Box>
    )
  }
  