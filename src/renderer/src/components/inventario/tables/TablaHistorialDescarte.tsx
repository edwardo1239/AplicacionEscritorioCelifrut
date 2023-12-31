import React, { useEffect, useReducer, useState } from 'react'
import Api from '../../../../../preload/types'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography
} from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { format } from 'date-fns'

type propsType = {
  filtro: string
}

export default function TablaHistorialDescarte(props: propsType) {
  const [busqueda, setBusqueda] = useState<string>('')
  const [titleTable, setTitleTable] = useState<string>('Lotes')
  //state
  const [filaClickeada, setFilaClickeada] = useState<string>('')

  //el reducer que renderiza la tabla
  const reducer = (tabla, action) => {
    if (busqueda === '') {
      tabla = action.datos
      return tabla
    } else {
      let obj = {}
      const tablaFiltrada = Object.keys(action.datos).filter(
        (ids) => ids.toLowerCase().indexOf(busqueda.toLowerCase()) !== -1
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
    setBusqueda(props.filtro)
  }, [props.filtro])

  //useEffect donde se obtiene la informacion de el Main
  useEffect(() => {
    const asyncFunction = async () => {
      const request = {action:'obtenerHistorialDescarte'}
      const descarte =  await window.api.inventario(request)
      console.log(descarte)
      dispatch({ datos: descarte.data })
    }
    asyncFunction()
  }, [])


  const clickFila = (id: string) => {
    if (filaClickeada === id) setFilaClickeada('')
    else setFilaClickeada(id)
  }

  return (
    <div>
      <Toolbar>
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          {titleTable}
        </Typography>
      
      </Toolbar>
      <TableContainer>
        <Table sx={{ maxWidth: 1900 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <ArrowForwardIosIcon />
              </TableCell>
              <TableCell>ID descarte</TableCell>
              <TableCell>Tipo de fruta</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Kilos</TableCell>
              <TableCell>Accion</TableCell>
            </TableRow>
          </TableHead>
          {tabla &&
            Object.keys(tabla).map((ids) => (
              <TableBody key={ids + 'tabla'}>
                <TableRow key={ids + 'tableRow'}>
                  <TableCell
                    key={ids + 'botonFlecha'}
                    padding="checkbox"
                    onClick={() => clickFila(ids)}
                  >
                    {filaClickeada === ids ? (
                      <ArrowForwardIosIcon
                        sx={{
                          width: 10,
                          cursor: 'pointer',
                          marginLeft: 4,
                          transform: false ? 'rotate(0deg)' : 'rotate(90deg)'
                        }}
                      />
                    ) : (
                      <ArrowForwardIosIcon
                        sx={{
                          width: 10,
                          cursor: 'pointer',
                          marginLeft: 4,
                          transform: false ? 'rotate(0deg)' : 'rotate(0deg)'
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell key={ids + 'Cell'} padding="checkbox">
                    {ids}
                  </TableCell>
                  <TableCell key={ids + 'tipoFruta'} padding="checkbox">
                    {tabla[ids]['tipoFruta']}
                  </TableCell>
                  <TableCell key={ids + 'fecha'} padding="checkbox">
                    {format(new Date(tabla[ids]['fecha']), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell key={ids + 'kilos'} padding="checkbox">
                    {Object.keys(tabla[ids].predios).reduce((total: any, enf: any) => {
                      if (enf !== 'fecha' && enf !== '_id' && enf !== '__v' ) {
                        console.log(enf)
                        total += Object.keys(tabla[ids].predios[enf]).reduce(
                          (tipoDescarte: any, descarte: any) => {
                            //console.log(descarte)
                            if (descarte !== 'cliente' && descarte !== 'fecha' && typeof(descarte) !== 'object') {
                              tipoDescarte += Object.keys(tabla[ids].predios[enf][descarte]).reduce(
                                (acu: any, item) => (acu += tabla[ids].predios[enf][descarte][item]),
                                0
                              )
                            } else tipoDescarte += 0
                            return tipoDescarte
                          },
                          0
                        )
                      } else {
                        total += 0
                      }
                      return total
                    }, 0)}
                  </TableCell>
                  <TableCell key={ids + 'tipoFruta'} padding="checkbox">
                    {tabla[ids]['accion']}
                  </TableCell>
                </TableRow>
                {filaClickeada === ids ? (
                  <TableRow key={ids + 'tablaAux'}>
                    <TableCell
                      colSpan={6}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        overflow: 'visible',
                        width: 80,
                        gap: 6,
                        borderColor: 'white'
                      }}
                    >
                      <div style={{ width: 50, fontSize: 10 }}> ENF</div>
                      <div style={{ width: 50, fontSize: 10 }}>General lavado(Kg)</div>
                      <div style={{ width: 50, fontSize: 10 }}>Pareja lavado(Kg)</div>
                      <div style={{ width: 50, fontSize: 10 }}>Balin lavado(Kg)</div>
                      <div style={{ width: 50, fontSize: 10 }}>General Encerado(Kg)</div>
                      <div style={{ width: 50, fontSize: 10 }}>Extra Encerado(Kg)</div>
                      <div style={{ width: 50, fontSize: 10 }}>Pareja Encerado(Kg)</div>
                      <div style={{ width: 50, fontSize: 10 }}>Balin Encerado(Kg)</div>
                    </TableCell>

                    {Object.keys(tabla[ids].predios).map((enf) =>
                      enf !== 'fecha' && enf !== '_id' && enf !== '__v' && enf != 'tipoFruta' ? (
                        <TableCell
                          colSpan={6}
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            overflow: 'visible',
                            width: 100,
                            gap: 10,
                            borderColor: 'white'
                          }}
                        >
                          <div style={{ width: 50, fontSize: 10 }}> {enf}</div>
                          <div style={{ width: 50, fontSize: 10 }}>
                            {tabla[ids].predios[enf]['descarteLavado']?.['descarteGeneral'] ?
                              tabla[ids].predios[enf]['descarteLavado']['descarteGeneral'] : 0}
                          </div>
                          <div style={{ width: 50, fontSize: 10 }}>
                            {tabla[ids].predios[enf]['descarteLavado']?.['pareja'] ?
                              tabla[ids].predios[enf]['descarteLavado']['pareja'] : 0}
                          </div>
                          <div style={{ width: 50, fontSize: 10 }}>
                            {tabla[ids].predios[enf]['descarteLavado']?.['balin'] ?
                              tabla[ids].predios[enf]['descarteLavado']['balin'] : 0}
                          </div>
                          <div style={{ width: 50, fontSize: 10 }}>
                            {tabla[ids].predios[enf]['descarteEncerado']?.['descarteGeneral'] ?
                              tabla[ids].predios[enf]['descarteEncerado']['descarteGeneral'] : 0}
                          </div>
                          <div style={{ width: 50, fontSize: 10 }}>
                            {tabla[ids].predios[enf]['descarteEncerado']?.['extra'] ?
                              tabla[ids].predios[enf]['descarteEncerado']['extra'] : 0}
                          </div>
                          <div style={{ width: 50, fontSize: 10 }}>
                            {tabla[ids].predios[enf]['descarteEncerado']?.['pareja'] ?
                              tabla[ids].predios[enf]['descarteEncerado']['pareja'] : 0}
                          </div>
                          <div style={{ width: 50, fontSize: 10 }}>
                            {tabla[ids].predios[enf]['descarteEncerado']?.['balin'] ?
                              tabla[ids].predios[enf]['descarteEncerado']['balin'] : 0}
                          </div>
                        
                          <hr></hr>
                        </TableCell>
                      ) : null
                    )}
                  </TableRow>
                ) : null}
              </TableBody>
            ))}
        </Table>
      </TableContainer>
    </div>
  )
}
