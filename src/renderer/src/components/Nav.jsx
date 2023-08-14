import React, { useState } from 'react'
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  ListItemText,
  CssBaseline,
  Divider
} from '@mui/material'
import logo from '../assets/CELIFRUT.png'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import InventoryIcon from '@mui/icons-material/Inventory'
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox'
import FlagIcon from '@mui/icons-material/Flag';

import Index from './Index'
import Recepcion from './Recepcion'
import FrutaSinProcesar from './FrutaSinProcesar'
import Procesado from './Procesado'
import FrutaDescarte from './FrutaDescarte'

const drawerWidth = 240

const links = {
  index: true,
  0: false,
  1: false,
  2: false,
  3: false,
}

export default function Nav() {
  // const rutas = ["Recepcion", "FrutaSinProcesar"];
  const [state, setState] = useState(links)

  const navBar = (action) => {
    let nuevo
    switch (action) {
      case 'index':
        nuevo = cambiarLink('index')
        setState(nuevo)
        break
      case 0:
        //recepcion
        cambiarLink(0)
        nuevo = cambiarLink(0)
        setState(nuevo)
        break
      case 1:
        //fruta sin procesar en el inventario
        nuevo = cambiarLink(1)
        setState(nuevo)
        break
      case 2:
        //fruta sin procesar en el inventario
        nuevo = cambiarLink(2)
        setState(nuevo)
        break
      case 3:
        //fruta sin procesar en el inventario
        nuevo = cambiarLink(3)
        setState(nuevo)
        break
      default:
        nuevo = cambiarLink('index')
        setState(nuevo)
        break
    }
  }

  const cambiarLink = (key) => {
    
    let objetoNuevo = Object.keys(links).map((item) => {
      if (item == key) {
        links[item] = true
      } else links[item] = false
    })
    return objetoNuevo
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'white' }}
      >
        <Toolbar>
          <img src={logo} width={50} onClick={() => navBar('index')} />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Recepcion', 'Fruta sin procesar', 'Fruta Procesada', 'Fruta Descarte'].map((text, index) => (
              <ListItem key={text + index} disablePadding>
                <ListItemButton onClick={() => navBar(index)}>
                  <ListItemIcon>
                    {index == 0 && <LocalShippingIcon />}
                    {index == 1 && <InventoryIcon />}
                    {index == 2 && <MoveToInboxIcon />}
                    {index == 3 && <FlagIcon />}
                  </ListItemIcon>

                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />

        {links['index'] && <Index />}
        {links[0] && <Recepcion />}
        {links[1] && <FrutaSinProcesar />}
        {links[2] && <Procesado />}
        {links[3] && <FrutaDescarte />}
      </Box>
    </Box>
  )
}
