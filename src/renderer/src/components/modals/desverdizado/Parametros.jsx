import { AppBar, Toolbar, Typography, TextField, Button, Snackbar, Alert } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save';
import React, { useState } from 'react'


export default function Parametros({ closeModal, propsModal, funcOpenSuccess }) {
   
    const [openError, setOpenError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [temperatura, setTemperatura] = useState(0)
    const [etileno, setEtileno] = useState(0)
    const [carbono, setCarbono] = useState(0)
    const [humedad, setHumedad] = useState(0)
  
    const guardar = async () => {
     try{
        setLoading(true)
        let obj = {}
        obj.temperatura = temperatura
        obj.etileno = etileno
        obj.carbono = carbono
        obj.humedad = humedad
        obj.enf = propsModal.enf

        const response = await window.api.setParametrosDesverdizado(obj);
        
        if(response === 200){
            setLoading(false)
            closeModal()
            funcOpenSuccess('Parametros guardados con exito')
        }
        else{
            setLoading(false)
            closeModal()
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
                {propsModal.nombre}
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
              onChange={(e) => setTemperatura(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <TextField
              id="outlined-basic"
              label="Etileno (ppm)"
              variant="outlined"
              type="number"
              inputProps={{ min: 0, step: 0.1 }}
              onChange={(e) => setEtileno(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <TextField
              id="outlined-basic"
              label="Dioxido de carbono (ppm)"
              variant="outlined"
              type="number"
              inputProps={{ min: 0, step: 0.1 }}
              onChange={(e) => setCarbono(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <TextField
              id="outlined-basic"
              label="Humedad (%)"
              variant="outlined"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              onChange={(e) => setHumedad(e.target.value)}
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
            <Button variant="outlined" sx={{ width: 120, height: 38 }} onClick={closeModal}>
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
  