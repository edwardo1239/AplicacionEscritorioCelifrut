import { AppBar, Toolbar, TextField, Button, Snackbar, Alert } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import React, { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'

type propsType = {
  closeModalEnviar: () => void
  propsModal: propsModalType
  funcOpenSuccess: () => void
  messageModal: string
}

type propsModalType = {
  [key: string] : string
}

export default function EnvioDescarte(props:propsType) {
  const [openError, setOpenError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [cliente, setCliente] = useState<string>('')

  const clickEliminarFrutaDescarte = async () => {
    try {
   
      let datos = [props.propsModal, cliente]
      const request = {action:'eliminarFrutaDescarte', data:datos}
      const response = await window.api.inventario(request)
     
      if (response === 200) {
        props.closeModalEnviar()
      } else {
        
        props.closeModalEnviar()
      }
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
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
          height: 250,
          backgroundColor: 'white',
          borderRadius: 15,
          overflow: 'hidden'
        }}
      >
        <AppBar position="static">
          <Toolbar sx={{ backgroundColor: '#7D9F3A', justifyContent: 'space-between' }}></Toolbar>
        </AppBar>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <TextField
            id="outlined-basic"
            label="Cliente"
            variant="outlined"
            type="text"
            onChange={(e) => setCliente(e.target.value)}
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
            color="primary"
            loading={loading}
            loadingPosition="start"
            onClick={clickEliminarFrutaDescarte}
            startIcon={<CheckIcon />}
            variant="contained"
            sx={{ width: 110, height: 38, marginBottom: '5rem' }}
          >
            <span>Aceptar</span>
          </LoadingButton>
          <Button variant="outlined" sx={{ width: 110, height: 38 }} onClick={props.closeModalEnviar}>
            Cancelar
          </Button>
        </div>
      </div>
      <Snackbar
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
