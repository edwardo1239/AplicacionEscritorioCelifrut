import { AppBar, Toolbar, Typography, TextField, Button, Snackbar, Alert } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import React, { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'

export default function ReprocesoDescarte({
  closeModal,
  propsModal,
  funcOpenSuccess,
  messageModal
}) {
  const [openError, setOpenError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const reprocesar = async () => {
    setLoading(true)
    try {
      let response

      if (messageModal === '¿Desea reprocesar el descarte del predio seleccionado?') {
        const request = { action: 'reprocesarDescarteUnPredio', data: propsModal }
        response = await window.api.inventario(request)
      } else if (
        messageModal === '¿Desea reprocesar los descartes unificados en forma de Celifrut?'
      ) {
        const request = { action: 'ReprocesarDescarteCelifrut', data: propsModal }
        response = await window.api.inventario(request)
      }
      await window.api.obtenerDescarte()

      if (response.status === 200) {
        funcOpenSuccess('Reproceso con exito')
        closeModal()
      } else {
        setErrorMessage(response)
        setOpenError(true)
        closeModal()
      }
    } catch (e) {
      console.log(`${e.name}:${e.message}`)
      setLoading(false)
      closeModal()
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
        <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: 10, paddingTop: 15 }}>
          <Typography
            sx={{ flex: '1 1 100%', justifyContent: 'center', textAlign: 'center' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {messageModal}
          </Typography>
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
            onClick={reprocesar}
            startIcon={<CheckIcon />}
            variant="contained"
            sx={{ width: 110, height: 38, marginBottom: '5rem' }}
          >
            <span>Aceptar</span>
          </LoadingButton>
          <Button variant="outlined" sx={{ width: 110, height: 38 }} onClick={closeModal}>
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
