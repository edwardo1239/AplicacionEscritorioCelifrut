import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'

import InventoryIcon from '@mui/icons-material/Inventory'


export default function ListaBotonesInventario(props) {

  const clickInventario = (item) => {
    props.seleccion(item)
  }
  return (
    <div style={{width:235,marginTop:15}}>
      <hr />
      <p style={{marginTop:-30,marginLeft:10}}>Inventario</p>
      <List >
        <ListItem disablePadding>
          <ListItemButton sx={{gap:2}} onClick={() => clickInventario("Fruta sin procesar")}>
              <InventoryIcon />
              <ListItemText primary={"Fruta sin procesar"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{gap:2}} onClick={() => clickInventario("Descarte")}>
              <InventoryIcon />
              <ListItemText primary={"Descarte"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{gap:2}} onClick={() => clickInventario("Desverdizado")}>
              <InventoryIcon />
              <ListItemText primary={"Desverdizado"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )
}
