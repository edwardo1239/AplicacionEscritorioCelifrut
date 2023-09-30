import { CheckBox } from '@mui/icons-material'
import { createTheme } from '@mui/material/styles'
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import ColorLensIcon from '@mui/icons-material/ColorLens'
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
import React, { useEffect, useReducer, useState } from 'react'
import { format } from 'date-fns'
import { createPortal } from 'react-dom'
import Vaciado from '../../modals/inventario/Vaciado'
import Directo from '../../modals/inventario/Directo'
import Desverdizado from '../../modals/inventario/Desverdizado'

export default function CheckBoxTable({ filtro }) {
  const [busqueda, setBusqueda] = useState('')
  const [titleTable, setTitleTable] = useState('Lotes')
  //states de los botones
  const [showVaciar, setShowVaciar] = useState(false)
  const [showDirecto, setShowDirecto] = useState(false)
  const [showDesverdizar, setShowDesverdizar] = useState(false)
  //states de los modales
  const [showVaciarModal, setShowVaciarModal] = useState(false)
  const [showDirectoModal, setShowDirectoModal] = useState(false)
  const [showDesverdizadoModal, setShowDesverdizadoModal] = useState(false);
  //props para los modales y de los modales
  const [propsModal, setPropsModal] = useState({ nombre: '', canastillas: 0 })
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
          action.datos[lote]['nombre'].toLowerCase().indexOf(busqueda.toLowerCase()) !==
            -1 ||
          String(action.datos[lote]['ICA'])
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
      const frutaActual = await window.api.obtenerFrutaActual()

      dispatch({ datos: frutaActual })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // funcion donde se selecciona el lote 
  //se obtiene el nombre del radio button
  //el nombre es la ENF que a su vez es la key de el objeto tabla
  const clickLote = (e) => {
    let lote = e.target.value
    setPropsModal(() => ({
      nombre: tabla[lote]['nombre'],
      canastillas: tabla[lote]["inventario"],
      enf: lote
    }))
    if (e.target.checked) {
      setTitleTable(lote + ' ' + tabla[lote]['nombre'])
      if (tabla[lote]['tipoFruta'] == 'Naranja') {
        setShowVaciar(true)
        setShowDirecto(true)
        setShowDesverdizar(true)
      } else if (tabla[lote]['tipoFruta'] == 'Limon') {
        setShowVaciar(true)
        setShowDirecto(true)
        setShowDesverdizar(false)
      }
    }
  }

  //funciones que cierra los modales
  const closeVaciado = () => {
    setShowVaciarModal(!showVaciarModal)
  }
  const closeDirecto = () => {
    setShowDirectoModal(!showDirectoModal)
  }
  const closeDesverdizado = () => {
    setShowDesverdizadoModal(!showDesverdizadoModal)
  }

  //funcion para mostrar que la accion se llevo acabo con exito
  const funcOpenSuccess = (message) => {
    setOpenSuccess(false)
    setOpenSuccess(true)
    setMessage(message)
    document.getElementById(propsModal.enf).checked = false
    setPropsModal(({ nombre: '', canastillas: 0 }))
  }

  return (
    <div>
      <Toolbar>
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          {titleTable}
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
          {showVaciar && (
            <Button
              variant="contained"
              endIcon={<MoveToInboxIcon />}
              color="success"
              onClick={closeVaciado}
            >
              Vaciar
            </Button>
          )}
          {showDirecto && (
            <Button variant="contained" endIcon={<SwapHorizIcon />} theme={directoNacionalTheme} onClick={closeDirecto}>
              Nacional
            </Button>
          )}
          {showDesverdizar && (
            <Button variant="contained" endIcon={<ColorLensIcon />} theme={desverdizadoTheme} onClick={closeDesverdizado}>
              Desverdizado
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
              <TableCell>Codigo ICA</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Kilos</TableCell>
              <TableCell>Canastillas</TableCell>
              <TableCell>Tipo Fruta</TableCell>
              <TableCell>Observaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tabla &&
              Object.keys(tabla).map((item) => (
                <TableRow key={item + 'tableRow'}>
                  <TableCell padding="checkbox" key={item + 'cell'}>
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
                  <TableCell key={item}>{item}</TableCell>
                  <TableCell key={item + 'nombre'}>{tabla[item]['nombre']}</TableCell>
                  <TableCell key={item + 'ica'}>{tabla[item]['ICA']}</TableCell>
                  <TableCell key={item + 'fecha'}>
                    {format(new Date(tabla[item]['fecha']), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell key={item + 'KilosActual'}>{tabla[item]['KilosActual'].toFixed(2)}</TableCell>
                  <TableCell key={item + 'inventario'}>{tabla[item]['inventario']}</TableCell>
                  <TableCell key={item + 'tipoFruta'}>{tabla[item]['tipoFruta']}</TableCell>
                  <TableCell key={item + 'observaciones'}>{tabla[item]['observaciones']}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showVaciarModal &&
        createPortal(
          <Vaciado
            closeVaciado={closeVaciado}
            propsModal={propsModal}
            funcOpenSuccess={funcOpenSuccess}
          />,
          document.body
        )}
      {showDirectoModal &&
        createPortal(
          <Directo 
          closeDirecto={closeDirecto}
            propsModal={propsModal}
            funcOpenSuccess={funcOpenSuccess}
          />,
          document.body
        )}
      {showDesverdizadoModal &&
        createPortal(
          <Desverdizado 
          closeDesverdizado={closeDesverdizado}
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
    </div>
  )
}

const directoNacionalTheme = createTheme({
  palette: {
    primary: {
      main: '#9E3C29'
    },
    secondary: {
      main: '#fdd835'
    }
  }
})

const desverdizadoTheme = createTheme({
  palette: {
    primary: {
      main: '#ffea00'
    },
    secondary: {
      main: '#b2a300'
    }
  }
})
