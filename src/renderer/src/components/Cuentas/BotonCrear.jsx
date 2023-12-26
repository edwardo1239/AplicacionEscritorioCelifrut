import React from 'react'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function (props) {

    const clickIngresoFruta = () =>{
        props.seleccion("Crear cuenta")
    }
   
  return (
    <div style={{width:235}}>

      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{gap:2}} onClick={clickIngresoFruta}>
          <AccountCircleIcon />
            <ListItemText primary={'Crear cuenta'} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )
}