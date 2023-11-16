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
  Snackbar,
  Autocomplete
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save'
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded'
import AppsIcon from '@mui/icons-material/Apps'
import React, { useEffect, useState } from 'react'
import Api from '../../../../../preload/types'

export default function CrearContenedor() {
  const [numeroContenedor, setNumeroContenedor] = useState<string>('')
  const [cliente, setCliente] = useState<string>('')
  const [tipoFruta, setTipoFruta] = useState<string>('')
  const [tipoEmpaque, setTipoEmpaque] = useState<string>('')
  const [pallets, setPallets] = useState<string>('')
  const [desverdizado, setDesverdizado] = useState<boolean>(false)
  const [observaciones, setObservaciones] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [clientesDatos, setClientesDatos] = useState<string[]>([])

  //mensajes
  const [openError, setOpenError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [openSuccess, setOpenSuccess] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string>('')

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const request = { action: 'obtenerClientes' }
        const response = await window.api.contenedores(request)
        const nombreClientes: string[] = Object.keys(response.data)
        setClientesDatos(nombreClientes)
        console.log(response)
      } catch (e) {
        alert(`Crear contenedor ${e.name}: ${e.message}`)
      }
    }
    obtenerDatos()
  }, [])

  const handleChange = () => {
    setDesverdizado(!desverdizado)
  }
  const guardarDatos: React.FormEventHandler<HTMLFormElement> = async (event) => {
    try {
      event.preventDefault()
      setLoading(true)
      let datos = {
        cliente: cliente,
        numeroContenedor: numeroContenedor,
        pallets: pallets,
        tipoFruta: tipoFruta,
        desverdizado: desverdizado,
        observaciones: observaciones,
        tipoEmpaque: tipoEmpaque
      }

      const request = { action: 'crearContenedor', data:datos }
      const response = await window.api.contenedores(request)
      if (response.status == 200) {
        setSuccessMessage('Guardado con exito')
        setOpenSuccess(true)
      } else {
        //console.log(response)
        setErrorMessage(response)
        setOpenError(true)
      }

      reiniciarCampos()
      setLoading(false)
    } catch (e) {
      console.log(`${e.name}:{${e.message}}`)
      setLoading(false)
      setErrorMessage(e)
      setOpenError(true)
    }
  }

  const reiniciarCampos = () => {
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
          <Autocomplete
            disablePortal
            inputValue={cliente}
            id="nombre-predio"
            options={clientesDatos}
            sx={{ width: '100%' }}
            renderInput={(params) => (
              <TextField {...params} label="Cliente" value={clientesDatos} required />
            )}
            onInputChange={(event, newValue) => {
              setCliente(newValue)
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
              <FormControlLabel value="Mixto" control={<Radio />} label="Mixto" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <FormControl>
            <FormLabel id="tipo_de_empaque_form">Tipo empaque</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={tipoEmpaque}
              onChange={(e) => setTipoEmpaque(e.target.value)}
            >
              <FormControlLabel value="Caja" control={<Radio />} label="Caja" />
              <FormControlLabel value="Saco" control={<Radio />} label="Saco" />
            </RadioGroup>
          </FormControl>
        </Grid>


        

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <ToggleButton
            color="warning"
            value="check"
            selected={desverdizado}
            onChange={handleChange}
            sx={{ height: 40 }}
          >
            Desverdizado
          </ToggleButton>
        </Grid>
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
            sx={{ width: '20%', marginBottom: '5rem' }}
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
