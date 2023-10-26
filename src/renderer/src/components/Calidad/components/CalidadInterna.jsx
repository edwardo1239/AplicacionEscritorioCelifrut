import React, { useState, useEffect } from 'react'
import './CalidadInterna.css'
import './App.css'
import { AppBar, Toolbar } from '@mui/material'

const CalidadInterna = () => {
  const [loteSeleccionado, setLoteSeleccionado] = useState('')
  //API
  const [lotesData, setLotesData] = useState([])
  useEffect(() => {
    const interval = async () => {
      try {
        await window.api.obtenerLotesCalidadInterna()
        const lotes = await window.api.lotesCalidadInterna()

        setLotesData(lotes)
      } catch (e) {
        alert(e)
      }
    }
    interval()
  }, [])

  //useEffect donde se obtiene la informacion de el Main
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const lotes = await window.api.lotesCalidadInterna()
        setLotesData(lotes)
      } catch (e) {
        alert(e)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])
  ///header
  const handleLoteChange = (event) => {
    console.log(event.target.value)
    setLoteSeleccionado(event.target.value)
  }

  ////calidad interna
  const initialState = {
    lote: loteSeleccionado, // Usar el lote seleccionado desde el header
    contenidoZum: {
      pesoInicial: '',
      pesoZumo: '',
      semillas: false
    },
    pruebasPlataforma: {
      muestra1: { brix: '', acidez: '' },
      muestra2: { brix: '', acidez: '' },
      muestra3: { brix: '', acidez: '' }
    },
    promedios: {
      brix: '0',
      acidez: '0',
      ratio: '0',
      peso: '0',
      zumo: '0'
    }
  }

  const [datos, setDatos] = useState(initialState)
  const [mensajeGuardado, setMensajeGuardado] = useState('')

  const calcularPorcentaje = () => {
    const pesoInicial = parseFloat(datos.contenidoZum.pesoInicial)
    const pesoZumo = parseFloat(datos.contenidoZum.pesoZumo)
    if (isNaN(pesoInicial) || isNaN(pesoZumo) || pesoInicial === 0) {
      return 'N/A'
    }
    const porcentaje = (pesoZumo / pesoInicial) * 100
    return porcentaje.toFixed(2)
  }

  const calcularPromedios = () => {
    const { pruebasPlataforma } = datos
    const muestraKeys = Object.keys(pruebasPlataforma)
    let totalBrix = 0
    let totalAcidez = 0
    let totalRatio = 0
    let totalPeso = 0
    let totalZumo = 0

    muestraKeys.forEach((muestraKey) => {
      totalBrix += parseFloat(pruebasPlataforma[muestraKey].brix) || 0
      totalAcidez += parseFloat(pruebasPlataforma[muestraKey].acidez) || 0

      const brix = parseFloat(pruebasPlataforma[muestraKey].brix) || 0
      const acidez = parseFloat(pruebasPlataforma[muestraKey].acidez) || 0
      const ratio = brix / acidez
      totalRatio += ratio

      const peso = parseFloat(datos.contenidoZum.pesoInicial) || 0
      const zumo = parseFloat(datos.contenidoZum.pesoZumo) || 0
      totalPeso += peso
      totalZumo += zumo
    })

    const promedioBrix = (totalBrix / muestraKeys.length).toFixed(2)
    const promedioAcidez = (totalAcidez / muestraKeys.length).toFixed(2)
    const promedioRatio = (totalRatio / muestraKeys.length).toFixed(2)
    const promedioPeso = (totalPeso / muestraKeys.length).toFixed(2)
    const promedioZumo = (totalZumo / muestraKeys.length).toFixed(2)

    return {
      lote: loteSeleccionado,
      brix: promedioBrix,
      acidez: promedioAcidez,
      ratio: promedioRatio,
      peso: promedioPeso,
      zumo: promedioZumo
    }
  }

  const handleGuardar = () => {
    const promedios = calcularPromedios()

    setDatos((prevDatos) => ({
      ...prevDatos,
      promedios: promedios
    }))

    console.log('Datos guardados:', datos)
    console.log('Promedios calculados:', promedios)
    window.api.guardarCalidadInterna(promedios).then((response) => console.log(response))
    console.log(lotesData)
    window.api.lotesCalidadInterna().then((response) => setLotesData(response))
    setMensajeGuardado('Los datos se han guardado correctamente')

    setTimeout(() => {
      setDatos(initialState)
      setMensajeGuardado('')
    }, 2000)
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#7D9F3A', justifyContent: 'space-between' }}>
          <select
            className="menu-lotes form-select"
            name="lotes"
            id="lotes"
            onChange={handleLoteChange}
          >
            <option value="">Lotes</option>
            {lotesData.length > 0 && lotesData.map((lote) => (
              <option key={lote.id} value={lote.id}>
                {lote.nombre}
              </option>
            ))}
          </select>
        </Toolbar>
      </AppBar>

      <div className="container">
        <div className="section">
          <h2 className="label">Contenido Zum</h2>
          <input
            className="input"
            type="number"
            onChange={(e) =>
              setDatos({
                ...datos,
                contenidoZum: { ...datos.contenidoZum, pesoInicial: e.target.value }
              })
            }
            value={datos.contenidoZum.pesoInicial}
            placeholder="Peso inicial muestra (gr)"
          />
          <input
            className="input"
            type="number"
            onChange={(e) =>
              setDatos({
                ...datos,
                contenidoZum: { ...datos.contenidoZum, pesoZumo: e.target.value }
              })
            }
            value={datos.contenidoZum.pesoZumo}
            placeholder="Peso zumo (gr)"
          />
          <div className="checkBoxContainer">
            <label htmlFor="semillas">Semillas</label>
            <input
              id="semillas"
              type="checkbox"
              checked={datos.contenidoZum.semillas}
              onChange={(e) =>
                setDatos({
                  ...datos,
                  contenidoZum: { ...datos.contenidoZum, semillas: e.target.checked }
                })
              }
            />
          </div>
          <p>Porcentaje de Llenado de Contenido Zum: {calcularPorcentaje()}%</p>
        </div>

        <div className="section">
          <h2 className="label">Pruebas de plataforma</h2>
          {[1, 2, 3].map((muestraNum) => (
            <div key={muestraNum} className="muestraContainer">
              <p>N° muestra {muestraNum}</p>
              <input
                className="input"
                type="number"
                onChange={(e) =>
                  setDatos({
                    ...datos,
                    pruebasPlataforma: {
                      ...datos.pruebasPlataforma,
                      [`muestra${muestraNum}`]: {
                        ...datos.pruebasPlataforma[`muestra${muestraNum}`],
                        brix: e.target.value
                      }
                    }
                  })
                }
                value={datos.pruebasPlataforma[`muestra${muestraNum}`].brix}
                placeholder="Brix"
              />
              <input
                className="input"
                type="number"
                onChange={(e) =>
                  setDatos({
                    ...datos,
                    pruebasPlataforma: {
                      ...datos.pruebasPlataforma,
                      [`muestra${muestraNum}`]: {
                        ...datos.pruebasPlataforma[`muestra${muestraNum}`],
                        acidez: e.target.value
                      }
                    }
                  })
                }
                value={datos.pruebasPlataforma[`muestra${muestraNum}`].acidez}
                placeholder="Acidez"
              />
            </div>
          ))}
        </div>

        {mensajeGuardado && <p>{mensajeGuardado}</p>}

        <button className="button" onClick={handleGuardar}>
          Guardar
        </button>
      </div>
    </>
  )
}

export default CalidadInterna
