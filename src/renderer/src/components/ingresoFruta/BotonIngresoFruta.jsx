import React from 'react'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'

export default function (props) {

    const clickIngresoFruta = () =>{
        props.seleccion("Ingreso de fruta")
    }
   
  return (
    <div style={{width:235}}>

      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{gap:2}} onClick={clickIngresoFruta}>
            <LocalShippingIcon />
            <ListItemText primary={'Ingreso de fruta'} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )
}
