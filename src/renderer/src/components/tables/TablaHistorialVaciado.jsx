import { CheckBox, TableBar } from '@mui/icons-material'
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  TableCell,
  TableBody
} from '@mui/material'
import React, { useReducer, useState, useEffect } from 'react'
import { format } from 'date-fns'

export default function TablaHistorialVaciado({ filtro }) {
  const [busqueda, setBusqueda] = useState('')
  const [titleTable, setTitleTable] = useState('Lotes')

  const reducer = (tabla, action) => {
    if (busqueda === '') {
      tabla = action.datos
      return tabla
    } else {
      let obj = {}
      const tablaFiltrada = Object.keys(action.datos).filter(
        (lote) =>
          action.datos[lote]['ENF'].toLowerCase().indexOf(busqueda.toLowerCase()) !== -1 ||
          String(action.datos[lote]['Nombre Predio'])
            .toLowerCase()
            .indexOf(String(busqueda).toLowerCase()) !== -1 ||
          action.datos[lote]['Fecha'].toLowerCase().indexOf(busqueda.toLowerCase()) !== -1 ||
          action.datos[lote]['Tipo Fruta'].toLowerCase().indexOf(busqueda.toLowerCase()) !== -1
      )
      tablaFiltrada.map((item) => {
        obj[item] = action.datos[item]
      })
      tabla = obj
      return tabla
    }
  }
  const [tabla, dispatch] = useReducer(reducer, {})

  //useEffect que obtiene la cadena que se desea filtrar
  useEffect(() => {
    setBusqueda(filtro)
  }, [filtro])

  //useEffect donde se obtiene la informacion de el Main
  useEffect(() => {
    const interval = setInterval(async () => {
      const frutaActual = await window.api.obtenerHistorialProceso()
      dispatch({ datos: frutaActual })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const clickLote = (e) => {
    let lote = e.target.value
   
    if (e.target.checked) {
      setTitleTable(lote + ' ' + tabla[lote]['Nombre Predio'])
    }
  }

  return (
    <Box>
      <Toolbar>
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          {titleTable}
        </Typography>
      </Toolbar>
      <TableContainer>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <CheckBox />
              </TableCell>
       
              <TableCell>ENF</TableCell>
              <TableCell>Nombre del Predio</TableCell>
              <TableCell>Canastillas</TableCell>
              <TableCell>Kilos</TableCell>
              <TableCell>Tipo Fruta</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(tabla).map((item) => (
                <TableRow>
                      <TableCell padding="checkbox">
                    {/* <input type="checkbox" id={item} style={{ width: '2rem' }} onClick={clickLote} value={item} /> */}
                    <input
                      type="radio"
                      id={item}
                      style={{ width: '2rem' }}
                      onClick={clickLote}
                      value={item}
                      name="lote"
                    />
                  </TableCell>
                    <TableCell key={item}>{item}</TableCell>
                    <TableCell key={item+'NombrePredio'}>{tabla[item]['Nombre Predio']}</TableCell>
                    <TableCell key={item+'Canastillas'}>{tabla[item]['Canastillas']}</TableCell>
                    <TableCell key={item+'Kilos'}>{tabla[item]['Kilos']}</TableCell>
                    <TableCell key={item+'TipoFruta'}>{tabla[item]['Tipo Fruta']}</TableCell>
                    <TableCell key={item + 'fecha'}>
                    {format(new Date(tabla[item]['Fecha']), 'MM/dd/yyyy')}
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
