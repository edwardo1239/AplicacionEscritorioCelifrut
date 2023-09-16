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
  Button,
  Snackbar,
  Alert
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import SettingsIcon from '@mui/icons-material/Settings'

import React, { useReducer, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { format } from 'date-fns'
import PorcesarDesverdizado from '../modals/desverdizado/PorcesarDesverdizado'
import FinalizarDesverdizado from '../modals/desverdizado/FinalizarDesverdizado'
import Parametros from '../modals/desverdizado/Parametros'

export default function TableDesverdizando({ filtro }) {
  const [busqueda, setBusqueda] = useState('')
  const [titleTable, setTitleTable] = useState('Lotes')
  const [showFinalizar, setShowFinalizar] = useState(false)
  const [showProcesar, setShowProcesar] = useState(false)
  const [showParametros, setShowParametros] = useState(false)
  //states de los modales
  const [modalFinalizar, setModalFinalizar] = useState(false)
  const [modalProcesar, setModalProcesar] = useState(false)
  const [modalParametros, setModalParametros] = useState(false)
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
          action.datos[lote]['fecha'].toLowerCase().indexOf(busqueda.toLowerCase()) !== -1
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
      const frutaActual = await window.api.obtenerFrutaDesverdizando()
      //console.log(frutaActual)
      dispatch({ datos: frutaActual })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const clickLote = (e) => {
    let lote = e.target.value
    setPropsModal(() => ({
      nombre: tabla[lote]['nombre'],
      canastillas: tabla[lote]['canastillasIngreso'],
      enf: lote
    }))
    if (e.target.checked) {
      setTitleTable(lote + ' ' + tabla[lote]['nombre'])
      if (!tabla[lote].hasOwnProperty('fechaFinalizado')) {
        setShowFinalizar(true)
        setShowProcesar(false)
        setShowParametros(true)
      } else {
        setShowProcesar(true)
        setShowFinalizar(false)
        setShowParametros(true)
      }
    }
  }

  //funciones que cierra los modales
  const closeModalF = () => {
    setModalFinalizar(!modalFinalizar)
  }
  const closeModalP = () => {
    setModalProcesar(!modalProcesar)
  }
  const closeModalParametros = () => {
    setModalParametros(!modalParametros)
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
        <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
          {showParametros && (
            <Button
              variant="contained"
              endIcon={<SettingsIcon />}
              onClick={closeModalParametros}
              sx={{ fontSize: 10 }}
            >
              Parametros
            </Button>
          )}
          {showFinalizar && (
            <Button
              variant="contained"
              endIcon={<DoneAllIcon />}
              onClick={closeModalF}
              sx={{ fontSize: 10 }}
            >
              Finalizar
            </Button>
          )}
          {showProcesar && (
            <Button
              variant="contained"
              endIcon={<LogoutIcon />}
              onClick={closeModalP}
              sx={{ fontSize: 10 }}
            >
              Procesar
            </Button>
          )}
        </div>
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
              <TableCell>Canastillas Ingreso</TableCell>
              <TableCell>Kilos Ingreso</TableCell>
              <TableCell>Cuarto Desverdizado</TableCell>
              <TableCell>Fecha Ingreso</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tabla &&
              Object.keys(tabla)
                .reverse()
                .map((item) => (
                  <TableRow
                    key={item + 'tableRow'}
                    sx={
                      new Date(tabla[item]['fechaIngreso']).getDate() > new Date().getDate() + 5
                        ? { backgroundColor: 'red' }
                        : { backgroundColor: 'white' }
                    }
                  >
                    <TableCell padding="checkbox" key={item + 'tablecellInput'}>
                      {/* <input type="checkbox" id={item} style={{ width: '2rem' }} onClick={clickLote} value={item} /> */}
                      <input
                        type="radio"
                        id={item}
                        style={{ width: '2rem' }}
                        onClick={clickLote}
                        value={item}
                        name="lote"
                        key={item + 'input'}
                      />
                    </TableCell>
                    <TableCell key={item}>{item}</TableCell>
                    <TableCell key={item + 'NombrePredio'}>{tabla[item]['nombre']}</TableCell>
                    <TableCell key={item + 'Canastillas'}>
                      {tabla[item]['canastillasIngreso']}
                    </TableCell>
                    <TableCell key={item + 'Kilos'}>{tabla[item]['kilosIngreso'].toFixed(2)}</TableCell>
                    <TableCell key={item + 'cuartoDesverdizado'}>
                      {tabla[item]['cuartoDesverdizado']}
                    </TableCell>
                    <TableCell key={item + 'fechaIngreso'}>
                      {format(new Date(tabla[item]['fechaIngreso']), 'MM/dd/yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      {modalProcesar &&
        createPortal(
          <PorcesarDesverdizado
            closeModal={closeModalP}
            propsModal={propsModal}
            funcOpenSuccess={funcOpenSuccess}
          />,
          document.body
        )}
      {modalFinalizar &&
        createPortal(
          <FinalizarDesverdizado
            closeModal={closeModalF}
            propsModal={propsModal}
            funcOpenSuccess={funcOpenSuccess}
          />,
          document.body
        )}

      {modalParametros &&
        createPortal(
          <Parametros
            closeModal={closeModalParametros}
            propsModal={propsModal}
            funcOpenSuccess={funcOpenSuccess}
          />,
          document.body
        )}

      <Snackbar
        open={openSucces}
        autoHideDuration={6000}
        onClose={() => setOpenSuccess(false)}
        sx={{ marginLeft: '50%' }}
      >
        <Alert severity="success">{message}</Alert>
      </Snackbar>
    </Box>
  )
}
