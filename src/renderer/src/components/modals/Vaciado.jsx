
import { AppBar, Toolbar, Typography, TextField, Button, Snackbar, Alert } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox'
import React, { useState } from 'react'

export default function Vaciado({ closeVaciado, propsModal, funcOpenSuccess }) {
  const [canastillas, setCanastillas] = useState(0)
  const [openError, setOpenError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const vaciar = async () => {
    setLoading(true)
    if (parseInt(canastillas) > parseInt(propsModal.canastillas)) {
      setErrorMessage('Error en el numero de canastillas')
      setOpenError(true)
      setLoading(false)
    } else {
      let obj = { canastillas: canastillas, enf: propsModal.enf }
      const response = await window.api.vaciarLote(obj)
      console.log(response)
      if (response == 'Vaciado con exito') {
        funcOpenSuccess('Vaciado con exito')
      } else {
        setErrorMessage('Error al vaciar')
        setOpenError(true)
      }
      closeVaciado()
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
          height: 300,
          backgroundColor: 'white',
          borderRadius: 15,
          overflow: 'hidden'
        }}
      >
        <AppBar position="static">
          <Toolbar sx={{ backgroundColor: '#7D9F3A', justifyContent: 'space-between' }}>
            <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
              {propsModal.nombre}
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: 10, paddingTop: 15 }}>
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
            Numero de canastillas en inventario: {propsModal.canastillas}
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <TextField
            id="outlined-basic"
            label="Canastillas"
            variant="outlined"
            type="number"
            inputProps={{ min: 0, step: 1 }}
            onChange={(e) => setCanastillas(e.target.value)}
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
            onClick={vaciar}
            startIcon={<MoveToInboxIcon />}
            variant="contained"
            sx={{ width: '20%', marginBottom:'5rem' }}
          >
            <span>Vaciar</span>
          </LoadingButton>
          <Button variant="outlined" sx={{ width: 100, height:38 }} onClick={closeVaciado}>
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
