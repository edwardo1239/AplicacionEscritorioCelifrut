import LoadingButton from '@mui/lab/LoadingButton'
import { InputAdornment, TextField, Typography } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import React, { useState, useEffect } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import Api from '../../../preload/types'

type indexType = {
  permisosSesion: (permisos: string[]) => void
}

type datosLogInType = {
  user: string
  password: string
}

type loginResponseType = {
  status: number
  user: string
  permisos: string[]
}

let prueba = "esta es una prueba de git"
export default function Index(props: indexType) {
  const [usuario, setUsuario] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(true)
  const [errorUser, setErrorUser] = useState<boolean>(false)
  const [errorClave, setErrorClave] = useState<boolean>(false)
  const [isLogged, setIsLogged] = useState<boolean>(false)

  const login: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      let datosLogIn: datosLogInType = {
        user: usuario,
        password: password
      }
      window.api.logIn(datosLogIn).then( (response) =>{
        console.log(response)
        if (response.status === 200) {
          props.permisosSesion(response.permisos)
          setIsLogged(true)
          setErrorUser(false)
          setErrorClave(false)
        } else if (response.status === 401) {
          setErrorUser(true)
          setIsLogged(false)
        } else if (response.status === 402) {
          setErrorClave(true)
          setIsLogged(false)
        } else {
          setErrorUser(false)
          setErrorClave(false)
          alert('Error al intentar inciar sesion')
        }
      })
    } catch (e) {
      console.log(`${e.name}:${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const showPassword = () => {
    setVisible(!visible)
  }

  const inputClave = (e) => {
    setPassword(e)
    if (password == '') {
      setErrorClave(false)
    }
  }

  const inputUsuario = (e) => {
    setUsuario(e)
    if (usuario == '') {
      setErrorUser(false)
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
        {isLogged ? (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '1.5rem',
                height: 275,
                paddingTop: 100
              }}
            >
              <h2 className='4xl'>
                Bienvenido
              </h2>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem' }}>
              <Typography variant="h5" component="h2">
                Acceder
              </Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                required
                error={errorUser}
                label={errorUser ? 'Error en el usuario' : 'Usuario'}
                id="usuario"
                value={usuario}
                onChange={(e) => inputUsuario(e.target.value)}
                sx={{ m: 1, width: '75%' }}
                inputProps={{
                  pattern: '[a-zA-Z0-9 ]+'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                required
                error={errorClave}
                label={errorClave ? 'Error en la clave' : 'Clave'}
                id="contraseña"
                type={visible ? 'password' : 'text'}
                onChange={(e) => inputClave(e.target.value)}
                sx={{ m: 1, width: '75%' }}
                inputProps={{
                  pattern: '[a-zA-Z0-9]+'
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                      <RemoveRedEyeIcon
                        aria-label="toggle password visibility"
                        onClick={showPassword}
                      />
                    </InputAdornment>
                  )
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
          </>
        )}
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
