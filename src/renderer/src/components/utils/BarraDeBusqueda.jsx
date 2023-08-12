
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import React from 'react'



export default function BarraDeBusqueda({changeFilter, filtro, title}) {
    

  return (

    <AppBar position="static">
      <Toolbar sx={{ backgroundColor: '#7D9F3A', justifyContent: 'space-between' }}>
        <IconButton
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}

        >
          <MenuIcon />
        </IconButton>
  
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          {title}
      </Typography>
        <div >
        <SearchIcon sx={{marginRight:-5, marginBottom:-1}}/>
          <input
            type="text"
            onChange={(e) => changeFilter(e.target.value)}
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


)
}
