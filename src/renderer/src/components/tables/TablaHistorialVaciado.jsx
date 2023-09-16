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
  TableBody,
  Button
} from '@mui/material'
import RestoreIcon from '@mui/icons-material/Restore'
import React, { useReducer, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { format } from 'date-fns'
import ModificarHistorial from '../modals/ModificarHistorial'

export default function TablaHistorialVaciado({ filtro }) {
  const [busqueda, setBusqueda] = useState('')
  const [titleTable, setTitleTable] = useState('Lotes')
  const [showBtnModificar, setShowBtnModificar] = useState(false)
  //states de los modales
  const [modalModificar, setModalModificar] = useState(false)
  //props para los modales y de los modales
  const [propsModal, setPropsModal] = useState({ nombre: '', canastillas: 0 })
  const [openSucces, setOpenSuccess] = useState(false)
  const [message, setMessage] = useState('')

  const reducer = (tabla, action) => {
    if (busqueda === '') {
      tabla = action.datos
      return tabla
    } else {
      let obj = {}
      const tablaFiltrada = Object.keys(action.datos).filter(
        (lote) =>
          action.datos[lote]['enf'].toLowerCase().indexOf(busqueda.toLowerCase()) !== -1 ||
          String(action.datos[lote]['nombre'])
            .toLowerCase()
            .indexOf(String(busqueda).toLowerCase()) !== -1 ||
          action.datos[lote]['fecha'].toLowerCase().indexOf(busqueda.toLowerCase()) !== -1 ||
          action.datos[lote]['tipoFruta'].toLowerCase().indexOf(busqueda.toLowerCase()) !== -1
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
      //console.log(frutaActual)
      dispatch({ datos: frutaActual })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const clickLote = (e) => {
    let lote = e.target.value
    setPropsModal(() => ({
      nombre: tabla[lote]['nombre'],
      canastillas: tabla[lote]['canastillas'],
      enf: tabla[lote]['enf'],
      id: lote
    }))
    if (e.target.checked) {
      setTitleTable(tabla[lote]['enf'] + ' ' + tabla[lote]['nombre'])
      if (
        format(new Date(tabla[lote]['fecha']), 'MM/dd/yyyy') == format(new Date(), 'MM/dd/yyyy')
      ) {
        setShowBtnModificar(true)
      } else {
        setShowBtnModificar(false)
      }
    }
  }

  //funciones que cierra los modales
  const closeModal = () => {
    setModalModificar(!modalModificar)
  }

  //funcion para mostrar que la accion se llevo acabo con exito
  const funcOpenSuccess = (message) => {
    setOpenSuccess(true)
    setMessage(message)
  }

  return (
    <Box>
      <Toolbar>
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          {titleTable}
        </Typography>

        {showBtnModificar && (
          <Button variant="contained" endIcon={<RestoreIcon />} onClick={closeModal}>
            Modificar
          </Button>
        )}
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
            {tabla && Object.keys(tabla).reverse().map((item) => (
              <TableRow key={item+'tableRow'}>
                <TableCell padding="checkbox" key={item+'tablecellInput'}>
                  {/* <input type="checkbox" id={item} style={{ width: '2rem' }} onClick={clickLote} value={item} /> */}
                  <input
                    type="radio"
                    id={item}
                    style={{ width: '2rem' }}
                    onClick={clickLote}
                    value={item}
                    name="lote"
                    key={item+'input'}
                  />
                </TableCell>
                <TableCell key={item}>{tabla[item]['enf']}</TableCell>
                <TableCell key={item + 'NombrePredio'}>{tabla[item]['nombre']}</TableCell>
                <TableCell key={item + 'Canastillas'}>{tabla[item]['canastillas']}</TableCell>
                <TableCell key={item + 'Kilos'}>{tabla[item]['kilos'].toFixed(2)}</TableCell>
                <TableCell key={item + 'TipoFruta'}>{tabla[item]['tipoFruta']}</TableCell>
                <TableCell key={item + 'fecha'}>
                  {format(new Date(tabla[item]['fecha']), 'MM/dd/yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {modalModificar &&
        createPortal(
          <ModificarHistorial closeModal={closeModal} propsModal={propsModal} funcOpenSuccess={funcOpenSuccess} />,
          document.body
        )}
    </Box>
  )
}
