import { CheckBox } from '@mui/icons-material'
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
  Snackbar,
  Alert
} from '@mui/material'
import RestoreIcon from '@mui/icons-material/Restore'
import React, { useReducer, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { format } from 'date-fns'
import ModificarHistorial from '../../modals/ModificarHistorial'

export default function TablaHistorialVaciado({ filtro }) {
  const [busqueda, setBusqueda] = useState('')
  const [titleTable, setTitleTable] = useState('Lotes')
  const [showBtnModificar, setShowBtnModificar] = useState(false)
  const [datosOriginales, setDatosOriginales] = useState({})
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
          format(new Date(action.datos[lote]['fecha']), 'dd-MM-yyyy')
            .toLowerCase()
            .indexOf(busqueda.toLowerCase()) !== -1 ||
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
    dispatch({ datos: datosOriginales})
    setBusqueda(filtro)
  }, [filtro])

  //useEffect donde se obtiene la informacion de el servidor
  useEffect(() => {
    const makeReq = async () => {
      try {
        const request = { action: 'obtenerHistorialProceso' }
        const descarte = await window.api.inventario(request)
        setDatosOriginales(descarte.data)
        dispatch({ datos: descarte.data })
      } catch (e) {
        alert(`Historial vaciado ${e.name}:${e.message}`)
      }
    }
    makeReq()
  }, [])

  useEffect(() => {
    const makeReq = async () => {
      try {
        const request = { action: 'obtenerHistorialProceso' }
        const descarte = await window.api.inventario(request)
        dispatch({ datos: descarte.data })
      } catch (e) {
        alert(`Historial vaciado ${e.name}:${e.message}`)
      }
    }
    makeReq()
  }, [modalModificar])

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
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Kilos Total
          {tabla &&
            ' ' + Object.keys(tabla).reduce((acu, enf) => (acu += tabla[enf]['kilos']), 0)}{' '}
          Kg
        </Typography>

        {showBtnModificar && (
          <button
            onClick={closeModal}
            class="group relative inline-flex items-center overflow-hidden w-[20rem] mr-10 rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
            href="/download"
          >
            <span class="absolute -end-full transition-all group-hover:end-4">
              <RestoreIcon />
            </span>

            <span class="text-sm font-medium transition-all group-hover:me-4">Modificar</span>
          </button>
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
              <TableCell>Rendimiento</TableCell>
              <TableCell>Tipo Fruta</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tabla &&
              Object.keys(tabla)
                .reverse()
                .map((item) => (
                  <TableRow key={item + 'tableRow'}>
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
                    <TableCell key={item}>{tabla[item]['enf']}</TableCell>
                    <TableCell key={item + 'NombrePredio'}>{tabla[item]['nombre']}</TableCell>
                    <TableCell key={item + 'Canastillas'}>{tabla[item]['canastillas']}</TableCell>
                    <TableCell key={item + 'Kilos'}>
                      {tabla[item]['kilos'] !== undefined ? tabla[item]['kilos'].toFixed(2) : 0}
                    </TableCell>
                    <TableCell key={item + 'rendimiento'}>
                      {tabla[item]['rendimiento'] !== undefined
                        ? tabla[item]['rendimiento'].toFixed(2)
                        : 0}
                      %
                    </TableCell>
                    <TableCell key={item + 'TipoFruta'}>{tabla[item]['tipoFruta']}</TableCell>
                    <TableCell key={item + 'fecha'}>
                      {format(new Date(tabla[item]['fecha']), 'dd-MM-yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      {modalModificar &&
        createPortal(
          <ModificarHistorial
            closeModal={closeModal}
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
