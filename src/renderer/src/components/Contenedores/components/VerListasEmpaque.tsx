import { AppBar, FormControl, InputLabel, MenuItem, Select, Toolbar } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select';
import React, { useEffect, useState } from 'react'
import Api from '../../../../../preload/types'
import { ContenedoresObj } from '../types';
import TableListaEmpaque from '../tables/TableListaEmpaque';



export default function VerListasEmpaque() {
    const [contenedores, setContenedores] = useState<ContenedoresObj>({});
    const [contenedorSelect, setContenedorSelect] = useState<string>('')

    useEffect(() => {
      const obtenerDatos = async () =>{
        try{
          const request = { action: 'obtenerListaEmpaque' }
          const response = await window.api.contenedores(request);
          setContenedores(response.data);
        }catch(e){
          console.log(e)
        }
      }
      obtenerDatos();

      window.api.listaEmpaqueInfo('listaEmpaqueInfo', (response:any) =>{
        setContenedores(response.listaEmpaque)} )
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
                  <MenuItem value={contenedor}>{contenedor + "-" + contenedores[contenedor].infoContenedor.nombreCliente}</MenuItem>
              )
              ))}
            </Select>
          </FormControl>
          
        </Toolbar>
      </AppBar>
      <TableListaEmpaque contenedor={contenedores[contenedorSelect]}/>
    </div>
  )
}
