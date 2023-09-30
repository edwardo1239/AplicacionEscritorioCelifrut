import LoadingButton from '@mui/lab/LoadingButton'
import { AppBar, TextField, Toolbar, Typography } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import React, { useState } from 'react'

export default function Index() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async () =>{
    try{
      setLoading(true)
      let datos = {}
      datos.user = usuario;
      datos.password = password;
      console.log(datos)
      //const response = await window.api.login(datos)
    } catch(e){
      console.log(`${e.name}:${e.message}`)
    }
  }

  return (
    <form
      onSubmit={login}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}
    >
      <div
        style={{
          overflow: 'hidden',
          padding: 0,
          height: 380,
          width: 450,
          borderRadius: 15,
          boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem' }}>
          <Typography variant="h5" component="h2">
            Acceder
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            required
            label="Usuario"
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            sx={{ m: 1, width: '75%' }}
            inputProps={{
              pattern: "[a-zA-Z0-9]+"
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            required
            label="Contraseña"
            id="contraseña"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            sx={{ m: 1, width: '75%' }}
            inputProps={{
              pattern: "[a-zA-Z0-9]+"
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            marginTop: '1.5rem'
          }}
        >
          <LoadingButton
            color="primary"
            type="submit"
            loading={loading}
            loadingPosition="start"
            startIcon={<AccountCircleIcon />}
            variant="contained"
            sx={{ width: '8rem', marginTop: '1rem', marginBottom: '1rem' }}
          >
            <span>Iniciar</span>
          </LoadingButton>
        </div>
        <div
          style={{
            width: '100%',
            height: '5rem',
            backgroundColor: '#7D9F3A',
            top: 'auto',
            bottom: 0,
            marginTop: '1rem'
          }}
        ></div>
      </div>
    </form>
  )
}
