import { AppBar, Toolbar, Typography, TextField, Button, Snackbar, Alert } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import React, { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'

type propsType = {
  closeModal: () => void
  propsModal: {nombre:string, canastillas:number, enf:string}
  funcOpenSuccess: (data:string) => void
}

export default function FinalizarDesverdizado(props:propsType) {
  const [openError, setOpenError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const finalizar = async () => {
    setLoading(true)

    const request = {action:'finalizarDesverdizado', enf:props.propsModal.enf}
    const response = await window.api.inventario(request)
   
   
    if (response.status == 200) {
      props.funcOpenSuccess("Lote desverdizado finalizado")
      props.closeModal()
    } else {
      setErrorMessage(response)
      setOpenError(true)
      props.closeModal()
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
          height: 200,
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
            Esta seguro que desea finalizar el desverdizado
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
            onClick={finalizar}
            startIcon={<CheckIcon />}
            variant="contained"
            sx={{ width: 110, height: 38, marginBottom: '5rem' }}
          >
            <span>Aceptar</span>
          </LoadingButton>
          <Button variant="outlined" sx={{ width: 110, height: 38 }} onClick={props.closeModal}>
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
