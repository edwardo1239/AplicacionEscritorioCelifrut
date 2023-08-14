import SendIcon from '@mui/icons-material/Send'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Button,
  Snackbar,
  Alert
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import React, { useEffect, useReducer, useState } from 'react'
import { createPortal } from 'react-dom'

const enfObj = {}

export default function TablaDescarte({ filtro }) {
  const [busqueda, setBusqueda] = useState('')
  const [titleTable, setTitleTable] = useState('')

  //states de los botones
  const [loading, setLoading] = useState(false)
  //states de los modales

  //props para los modales y de los modales
  const [kilos, setKilos] = useState(0)
  const [openSucces, setOpenSuccess] = useState(false)
  const [message, setMessage] = useState('')
  //el reducer que renderiza la tabla
  const reducer = (tabla, action) => {
    if (busqueda === '') {
      tabla = action.datos
      return tabla
    } else {
      let obj = {}
      const tablaFiltrada = Object.keys(action.datos).filter(
        (lote) =>
          action.datos[lote]['Nombre Predio'].toLowerCase().indexOf(busqueda.toLowerCase()) !== -1
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
      const frutaActual = await window.api.obtenerDescarte()

      dispatch({ datos: frutaActual })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // funcion donde se elimina la fruta descarte
  const clickEliminarFrutaDescarte = async () => {
    try {
      setLoading(true)
      const response = await window.api.eliminarFrutaDescarte(enfObj)
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }
  //el nombre es la ENF que a su vez es la key de el objeto tabla
  const seleccionarDescarte = (e) => {
    const [enf, descarte] = e.value.split('/')

    if (e.checked) {
      enfObj[e.value] = tabla[enf][descarte]
    } else {
      delete enfObj[e.value]
    }

    const x = Object.keys(enfObj).reduce((acu, item) => acu + enfObj[item], 0)
    setTitleTable(x)
  }
  //funciones que cierra los modales

  //funcion para mostrar que la accion se llevo acabo con exito
  const funcOpenSuccess = (message) => {
    setOpenSuccess(true)
    setMessage(message)
  }

  return (
    <Box>
      <Toolbar>
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Total {titleTable + 'Kg'}
        </Typography>
        <LoadingButton
          color="primary"
          loading={loading}
          loadingPosition="start"
          onClick={clickEliminarFrutaDescarte}
          startIcon={<SendIcon />}
          variant="contained"
          sx={{ width: '20%', marginBottom: '5rem' }}
        >
          <span>Enviar</span>
        </LoadingButton>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ENF</TableCell>
              <TableCell>Nombre del Predio</TableCell>
              <TableCell>General Lavado (Kg)</TableCell>
              <TableCell>Pareja lavado (Kg)</TableCell>
              <TableCell>Balin lavado (Kg)</TableCell>
              <TableCell>General encerado (Kg)</TableCell>
              <TableCell>Pareja encerado (Kg)</TableCell>
              <TableCell>Balin encerado (Kg)</TableCell>
              <TableCell>Extra encerado (Kg)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tabla &&
              Object.keys(tabla).map((item) => (
                <TableRow>
                  <TableCell key={item}>{item}</TableCell>
                  <TableCell key={item + 'nombrePredio'}>{tabla[item]['Nombre Predio']}</TableCell>
                  <TableCell key={item + 'General lavado'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'General lavado'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                    />{' '}
                    {tabla[item]['General lavado']}
                  </TableCell>
                  <TableCell key={item + 'Pareja lavado'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'Pareja lavado'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                    />{' '}
                    {tabla[item]['Pareja lavado']}
                  </TableCell>
                  <TableCell key={item + 'Balin lavado'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'Balin lavado'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                    />{' '}
                    {tabla[item]['Balin lavado']}
                  </TableCell>
                  <TableCell key={item + 'General encerado'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'General encerado'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                    />{' '}
                    {tabla[item]['General encerado']}
                  </TableCell>
                  <TableCell key={item + 'Pareja encerado'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'Pareja encerado'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                    />{' '}
                    {tabla[item]['Pareja encerado']}
                  </TableCell>
                  <TableCell key={item + 'Balin encerado'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'Balin encerado'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                    />{' '}
                    {tabla[item]['Balin encerado']}
                  </TableCell>
                  <TableCell key={item + 'Extra encerado'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'Extra encerado'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                    />{' '}
                    {tabla[item]['Extra encerado']}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

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
