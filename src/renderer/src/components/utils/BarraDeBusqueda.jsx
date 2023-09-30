import {
  AppBar,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Popover,
  ListItemIcon,
  Toolbar,
  Typography,
  ListItemText
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import React from 'react'

import InventoryIcon from '@mui/icons-material/Inventory'
import RestoreIcon from '@mui/icons-material/Restore'

export default function BarraDeBusqueda({ changeFilter, opcionesMenu, seleccion, state }) {
  //funciones para el popover
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined


  return (
    <AppBar position="static">
      <Toolbar sx={{ backgroundColor: '#7D9F3A', justifyContent: 'space-between' }}>
        <IconButton
          onClick={handleClick}
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          aria-describedby="menu"
        >
          <MenuIcon />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <List>
            {opcionesMenu.map((text, index) => (
              <ListItem key={text + index} disablePadding>
                <ListItemIcon>
                  <ListItemButton sx={{ gap: 2 }} onClick={() => seleccion(text)}>
                    <RestoreIcon />
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItemIcon>
              </ListItem>
            ))}
          </List>
        </Popover>

        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          {state}
        </Typography>
        <div>
          <SearchIcon sx={{ marginRight: -5, marginBottom: -1 }} />
          <input
            type="text"
            onChange={(e) => changeFilter(e.target.value)}
            style={{
              backgroundColor: 'rgb(255,255,255,0.20)',
              border: 'none',
              borderRadius: 5,
              width: 500,
              height: '2rem',
              color: 'white',
              fontSize: 18,
              paddingLeft: 50
            }}
          />
        </div>
      </Toolbar>
    </AppBar>
  )
}
