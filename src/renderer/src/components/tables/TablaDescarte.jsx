import SendIcon from '@mui/icons-material/Send'
import { CheckBox } from '@mui/icons-material'
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
import ReplayIcon from '@mui/icons-material/Replay';
import React, { useEffect, useReducer, useState } from 'react'


let enfObj = {}


export default function TablaDescarte({ filtro }) {
  const [busqueda, setBusqueda] = useState('')
  const [titleTable, setTitleTable] = useState('')

  //states de los botones
  const [loading, setLoading] = useState(false)
  //states de los modales

  //props para los modales y de los modales
  const [openSucces, setOpenSuccess] = useState(false)
  const [openError, setOpenError] = useState(false)
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
      try{
        const frutaActual = await window.api.obtenerDescarte()
        dispatch({ datos: frutaActual })
      }catch(e){
        alert(e)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])



  //funcion para actualizar el descarte
  const clickActualizarDescarte = async () => {
    try{
      const response = await window.api.actualizarDescarte();
      dispatch({ datos: response })

    } catch(e){
      console.log(`${e.name}: ${e.message}`)
    }
  }

  // funcion donde se elimina la fruta descarte
  const clickEliminarFrutaDescarte = async () => {
    try {
      setLoading(true)
      const response = await window.api.eliminarFrutaDescarte(enfObj)
      console.log(response)
      if(response === 'Enviado con exito'){
        setLoading(false)
        setOpenSuccess(true)
        setMessage(response)
        enfObj = {}
      } else{
        setLoading(false)
        setOpenError(true)
        setMessage(response)
      }
      
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }
  //el nombre es la ENF que a su vez es la key de el objeto tabla
  const seleccionarDescarte = (e) => {
    const [enf, descarte, tipoDescarte] = e.value.split('/')

   

    if (e.checked) {
      enfObj[e.value] = tabla[enf][descarte][tipoDescarte]
    } else {
      delete enfObj[e.value]
    }

    if(Object.keys(enfObj).length !== 0){
      const x = Object.keys(enfObj).reduce((acu, item) => acu + enfObj[item], 0)
      setTitleTable(x)
    }
  }
  //funciones que cierra los modales


  return (
    <Box>
      <Toolbar>
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Total{' '}
          {tabla &&
            (Object.keys(tabla).reduce(
              (acu, item) => item != 'nombre' && item != 'tipoFruta'
                 ? acu + Object.keys(tabla[item]['descarteLavado']).reduce((acu2, item2) => acu2 + tabla[item]['descarteLavado'][item2], 0) 
                 : acu + 0,
              0
            ) + 
            Object.keys(tabla).reduce(
              (acu, item) => item != 'nombre' && item != 'tipoFruta'
                 ? acu + Object.keys(tabla[item]['descarteEncerado']).reduce((acu2, item2) => acu2 + tabla[item]['descarteEncerado'][item2], 0) 
                 : acu + 0,
              0
            )
            +
            'Kg')}
        </Typography>
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          {titleTable + 'Kg'}
        </Typography>

        <LoadingButton
          color="primary"
          loading={loading}
          loadingPosition="start"
          onClick={clickActualizarDescarte}
          startIcon={<ReplayIcon />}
          variant="contained"
          sx={{ width: '30%', marginRight:'2rem' }}
        >
          <span>Actualizar</span>
        </LoadingButton>

        <LoadingButton
          color="primary"
          loading={loading}
          loadingPosition="start"
          onClick={clickEliminarFrutaDescarte}
          startIcon={<SendIcon />}
          variant="contained"
          sx={{ width: '20%' }}
        >
          <span>Enviar</span>
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
                  {tabla && (Object.keys(tabla).reduce(
                    (acu, item) => tabla[item]['descarteLavado']['descarteGeneral'] + acu,
                    0
                  ) + 'Kg')}
                </span>
              </TableCell>
              <TableCell>
                Pareja lavado (Kg){' '}
                <span>
                  {tabla && (Object.keys(tabla).reduce(
                    (acu, item) => tabla[item]['descarteLavado']['pareja'] + acu,
                    0
                  ) + 'Kg')}
                </span>
              </TableCell>
              <TableCell>
                Balin lavado (Kg){' '}
                <span>
                  {tabla && (Object.keys(tabla).reduce(
                    (acu, item) => tabla[item]['descarteLavado']['balin'] + acu,
                    0
                  ) + 'Kg')}
                </span>
              </TableCell>
              <TableCell>
                General encerado (Kg){' '}
                <span>
                  {tabla && (Object.keys(tabla).reduce(
                    (acu, item) => tabla[item]['descarteEncerado']['descarteGeneral'] + acu,
                    0
                  ) + 'Kg')}
                </span>
              </TableCell>
              <TableCell>
                Pareja encerado (Kg){' '}
                <span>
                  {tabla && (Object.keys(tabla).reduce(
                    (acu, item) => tabla[item]['descarteEncerado']['pareja'] + acu,
                    0
                  ) + 'Kg')}
                </span>
              </TableCell>
              <TableCell>
                Balin encerado (Kg){' '}
                <span>
                  {tabla && (Object.keys(tabla).reduce(
                    (acu, item) => tabla[item]['descarteEncerado']['balin'] + acu,
                    0
                  ) + 'Kg')}
                </span>
              </TableCell>
              <TableCell>
                Extra encerado (Kg){' '}
                <span>
                  {tabla && (Object.keys(tabla).reduce(
                    (acu, item) => tabla[item]['descarteEncerado']['extra']  + acu,
                    0
                  ) + 'Kg')}
                </span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tabla &&
              Object.keys(tabla).map((item) => (
                <TableRow key={item+'tableRow'}>
                   <TableCell padding="checkbox" key={item+'tableCell'}>  
                    {/* <input type="checkbox" id={item} style={{ width: '2rem' }} onClick={clickLote} value={item} /> */}
                    <input
                      type="radio"
                      id={item}
                      style={{ width: '2rem' }}
                   
                      value={item}
                      name="lote"
                      key={item+'checkBox'}
                    />
                  </TableCell>
                  <TableCell key={item}>{item}</TableCell>
                  <TableCell key={item + 'nombre'}>{tabla[item]['nombre']}</TableCell>
                  <TableCell key={item + 'tipoFruta'}>{tabla[item]['tipoFruta']}</TableCell>
                  <TableCell key={item + 'General lavado' + 'cell'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'descarteLavado' + '/' + 'descarteGeneral'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item+'inputGeneralLavado'}
                    />{' '}
                    {tabla[item]['descarteLavado']['descarteGeneral']}
                  </TableCell>
                  <TableCell key={item + 'Pareja lavado' + 'cell'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'descarteLavado' + '/' + 'pareja'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item+'inputParejaLavado'}
                    />{' '}
                    {tabla[item]['descarteLavado']['pareja']}
                  </TableCell>
                  <TableCell key={item + 'Balin lavado'+'cell'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'descarteLavado' + '/' + 'balin'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item +'inputBalinLavado'}
                    />{' '}
                    {tabla[item]['descarteLavado']['balin']}
                  </TableCell>
                  <TableCell key={item + 'generalEnceradoCell'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'descarteEncerado' + '/' + 'descarteGeneral'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item+'inputGeneralEncerado'}
                    />{' '}
                    {tabla[item]['descarteEncerado']['descarteGeneral']}
                  </TableCell>
                  <TableCell key={item + 'parejaEnceradoCell'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'descarteEncerado' + '/' + 'pareja'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item+'inputParejaEncerado'}
                    />{' '}
                   {tabla[item]['descarteEncerado']['pareja']}
                  </TableCell>
                  <TableCell key={item + 'balinEnceradoCell'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'descarteEncerado' + '/' + 'balin'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item+'inputBalinEncerado'}
                    />{' '}
                    {tabla[item]['descarteEncerado']['balin']}
                  </TableCell>
                  <TableCell key={item + 'extraEnceradoCell'}>
                    <input
                      type="checkBox"
                      className="check"
                      value={item + '/' + 'descarteEncerado' + '/' + 'extra'}
                      onClick={(e) => seleccionarDescarte(e.target)}
                      style={{ width: 20, height: 20 }}
                      key={item+'inputExtraEncerado'}
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
    </Box>
  )
}
