import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import React from 'react'

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';


export default function BotonProveedores(props) {

  const clickInventario = (item) => {
    props.seleccion(item)
  }
  return (
    <div style={{width:235,marginTop:15}}>
      <hr />
      <p style={{marginTop:-30,marginLeft:10}}>Proveedores</p>
      <List >
        <ListItem disablePadding>
          <ListItemButton sx={{gap:2}} onClick={() => clickInventario("Proveedor")}>
          <AssignmentIndIcon/> 
              <ListItemText primary={"Proveedor"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )
}