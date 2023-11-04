import { AppBar, Toolbar } from '@mui/material'
import './Header.css'
import React, { useEffect, useState } from 'react'
import ClasificacionCalidadNaranja from './ClasificacionCalidadNaranja'
import ClasificacionCalidadLimon from './ClasificacionCalidadLimon'

export default function ClasificacionCalidad() {
    const [tipoFruta, setTIpoFruta] = useState('Naranja')
    const [id, setId] = useState('')
  //API
  const [lotesData, setLotesData] = useState([])

  useEffect(() => {
    const interval = async () => {
      try {
        const request = { action: 'obtenerLotesClasificacionCalidad' }
        const lotes = await window.api.calidad(request)
        setLotesData(lotes.data)
      } catch (e) {
        alert(e)
      }
    }
    interval()
  }, [])



  const handleLoteChange = (event) => {
    setTIpoFruta(event.target.value)
    const selectedIndex = event.target.options.selectedIndex;
    const key = event.target.options[selectedIndex].getAttribute('data-key');
    setId(key)
    const selectedValue = event.target.value
    console.log(key)
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#7D9F3A', justifyContent: 'space-between' }}>
          <select
            className="menu-lotes form-select"
            name="lotes"
            id="lotes"
            onChange={handleLoteChange}
          >
            <option value="">
              Lotes
            </option>
            {lotesData.length > 0 && lotesData.map((lote) => (
              <option key={lote.id} value={lote.tipoFruta} data-key={lote.id}>
              {lote.id + " " + " " + lote.nombre}
              </option>
            ))}
          </select>
        </Toolbar>
      
      </AppBar>

      {tipoFruta === 'Naranja' ? <ClasificacionCalidadNaranja loteSeleccionado={id}/> : <ClasificacionCalidadLimon loteSeleccionado={id}/>}
    </div>
  )
}
