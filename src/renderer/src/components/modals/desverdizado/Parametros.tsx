import { AppBar, Toolbar, Typography, TextField, Button, Snackbar, Alert } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save';
import React, { useState } from 'react'

type propsType = {
  closeModal: () => void
  propsModal: {nombre:string, canastillas:number, enf:string}
  funcOpenSuccess: (data:string) => void
}
type objType = {
  temperatura:number
  etileno:number
  carbono:number
  humedad:number
  enf:string
  action:string
}

export default function Parametros(props:propsType) {
   
    const [openError, setOpenError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [temperatura, setTemperatura] = useState<number>(0)
    const [etileno, setEtileno] = useState<number>(0)
    const [carbono, setCarbono] = useState<number>(0)
    const [humedad, setHumedad] = useState<number>(0)
  
    const guardar = async () => {
     try{
        setLoading(true)
        let request:objType = {
          temperatura: temperatura,
          etileno: etileno,
          carbono: carbono,
          humedad: humedad,
          enf: props.propsModal.enf,
          action:'setParametrosDesverdizado'
        }

        const response = await window.api.inventario(request);
        
        if(response.status === 200){
            setLoading(false)
            props.closeModal()
            props.funcOpenSuccess('Parametros guardados con exito')
        }
        else{
            setLoading(false)
            props.closeModal()
            setErrorMessage(response)
        }
     } catch(e){
        setErrorMessage(`${e.name}:${e.message}`)
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
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            width: 400,
            height: 510,
            backgroundColor: 'white',
            borderRadius: 15,
            overflow: 'hidden'
          }}
        >
          <AppBar position="static">
            <Toolbar sx={{ backgroundColor: '#7D9F3A', justifyContent: 'space-between' }}>
              <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                {props.propsModal.nombre}
              </Typography>
            </Toolbar>
          </AppBar>
        
      


          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <TextField
              id="outlined-basic"
              label="Temperatura C°"
              variant="outlined"
              type="number"
              inputProps={{ min: 0, step: 0.1 }}
              onChange={(e) => setTemperatura(Number(e.target.value))}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <TextField
              id="outlined-basic"
              label="Etileno (ppm)"
              variant="outlined"
              type="number"
              inputProps={{ min: 0, step: 0.1 }}
              onChange={(e) => setEtileno(Number(e.target.value))}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <TextField
              id="outlined-basic"
              label="Dioxido de carbono (ppm)"
              variant="outlined"
              type="number"
              inputProps={{ min: 0, step: 0.1 }}
              onChange={(e) => setCarbono(Number(e.target.value))}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <TextField
              id="outlined-basic"
              label="Humedad (%)"
              variant="outlined"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              onChange={(e) => setHumedad(Number(e.target.value))}
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
              onClick={guardar}
              startIcon={<SaveIcon />}
              variant="contained"
              sx={{  width: 120, height: 38,  marginBottom: '5rem' }}
            >
              <span>Guardar</span>
            </LoadingButton>
            <Button variant="outlined" sx={{ width: 120, height: 38 }} onClick={props.closeModal}>
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
  