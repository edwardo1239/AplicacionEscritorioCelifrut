/// <reference types="vite-plugin-svgr/client" />

import { CheckBox } from '@mui/icons-material'
import { createTheme } from '@mui/material/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert
} from '@mui/material'
import React, { useEffect, useReducer, useState } from 'react'
import { format } from 'date-fns'
import { createPortal } from 'react-dom'
import Vaciado from '../../modals/inventario/Vaciado'
import Directo from '../../modals/inventario/Directo'
import Desverdizado from '../../modals/inventario/Desverdizado'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'


export default function CheckBoxTable({ filtro }) {
  const [busqueda, setBusqueda] = useState('')
  const [titleTable, setTitleTable] = useState('Lotes')
  const [datosOriginales, setDatosOriginales] = useState({})
  //states de los botones
  const [showVaciar, setShowVaciar] = useState(false)
  const [showDirecto, setShowDirecto] = useState(false)
  const [showDesverdizar, setShowDesverdizar] = useState(false)
  //states de los modales
  const [showVaciarModal, setShowVaciarModal] = useState(false)
  const [showDirectoModal, setShowDirectoModal] = useState(false)
  const [showDesverdizadoModal, setShowDesverdizadoModal] = useState(false)
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
          action.datos[lote]['nombre'].toLowerCase().indexOf(busqueda.toLowerCase()) !== -1 ||
          String(action.datos[lote]['ICA'])
            .toLowerCase()
            .indexOf(String(busqueda).toLowerCase()) !== -1 ||
            format(new Date(action.datos[lote]['fecha']), 'dd-MM-yyyy').toLowerCase().indexOf(busqueda.toLowerCase()) !== -1 ||
          lote.toLowerCase().indexOf(busqueda.toLowerCase()) !== -1 ||
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
    dispatch({ datos: datosOriginales})
  }, [filtro])

  useEffect(() => {
    // Aquí puedes realizar acciones que dependan del nuevo valor de busqueda

  }, [busqueda]); // Escucha los cambios en busqueda
  

  //useEffect donde se obtiene la informacion de el Main
  useEffect(() => {
    const asyncFunction = async () => {
      try {
        const request = { action: 'obtenerFrutaActual' }
        const frutaActual = await window.api.inventario(request)
        setDatosOriginales(frutaActual.data)
        dispatch({ datos: frutaActual.data })
      } catch (e) {
        alert(`Fruta actual ${e.name}: ${e.message}`)
      }
    }
    asyncFunction()
  }, [])

  useEffect(() => {
    const asyncFunction = async () => {
      try {
        const request = { action: 'obtenerFrutaActual' }
        const frutaActual = await window.api.inventario(request)
        dispatch({ datos: frutaActual.data })
      } catch (e) {
        alert(`Fruta actual ${e.name}: ${e.message}`)
      }
    }
    asyncFunction()
  }, [showVaciarModal, showDirectoModal, showDesverdizadoModal])
  //useEffect donde se obtiene la informacion de el Main
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {

  //       const frutaActual = await window.api.leerMem()
  //       console.log(frutaActual)
  //       dispatch({ datos: frutaActual })
  //     } catch (e) {
  //       alert(e)
  //     }
  //   }, 500)
  //   return () => clearInterval(interval)
  // }, [])

  // funcion donde se selecciona el lote
  //se obtiene el nombre del radio button
  //el nombre es la ENF que a su vez es la key de el objeto tabla
  const clickLote = (e) => {
    let lote = e.target.value
    setPropsModal(() => ({
      nombre: tabla[lote]['nombre'],
      canastillas: tabla[lote]['inventario'],
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
    setPropsModal({ nombre: '', canastillas: 0 })
  }

  return (
    <div>
      <div className="grid grid-cols-5 gap-4 w-full justify-center items-center m-5">
        <h4 className="flex justify-center p-2">{titleTable}</h4>
        <h4 className="p-2">
          Kilos Total
          {tabla &&
            ' ' +
              Object.keys(tabla).reduce((acu, enf) => (acu += tabla[enf]['KilosActual']), 0)}{' '}
          Kg
        </h4>
        {/*boton desverdizado */}
        <button
          onClick={closeDesverdizado}
          className={
            showDesverdizar
              ? 'group relative inline-flex w-10/12 h-10 items-center overflow-hidden rounded bg-amber-500 px-8 py-3 text-white focus:outline-none active:bg-amber-700 active:border-amber-800'
              : 'invisible'
          }
        >
          <span className="absolute -end-full transition-all group-hover:end-4">
            <svg
              className="h-5 w-5 rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>

          <span class="text-sm font-medium transition-all group-hover:me-4">Desverdizar</span>
        </button>
          {/* boton vaciar lote  */}
        <button
          onClick={closeVaciado}
          className={
            showVaciar
              ? 'group relative inline-flex w-10/12 h-10 items-center overflow-hidden rounded bg-Celifrut-green px-8 py-3 text-white focus:outline-none active:bg-Celifrut-green-dark active:border-Celifrut-green-dark'
              : 'invisible'
          }
        >
          <span className="absolute -end-full transition-all group-hover:end-4">
            <svg
              className="h-5 w-5 rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>

          <span class="text-sm font-medium transition-all group-hover:me-4">Vaciar</span>
        </button>
          {/* boton directo nacional */}
        <button
          onClick={closeDirecto}
          className={
            showDirecto
              ? 'group relative inline-flex w-10/12 h-10 items-center overflow-hidden rounded bg-red-700 px-8 py-3 text-white focus:outline-none active:bg-red-900 active:border-red-700'
              : 'invisible'
          }
        >
          <span className="absolute  -end-full transition-all group-hover:end-4">
          <SwapHorizIcon />
          </span>

          <span class="text-sm font-medium transition-all group-hover:me-4">Directo Nacional</span> 
        </button>
      </div>
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
                      key={item + 'input'}
                    />
                  </TableCell>
                  <TableCell key={item}>{item}</TableCell>
                  <TableCell key={item + 'nombre'}>{tabla[item]['nombre']}</TableCell>
                  <TableCell key={item + 'ica'}>{tabla[item]['ICA']}</TableCell>
                  <TableCell key={item + 'fecha'}>
                    {format(new Date(tabla[item]['fecha']), 'dd-MM-yyyy')}
                  </TableCell>
                  <TableCell key={item + 'KilosActual'}>
                    {tabla[item]['KilosActual'] !== undefined
                      ? tabla[item]['KilosActual'].toFixed(2)
                      : 0}
                  </TableCell>
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
