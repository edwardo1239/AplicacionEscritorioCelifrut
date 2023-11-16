import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'

import ListAltIcon from '@mui/icons-material/ListAlt';


export default function ListaBotonesFormularios(props) {

  const clickFormularios = (item) => {
    props.seleccion(item)
  }
  return (
    <div style={{width:235,marginTop:15}}>
      <hr />
      <p style={{marginTop:-30,marginLeft:10}}>Inventario</p>
      <List >
        <ListItem disablePadding>
          <ListItemButton sx={{gap:2}} onClick={() => clickFormularios("Formularios")}>
                <ListAltIcon />
              <ListItemText primary={"Formularios"} />
          </ListItemButton>
        </ListItem>

      </List>
    </div>
  )
}