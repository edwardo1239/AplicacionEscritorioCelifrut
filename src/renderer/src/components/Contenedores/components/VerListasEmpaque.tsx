import { AppBar, FormControl, InputLabel, MenuItem, Select, Toolbar } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select';
import React, { useEffect, useState } from 'react'
import Api from '../../../../../preload/types'
import { contenedoresObj } from '../types';


export default function VerListasEmpaque() {
    const [contenedores, setContenedores] = useState<contenedoresObj>();
    const [contenedorSelect, setContenedorSelect] = useState<string>('')

    useEffect(() => {
      const obtenerDatos = async () =>{
        try{
          const response = await window.api.obtenerContenedoresListaEmpaque();
          setContenedores(response);
          console.log(response)
        }catch(e){
          console.log(e)
        }
      }
      obtenerDatos();
    },[]);

    const handleChange = (event: SelectChangeEvent) => {
      setContenedorSelect(event.target.value as string);
    }
  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#7D9F3A', justifyContent: 'space-between' }}>
          <FormControl sx={{width:'20rem'}}>
            <InputLabel id="demo-simple-select-label">Contenedor</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={contenedorSelect}
              label="Contenedor"
              onChange={handleChange}
              sx={{height:'3rem',backgroundColor:'white'}}
            >
              {contenedores &&
              Object.keys(contenedores).map((contenedor => (
                  <MenuItem value={10}>{contenedor + "-" + contenedores[contenedor].infoContenedor.nombreCliente}</MenuItem>
              )
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
    </div>
  )
}
