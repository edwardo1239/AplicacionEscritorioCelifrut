import { AppBar, Toolbar, Typography, TextField, Button, Snackbar, Alert } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import React, { useState } from 'react'
import Api from '../../../../../preload/types'

type propsType = {
  closeDesverdizado: () => void
  propsModal: { nombre: string; canastillas: number; enf: string }
  funcOpenSuccess: (message: string) => void
}

export default function Desverdizado(props: propsType) {
  const [canastillas, setCanastillas] = useState<number>(0)
  const [cuartoDesverdizado, setCuartoDesverdizado] = useState<string>('')
  const [openError, setOpenError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const desverdizado = async () => {
    try {
      console.log('response')
      setLoading(true)
      if (canastillas > props.propsModal.canastillas) {
        funcOpenError(true, 'Error en el numero de canastillas')
        setLoading(false)
      } else {
        
        const obj = {
          canastillas: canastillas,
          enf: props.propsModal.enf,
          action: 'desverdizado',
          cuartoDesverdizado: cuartoDesverdizado
        }
        const response = await window.api.inventario(obj)
        console.log(response)
        if (response.status === 200) {
          props.funcOpenSuccess('Lote se ha puesto a desverdizar')
          props.closeDesverdizado()
        } else if (response.status === 400) {
          funcOpenError(true, response.data)
        }
      }
    } catch (error) {
      alert('error')
    }
  }

  const funcOpenError = (open: boolean, message: string): void => {
    setErrorMessage(message)
    setOpenError(open)
  }

  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100vh',
        top: 0,
        left: 0,
        background: ' rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          width: 450,
          height: 400,
          backgroundColor: 'white',
          borderRadius: 15,
          overflow: 'hidden'
        }}
      >
        <AppBar position="static">
          <Toolbar sx={{ backgroundColor: 'orange', justifyContent: 'space-between' }}>
            <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
              {props.propsModal.nombre}
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: 10, paddingTop: 15 }}>
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
            Numero de canastillas en inventario: {props.propsModal.canastillas}
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <TextField
            id="outlined-basic"
            label="Canastillas"
            variant="outlined"
            type="number"
            inputProps={{ min: 0, step: 1 }}
            onChange={(e) => setCanastillas(Number(e.target.value))}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <TextField
            id="outlined-basic"
            label="Cuarto Desverdizado"
            variant="outlined"
            type="text"
            onChange={(e) => setCuartoDesverdizado(e.target.value)}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'center',
            marginTop: '2rem'
          }}
        >
          <LoadingButton
            key={'desverdizarButtonAceptar'}
            color="primary"
            loading={loading}
            loadingPosition="start"
            onClick={desverdizado}
            startIcon={<ColorLensIcon />}
            variant="contained"
            sx={{ width: '20%', marginBottom: '5rem' }}
          >
            <span>Enviar</span>
          </LoadingButton>
          <Button
            variant="outlined"
            sx={{ width: 100, height: 38 }}
            onClick={props.closeDesverdizado}
          >
            Cancelar
          </Button>
        </div>
      </div>
      <Snackbar
        key={'desverdizado error'}
        open={openError}
        autoHideDuration={6000}
        onClose={() => setOpenError(false)}
        sx={{ marginLeft: '50%' }}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
    </div>
  )
}
