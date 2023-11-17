import React from 'react'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

type propsType = {
    seleccion: (nombre:string) => void
}

export default function BotonProveedores(props:propsType) {
  
    const clickInventario = (item:string) => {
        props.seleccion(item)
      }
      return (
        <div style={{width:235,marginTop:15}}>
          <hr />
          <p style={{marginTop:-30,marginLeft:10}}>Proveedores</p>
          <List >
            <ListItem disablePadding>
              <ListItemButton sx={{gap:2}} onClick={() => clickInventario("Proveedores")}>
                  <LocalShippingIcon />
                  <ListItemText primary={"Proveedores"} />
              </ListItemButton>
            </ListItem>
          </List>
        </div>
  )
}
