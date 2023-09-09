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
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import Index from './Index'
import Recepcion from './Recepcion'
import FrutaSinProcesar from './FrutaSinProcesar'
import Procesado from './Procesado'
import FrutaDescarte from './FrutaDescarte'
import DirectoNacional from './DirectoNacional'
import DesverdizadoInv from './DesverdizadoInv'

const drawerWidth = 240

const links = {
  index: true,
  0: false,
  1: false,
  2: false,
  3: false,
  4: false,
  5: false
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
        //historial vaciado donde se puede modificar
        nuevo = cambiarLink(3)
        setState(nuevo)
        break
      case 4:
        //historial directo nacional
        nuevo = cambiarLink(4)
        setState(nuevo)
        break
      case 5:
        //historial directo nacional
        nuevo = cambiarLink(5)
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
            {['Recepcion', 'Fruta sin procesar', 'Fruta Procesada', 'Fruta Descarte', 'Directo Nacional', 'Desverdizando'].map((text, index) => (
              <ListItem key={text + index} disablePadding>
                <ListItemButton onClick={() => navBar(index)}>
                  <ListItemIcon>
                    {index == 0 && <LocalShippingIcon />}
                    {index == 1 && <InventoryIcon />}
                    {index == 2 && <MoveToInboxIcon />}
                    {index == 3 && <FlagIcon />}
                    {index == 4 && <SwapHorizIcon />}
                    {index == 5 && <AccessTimeIcon />}
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
        {links[4] && <DirectoNacional />}
        {links[5] && <DesverdizadoInv />}
      </Box>
    </Box>
  )
}
