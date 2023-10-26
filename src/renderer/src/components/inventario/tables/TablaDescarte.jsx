import SendIcon from '@mui/icons-material/Send'
import { CheckBox, Rowing } from '@mui/icons-material'
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
  Snackbar,
  Alert
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import ReplayIcon from '@mui/icons-material/Replay'
import RecyclingIcon from '@mui/icons-material/Recycling'
import React, { useEffect, useReducer, useState } from 'react'
import { createPortal } from 'react-dom'
import ReprocesoDescarte from '../../modals/ReprocesoDescarte'
import EnvioDescarte from '../../modals/EnvioDescarte'

let enfObj = {}

export default function TablaDescarte({ filtro }) {
  const [busqueda, setBusqueda] = useState('')
  const [titleTable, setTitleTable] = useState('0')

  //states de los botones
  const [loading, setLoading] = useState(false)
  const [btnReproceso, setBtnReproceso] = useState(false)
  //states de los modales
  const [modal, setModal] = useState(false)
  const [modalEnviar, setModalEnviar] = useState(false)
  //props para los modales y de los modales
  const [openSucces, setOpenSuccess] = useState(false)
  const [openError, setOpenError] = useState(false)
  const [message, setMessage] = useState('')
  const [messageModal, setMessageModal] = useState('')
  const [propsModals, setPropsModals] = useState({})

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
    const asyncFunction = async () => {
      const frutaActual = await window.api.reqObtenerDescarte()
      dispatch({ datos: frutaActual })
    }
    asyncFunction()
  }, [])

  //useEffect donde se obtiene la informacion de el Main
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const frutaActual = await window.api.obtenerDescarte()
        dispatch({ datos: frutaActual })
      } catch (e) {
        alert(e)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])

  //poner en 0 todos los valores
  useEffect(() => {
    setTitleTable('0')
    enfObj = {}
  }, [])

  //funcion para actualizar el descarte
  const clickActualizarDescarte = async () => {
    try {
      const response = await window.api.actualizarDescarte()
      dispatch({ datos: response })
    } catch (e) {
      console.log(`${e.name}: ${e.message}`)
    }
  }

  //el nombre es la ENF que a su vez es la key de el objeto tabla
  const seleccionarDescarte = (e) => {
    const [enf, descarte, tipoDescarte] = e.value.split('/')
    setBtnReproceso(false)
    if (e.checked) {
      enfObj[e.value] = tabla[enf][descarte][tipoDescarte]
    } else {
      delete enfObj[e.value]
      if (Object.keys(enfObj).length === 0) {
        setTitleTable('0')
      }
    }

    if (Object.keys(enfObj).length !== 0) {
      let x = Object.keys(enfObj).reduce((acu, item) => acu + enfObj[item], 0)
      setTitleTable(x)
    }
  }
  //funciones que cierra los modales

  const uncheckCheckBox = (e = 'check') => {
    let x = document.getElementsByClassName(e)
    for (let i = 0; i < x.length; i++) {
      x[i].checked = false
    }
  }

  const checkCheckbox = (e) => {
    let x = document.getElementsByClassName(e)
    for (let i = 0; i < x.length; i++) {
      x[i].checked = true
    }
  }

  const clickRadioButton = (row, index) => {
    let rowButton = document.getElementsByClassName(index)
    //console.log(rowButton[0].checked)
    if (rowButton[0].checked == true) {
      checkCheckbox(row)

      let x = document.getElementsByClassName(row)
      console.log(row)
      for (let i = 0; i < x.length; i++) {
        let [enf, descarte, tipoDescarte] = x[i].value.split('/')
        enfObj[x[i].value] = tabla[enf][descarte][tipoDescarte]
      }
      console.log(enfObj)
      let y = Object.keys(enfObj).reduce((acu, item) => acu + enfObj[item], 0)

      setBtnReproceso(true)
      setTitleTable(y)

      let enfs = []
      let keys = Object.keys(enfObj)
      for (let i = 0; i < keys.length; i++) {
        let [enf, descarte, tipoDescarte] = keys[i].split('/')
        enfs.push(enf)
      }
      for (let i = 0; i < enfs.length - 1; i++) {
        if (enfs[i] !== enfs[i + 1]) {
          setBtnReproceso(false)
        }
      }
    } else {
      uncheckCheckBox(row)
      setTitleTable('0')
      setBtnReproceso(false)
      enfObj = {}
    }
  }

  const reprocesoDescarteUnPredio = () => {
    setPropsModals(enfObj)
    setMessageModal('¿Desea reprocesar el descarte del predio seleccionado?')
    closeModal()
  }

  const closeModal = () => {
    if (modal === true) enfObj = {}
    setModal(!modal)
    setPropsModals(enfObj)
  }

  const closeModalEnviar = () => {
    console.log(modalEnviar)
    if (modalEnviar === true) enfObj = {}
    setModalEnviar(!modalEnviar)
    setPropsModals(enfObj)
  }

  //funcion para mostrar que la accion se llevo acabo con exito
  const funcOpenSuccess = (message) => {
    setOpenSuccess(false)
    setOpenSuccess(true)
    setMessage(message)
  }

  const reprocesoCelifrut = async () => {
    setPropsModals(enfObj)
    setMessageModal('¿Desea reprocesar los descartes unificados en forma de Celifrut?')
    closeModal()
  }

  return (
    <Box>
      <Toolbar>
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Total{' '}
          {tabla &&
            Object.keys(tabla).reduce(
              (acu, item) =>
                item != 'nombre' && item != 'tipoFruta'
                  ? acu +
                    Object.keys(tabla[item]['descarteLavado']).reduce(
                      (acu2, item2) => acu2 + tabla[item]['descarteLavado'][item2],
                      0
                    )
                  : acu + 0,
              0
            ) +
              Object.keys(tabla).reduce(
                (acu, item) =>
                  item != 'nombre' && item != 'tipoFruta'
                    ? acu +
                      Object.keys(tabla[item]['descarteEncerado']).reduce(
                        (acu2, item2) => acu2 + tabla[item]['descarteEncerado'][item2],
                        0
                      )
                    : acu + 0,
                0
              ) +
              'Kg'}
        </Typography>
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          {titleTable + 'Kg'}
        </Typography>
        {/* 
        <LoadingButton
          color="primary"
          loading={loading}
          loadingPosition="start"
          onClick={clickActualizarDescarte}
          startIcon={<ReplayIcon />}
          variant="contained"
          sx={{ width: '35%', marginRight: '2rem' }}
        >
          <span>Actualizar</span>
        </LoadingButton> */}

        {btnReproceso ? (
          <LoadingButton
            color="primary"
            loading={loading}
            loadingPosition="start"
            startIcon={<RecyclingIcon />}
            onClick={reprocesoDescarteUnPredio}
            variant="contained"
            sx={{ width: '40%', marginRight: '2rem' }}
          >
            <span>Reproceso</span>
          </LoadingButton>
        ) : (
          <LoadingButton
            color="primary"
            loading={loading}
            loadingPosition="start"
            startIcon={<RecyclingIcon />}
            onClick={reprocesoCelifrut}
            variant="contained"
            sx={{ width: '40%', marginRight: '2rem', fontSize: 8 }}
          >
            <span>Reproceso Celifrut</span>
          </LoadingButton>
        )}

        <LoadingButton
          color="primary"
          loading={loading}
          loadingPosition="start"
          onClick={closeModalEnviar}
          startIcon={<SendIcon />}
          variant="contained"
          sx={{ width: '25%' }}
        >
          <span>Salida</span>
        </LoadingButton>
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
              <TableCell>Tipo Fruta</TableCell>
              <TableCell>
                General Lavado (Kg){' '}
                <span>
                  {tabla &&
                    Object.keys(tabla).reduce(
                      (acu, item) => tabla[item]['descarteLavado']['descarteGeneral'] + acu,
                      0
                    ) + 'Kg'}
                </span>
              </TableCell>
              <TableCell>
                Pareja lavado (Kg){' '}
                <span>
                  {tabla &&
                    Object.keys(tabla).reduce(
                      (acu, item) => tabla[item]['descarteLavado']['pareja'] + acu,
                      0
                    ) + 'Kg'}
                </span>
              </TableCell>
              <TableCell>
                Balin lavado (Kg){' '}
                <span>
                  {tabla &&
                    Object.keys(tabla).reduce(
                      (acu, item) => tabla[item]['descarteLavado']['balin'] + acu,
                      0
                    ) + 'Kg'}
                </span>
              </TableCell>
              <TableCell>
                General encerado (Kg){' '}
                <span>
                  {tabla &&
                    Object.keys(tabla).reduce(
                      (acu, item) => tabla[item]['descarteEncerado']['descarteGeneral'] + acu,
                      0
                    ) + 'Kg'}
                </span>
              </TableCell>
              <TableCell>
                Pareja encerado (Kg){' '}
                <span>
                  {tabla &&
                    Object.keys(tabla).reduce(
                      (acu, item) => tabla[item]['descarteEncerado']['pareja'] + acu,
                      0
                    ) + 'Kg'}
                </span>
              </TableCell>
              <TableCell>
                Balin encerado (Kg){' '}
                <span>
                  {tabla &&
                    Object.keys(tabla).reduce(
                      (acu, item) => tabla[item]['descarteEncerado']['balin'] + acu,
                      0
                    ) + 'Kg'}
                </span>
              </TableCell>
              <TableCell>
                Extra encerado (Kg){' '}
                <span>
                  {tabla &&
                    Object.keys(tabla).reduce(
                      (acu, item) => tabla[item]['descarteEncerado']['extra'] + acu,
                      0
                    ) + 'Kg'}
                </span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tabla &&
              Object.keys(tabla).map((item, index) => (
                <TableRow key={item + 'tableRow'}>
                  <TableCell padding="checkbox" key={item + 'tableCell'}>
                    {/* <input type="checkbox" id={item} style={{ width: '2rem' }} onClick={clickLote} value={item} /> */}
                    <input
                      type="checkBox"
                      className={index}
                      id={item}
                      style={{ width: '2rem' }}
                      readOnly
                      value={item}
                      name="lote"
                      key={item + 'checkBox'}
                      onClick={() => clickRadioButton(item, index)}
                    />
                  </TableCell>
                  <TableCell key={item}>{item}</TableCell>
                  <TableCell key={item + 'nombre'}>{tabla[item]['nombre']}</TableCell>
                  <TableCell key={item + 'tipoFruta'}>{tabla[item]['tipoFruta']}</TableCell>
                  <TableCell key={item + 'General lavado' + 'cell'}>
                    <input
                      type="checkBox"
                      className={'check' + ' ' + item}
                      value={item + '/' + 'descarteLavado' + '/' + 'descarteGeneral'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item + 'inputGeneralLavado'}
                      readOnly
                    />{' '}
                    {tabla[item]['descarteLavado']['descarteGeneral']}
                  </TableCell>
                  <TableCell key={item + 'Pareja lavado' + 'cell'}>
                    <input
                      type="checkBox"
                      className={'check' + ' ' + item}
                      value={item + '/' + 'descarteLavado' + '/' + 'pareja'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item + 'inputParejaLavado'}
                      readOnly
                    />{' '}
                    {tabla[item]['descarteLavado']['pareja']}
                  </TableCell>
                  <TableCell key={item + 'Balin lavado' + 'cell'}>
                    <input
                      type="checkBox"
                      className={'check' + ' ' + item}
                      value={item + '/' + 'descarteLavado' + '/' + 'balin'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item + 'inputBalinLavado'}
                      readOnly
                    />{' '}
                    {tabla[item]['descarteLavado']['balin']}
                  </TableCell>
                  <TableCell key={item + 'generalEnceradoCell'}>
                    <input
                      type="checkBox"
                      className={'check' + ' ' + item}
                      value={item + '/' + 'descarteEncerado' + '/' + 'descarteGeneral'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item + 'inputGeneralEncerado'}
                      readOnly
                    />{' '}
                    {tabla[item]['descarteEncerado']['descarteGeneral']}
                  </TableCell>
                  <TableCell key={item + 'parejaEnceradoCell'}>
                    <input
                      type="checkBox"
                      className={'check' + ' ' + item}
                      value={item + '/' + 'descarteEncerado' + '/' + 'pareja'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item + 'inputParejaEncerado'}
                      readOnly
                    />{' '}
                    {tabla[item]['descarteEncerado']['pareja']}
                  </TableCell>
                  <TableCell key={item + 'balinEnceradoCell'}>
                    <input
                      type="checkBox"
                      className={'check' + ' ' + item}
                      value={item + '/' + 'descarteEncerado' + '/' + 'balin'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item + 'inputBalinEncerado'}
                      readOnly
                    />{' '}
                    {tabla[item]['descarteEncerado']['balin']}
                  </TableCell>
                  <TableCell key={item + 'extraEnceradoCell'}>
                    <input
                      type="checkBox"
                      className={'check' + ' ' + item}
                      value={item + '/' + 'descarteEncerado' + '/' + 'extra'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item + 'inputExtraEncerado'}
                      readOnly
                    />{' '}
                    {tabla[item]['descarteEncerado']['extra']}
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
      <Snackbar open={openError} autoHideDuration={6000} onClose={() => setOpenError(false)}>
        <Alert severity="error">{message}</Alert>
      </Snackbar>

      {modal &&
        createPortal(
          <ReprocesoDescarte
            closeModal={closeModal}
            propsModal={propsModals}
            funcOpenSuccess={funcOpenSuccess}
            messageModal={messageModal}
          />,
          document.body
        )}
      {modalEnviar &&
        createPortal(
          <EnvioDescarte
            closeModalEnviar={closeModalEnviar}
            propsModal={propsModals}
            funcOpenSuccess={funcOpenSuccess}
          />,
          document.body
        )}
    </Box>
  )
}
