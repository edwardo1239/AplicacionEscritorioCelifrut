import React from 'react'
import ListAltIcon from '@mui/icons-material/ListAlt'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'

type propsType = {
  seleccion: (nombre: string) => void
}

export default function BotonesCalidad(props: propsType) {
  const clickInventario = (item: string) => {
    props.seleccion(item)
  }
  return (
    <div style={{ width: 235, marginTop: 15 }}>
      <hr />
      <p style={{ marginTop: -30, marginLeft: 10 }}>Calidad</p>
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ gap: 2 }} onClick={() => clickInventario('Calidad interna')}>
            <ListAltIcon />
            <ListItemText primary={'Calidad Interna'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ gap: 2 }} onClick={() => clickInventario('Clasificacion calidad')}>
            <ListAltIcon />
            <ListItemText primary={'Clasificacion calidad'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ gap: 2 }} onClick={() => clickInventario('Formatos')}>
            <ListAltIcon />
            <ListItemText primary={'Formatos'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ gap: 2 }} onClick={() => clickInventario('Volante Calidad')}>
            <ListAltIcon />
            <ListItemText primary={'Volante Calidad'} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )
}
