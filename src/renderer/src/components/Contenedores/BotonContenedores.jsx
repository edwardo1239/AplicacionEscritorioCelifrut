import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'

import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';


export default function BotonContenedores(props) {

  const clickInventario = (item) => {
    props.seleccion(item)
  }
  return (
    <div style={{width:235,marginTop:15}}>
      <hr />
      <p style={{marginTop:-30,marginLeft:10}}>Contenedores</p>
      <List >
        <ListItem disablePadding>
          <ListItemButton sx={{gap:2}} onClick={() => clickInventario("Crear Contenedor")}>
              <DirectionsBoatIcon />
              <ListItemText primary={"Crear Contenedor"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )
}
