import {
  Typography,
  Grid,
  Autocomplete,
  TextField,
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Toolbar,
  AppBar,
  Alert,
  Snackbar
} from '@mui/material'
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import SaveIcon from '@mui/icons-material/Save'
import LoadingButton from '@mui/lab/LoadingButton'
import React, { useEffect, useState } from 'react'

export default function Recepcion() {
  let fecha = new Date();
  const [prediosDatos, setPrediosData] = useState([])
  const [enf, setEnf] = useState('')
  const [loading, setLoadin] = useState(false)
  const [tipoFruta, setTipoFruta] = useState('')
  const [nombrePredio, setNombrePredio] = useState('')
  const [canastillas, setCanastillas] = useState('')
  const [kilos, setKilos] = useState('')
  const [placa, setPlaca] = useState('')
  const [observaciones, setObservaciones] = useState('');
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [saveRender, setSaveRender] = useState(false)

  useEffect(() => {
    const obtenerPredios = async () => {
      let predios = []
      const prediosData = await window.api.obtenerPredios()
      //console.log(prediosData)
      predios = Object.keys(prediosData.predios)
      setPrediosData(predios)
      setEnf(prediosData.enf)
    }
    obtenerPredios()
  }, [saveRender])

  const guardarLote = async () => {
    try{
      event.preventDefault()
     setLoadin(true)
    let datos = {
      nombre: nombrePredio,
      canastillas: canastillas,
      kilos: kilos,
      placa: placa,
      tipoFruta: tipoFruta,
      observaciones: observaciones,
      enf: enf
    }
    
    datos.promedio = datos.kilos / datos.canastillas
 
    if (datos.promedio < 15) {
      setErrorMessage("Error, los kilos no corresponden a las canastillas")
      setOpenError(true)
      setLoadin(false)
      return 0;
    }
    if (datos.tipoFruta == "") {
      setErrorMessage("Seleccione el tipo de fruta del lote")
      setOpenError(true)
      setLoadin(false)
      return 0;
    }
    //console.log(datos)
    const response =  await window.api.guardarLote(datos);
    if(response == "Guardado con exito"){
      setSaveRender(!saveRender);
      setSuccessMessage(response);
      setOpenSuccess(true);
    }
    else{
      //console.log(response)
      setErrorMessage(response)
      setOpenError(true)
    }
    

    reiniciarCampos()
    setLoadin(false)
    } catch(e){
      console.log("Recepcion" + e)
      setLoadin(false);
    }
    
  }

  const reiniciarCampos = () =>{
    setNombrePredio('');
    setCanastillas('')
    setKilos('')
    setPlaca('')
    setObservaciones('')
  }
  return (
    <form onSubmit={guardarLote} >
      <Grid container spacing={2} sx={{ padding: '1rem',  overflow: 'auto' }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h4" component="h2">
            Recepcion 
          </Typography>
      
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" component="h6">
          ENF-{fecha.getFullYear().toString().slice(-2)+String(fecha.getMonth() + 1).padStart(2, "0")+enf}
          </Typography>

        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Autocomplete
            disablePortal
            inputValue={nombrePredio}
            id="nombre-predio"
            options={prediosDatos}
            sx={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="Predio" value={nombrePredio} required/>}
            onInputChange={(event, newValue) => {
              setNombrePredio(newValue)
            }}
          />
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
          required
          type='number'
          inputProps={{min:0, step:1}}
            label="Numero de canastillas"
            id="canastillas"
            value={canastillas}
            onChange={(e) => setCanastillas(e.target.value)}
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
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
          required
          type='number'
            inputProps={{min:0, step:0.1}}
            label="Kilos"
            id="kilos"
            value={kilos}
            onChange={(e) => setKilos(e.target.value)}
            sx={{ m: 1, width: '100%' }}
            InputProps={{
              startAdornment: <InputAdornment position="start">Kg</InputAdornment>
            }}
          />
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
          required
          
            label="Placa"
            id="placa"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
            sx={{ m: 1, width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalShippingRoundedIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
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
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
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
