import React from 'react'
import { VscAccount } from "react-icons/vsc";
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'

export default function (props) {

    const clickIngresoFruta = () =>{
        props.seleccion("Crear cuenta")
    }
   
  return (
    <div style={{width:235}}>

      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{gap:2}} onClick={clickIngresoFruta}>
          <VscAccount />
            <ListItemText primary={'Crear cuenta'} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )
}