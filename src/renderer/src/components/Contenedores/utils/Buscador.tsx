import React, { useState, useEffect } from 'react'
import { AppBar, Button, MenuItem, Select, Toolbar } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select';
import { ContenedoresObj } from '../types';
import ObtenerPrediosContenedor from '../functions/ObtenerPrediosContenedor';

type propsType = {
  filtroPrincipal: (value: string, value2:string) => void
  contenedor: ContenedoresObj
}

export default function Buscador(props: propsType) {
  const [value1, setValue1] = useState<string>('')
  const [value2, setValue2] = useState<string>('')
  const [predios, setPredios] = useState<string[]>([])

  const handleChange1 = () => {
    const filtro = value1
    props.filtroPrincipal(filtro, value2)

  }

  useEffect(() => {
   const response:string[] = ObtenerPrediosContenedor(props.contenedor)
   setPredios(response)
  }, [value1])
  

  return (
    <AppBar position="static">
      <Toolbar sx={{ backgroundColor: 'white', gap:'2rem' }}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          sx={{ height: '2rem', backgroundColor: 'white' }}
          onChange={(event: SelectChangeEvent) =>setValue1(event.target.value as string)}
          value={value1}
          label="Filtro"
        >
          <MenuItem value={'pallet'}>{props.contenedor && props.contenedor.infoContenedor?.tipoEmpaque === 'Caja' ? 'Pallets' : 'Estibas'}</MenuItem>
          <MenuItem value={'predio'}>Predios</MenuItem>
          <MenuItem value={''}>None</MenuItem>

        </Select>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          sx={{ height: '2rem', backgroundColor: 'white' }}
          label="Filtro"
          onChange={(event: SelectChangeEvent) =>setValue2(event.target.value as string)}
          value={value2}
        >
            <MenuItem value={''}>All</MenuItem>
          {props.contenedor && value1 === 'pallet' ? 
          Object.keys(props.contenedor).map(pallet => {
            if(pallet !== 'infoContenedor'){
                return (
                    <MenuItem key={pallet} value={pallet}>{pallet}</MenuItem>
                )
            }
          }) : null}
          {props.contenedor && value1 === 'predio' ? 
          predios.map(enf =>(
            <MenuItem key={enf} value={enf}>{enf}</MenuItem>
          )) : null}
      
        </Select>
        <Button variant="contained" onClick={handleChange1}>Filtrar</Button>
      </Toolbar>
    </AppBar>
  )
}
