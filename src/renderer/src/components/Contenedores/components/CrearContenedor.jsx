import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  ToggleButton,
  AppBar,
  Toolbar,
  Alert,
  Snackbar
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save'
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded'
import PersonIcon from '@mui/icons-material/Person'
import AppsIcon from '@mui/icons-material/Apps'
import React, { useState } from 'react'

export default function CrearContenedor() {
  const [numeroContenedor, setNumeroContenedor] = useState('')
  const [cliente, setCliente] = useState('')
  const [tipoFruta, setTipoFruta] = useState('')
  const [pallets, setPallets] = useState('')
  const [desverdizado, setDesverdizado] = useState(false)
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false)

  //mensajes 
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = () => {
    setDesverdizado(!desverdizado)
  }
  const guardarDatos = async () => {
    try{
        event.preventDefault()
        setLoading(true)
        let datos = {
            cliente:cliente,
            numeroContenedor:numeroContenedor,
            pallets:pallets,
            tipoFruta:tipoFruta,
            desverdizado:desverdizado,
            observaciones:observaciones
        }

        const response = await window.api.crearContenedor(datos)

        if(response == 200){

            setSuccessMessage("Guardado con exito");
            setOpenSuccess(true);
          }
          else{
            //console.log(response)
            setErrorMessage(response)
            setOpenError(true)
          }
        
          
        reiniciarCampos()
        setLoading(false)

    } catch(e){
        console.log(`${e.name}:{${e.message}}`)
        setLoading(false)
        setErrorMessage(e)
        setOpenError(true)
    }
  }

  const reiniciarCampos = () =>{
    setCliente('')
    setNumeroContenedor('')
    setPallets('')
    setDesverdizado(false)
    setObservaciones('')
  }
  return (
    <form onSubmit={guardarDatos}>
      <Grid container spacing={2} sx={{ padding: '1rem', overflow: 'auto' }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h4" component="h2">
            Crear Contenedor
          </Typography>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'center' }}>
        <TextField
            required
            type="text"
            inputProps={{ min: 0, step: 1 }}
            label="Cliente"
            id="cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            sx={{ m: 1, width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              )
            }}
          />
         
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <TextField
            required
            type="number"
            inputProps={{ min: 0, step: 1 }}
            label="Numero de Contenedor"
            id="numeroContenedor"
            value={numeroContenedor}
            onChange={(e) => setNumeroContenedor(e.target.value)}
            sx={{ m: 1, width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NumbersRoundedIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <TextField
            required
            label="Numero de Pallets"
            id="pallets"
            value={pallets}
            onChange={(e) => setPallets(e.target.value)}
            sx={{ m: 1, width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AppsIcon />
                </InputAdornment>
              )
            }}
          />
         
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <FormControl>
            <FormLabel id="tipo_de_fruta_form">Tipo de Fruta</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={tipoFruta}
              onChange={(e) => setTipoFruta(e.target.value)}
            >
              <FormControlLabel value="Naranja" control={<Radio />} label="Naranja" />
              <FormControlLabel value="Limon" control={<Radio />} label="Limon" />
            </RadioGroup>
          </FormControl>
        </Grid>
       
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <ToggleButton
            color='warning'
            value='check'
            selected={desverdizado}
            onChange={handleChange}
            sx={{height:40}}>
                Desverdizado
            </ToggleButton>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
          required
            id="observaciones"
            label="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            multiline
            rows={4}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <LoadingButton
            color="primary"
            loading={loading}
            type="submit"
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            sx={{ width: '20%', marginBottom:'5rem' }}
          >
            <span>Save</span>
          </LoadingButton>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, backgroundColor: '#7D9F3A' }}>
          <Toolbar></Toolbar>
        </AppBar>
        </Grid>
      </Grid>

      <Snackbar open={openError} autoHideDuration={6000} onClose={() => setOpenError(false)}>
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
      <Snackbar open={openSuccess} autoHideDuration={6000} onClose={() => setOpenSuccess(false)}>
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    </form>
  )
}
