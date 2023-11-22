import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import DescriptionIcon from '@mui/icons-material/Description';


export default function BotonLotes(props) {

  const clickInventario = (item) => {
    props.seleccion(item)
  }
  return (
    <div style={{width:235,marginTop:15}}>
      <hr />
      <p style={{marginTop:-30,marginLeft:10}}>Lotes</p>
      <List >
        <ListItem disablePadding>
          <ListItemButton sx={{gap:2}} onClick={() => clickInventario("Lotes")}>
          <DescriptionIcon/> 
              <ListItemText primary={"Lotes"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )
}