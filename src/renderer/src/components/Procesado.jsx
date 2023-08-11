//app donde se muestra los datos de vaciado y donde se pueden modificar
import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import React, { useState } from 'react'
import TablaHistorialVaciado from './tables/TablaHistorialVaciado'


export default function Procesado() {
  //boton del menu naranja limon
  const [anchorEl, setAnchorEl] = useState(false)
  const open = Boolean(anchorEl)
  const handleClick = () => {
    setAnchorEl(!anchorEl)
  }
  const handleClose = () => {
    setAnchorEl(false)
  }

  //buscador
  const [filtro, setFiltro] = useState('')

  const changeFilter = (e) => setFiltro(e.target.value)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#7D9F3A', justifyContent: 'space-between' }}>
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            open={anchorEl}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
            sx={{ marginLeft: 30, top: -470, display: 'sticky' }}
          >
            <MenuItem onClick={() => handleClose()}>Naranja</MenuItem>
            <MenuItem onClick={() => handleClose()}>Limon</MenuItem>
          </Menu>
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
            Fruta Procesada
        </Typography>
          <div >
          <SearchIcon sx={{marginRight:-5, marginBottom:-1}}/>
            <input
              type="text"
              onChange={changeFilter}
              value={filtro}
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

      <TablaHistorialVaciado filtro={filtro} />
    </Box>
  )
}
