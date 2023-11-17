
import { AppBar, Toolbar, Typography, TextField, Button, Snackbar, Alert, InputLabel } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import RestoreIcon from '@mui/icons-material/Restore'
import React, { useState } from 'react'
import Api from '../../../../preload/types'

type propsType = {
  closeModal: () => void
  propsModal: { nombre: string, canastillas: number, enf:string, id:number}
  funcOpenSuccess: (message:string) => void
}
export default function ModificarDirectoNacional(props:propsType) {
    const [canastillas, setCanastillas] = useState<number>(0)
    const [openError, setOpenError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
  
    const modificarHistorial = async () => {
      try {
        setLoading(true)
        const canastillasInt = canastillas;
        const propsCanastillasInt = props.propsModal.canastillas;
  
        if (canastillasInt > propsCanastillasInt) {
          funcOpenError(true, 'Error en el numero de canastillas');
        } else {
          const obj = { canastillas:canastillas, enf:props.propsModal.enf, action:'modificarHistorialDirectoNacional', id:props.propsModal.id }
          const response = await window.api.inventario(obj);
          if (response.status === 200) {
            props.funcOpenSuccess('Modificado con exito');
            props.closeModal();
          } else {
            funcOpenError(true, response);
          }
        }
      } catch (e) {
        funcOpenError(true, `${e.name}:${e.message}`);
      }
      finally{
        setLoading(false);
      }
    }

    const funcOpenError = (open:boolean, message:string):void => {
      setErrorMessage(message)
      setOpenError(open)
    };
  
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
            width: 550,
            height: 350,
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
          <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: 10, paddingTop: 15 }}>
            <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
              Numero de canastillas: {props.propsModal.canastillas}
            </Typography>
          </div>
     
          <div style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', marginTop: '2rem', marginLeft:'1rem', marginRight:'1rem' }}>
            <InputLabel htmlFor="component-helper"> Ingrese las canastillas que desea devolver a la fruta no procesada</InputLabel>
            <TextField
              id="outlined-basic"
              label="Canastillas"
              variant="outlined"
              type="number"
              inputProps={{ min: 0, step: 1 }}
              onChange={(e) => setCanastillas(Number(e.target.value))}
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
              onClick={modificarHistorial}
               startIcon={<RestoreIcon />}
              variant="contained"
              sx={{ width: '20%', marginBottom: '5rem' }}
            >
              <span>Enviar</span>
            </LoadingButton>
            <Button variant="outlined" sx={{ width: 100, height: 38 }} onClick={props.closeModal}>
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
  