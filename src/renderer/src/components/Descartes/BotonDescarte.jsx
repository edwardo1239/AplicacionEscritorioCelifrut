import React from 'react'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function (props) {

    const clickIngresoFruta = () =>{
        props.seleccion("Descartes")
    }
   
  return (
    <div style={{width:235}}>

      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{gap:2}} onClick={clickIngresoFruta}>
          <AccountCircleIcon />
            <ListItemText primary={'Descartes'} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )
}