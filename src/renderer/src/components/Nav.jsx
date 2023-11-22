import React, { useState } from 'react'
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Toolbar,
  CssBaseline,
  Divider
} from '@mui/material'
import logo from '../assets/CELIFRUT.png'

import Index from './Index'
import Recepcion from './ingresoFruta/Recepcion'
import ListaBotonesInventario from './inventario/ListaBotonesInventario'
import BotonIngresoFruta from './ingresoFruta/BotonIngresoFruta'
import FrutaSinProcesar from './inventario/components/FrutaSinProcesar'
import FrutaDescarte from './inventario/components/FrutaDescarte'
import DesverdizadoInv from './inventario/components/DesverdizadoInv'
import BotonContenedores from './Contenedores/BotonContenedores'
import CrearContenedor from './Contenedores/components/CrearContenedor'
import BotonesCalidad from './Calidad/BotonesCalidad'
import CalidadInterna from './Calidad/components/CalidadInterna'
import VerListasEmpaque from './Contenedores/components/VerListasEmpaque'
import ClasificacionCalidad from './Calidad/components/ClasificacionCalidad'
import Formularios from './Calidad/Formatos/components/Formularios'
import BotonProveedores from './Proveedores/BotonProveedores'
import VolanteCalidadC from './Calidad/VolanteCalidad/components/VolanteCalidadC'
import Proveedor from './Proveedores/components/Proveedor'


const drawerWidth = 240

export default function Nav() {

  const [state, setState] = useState("")
  const [encabezados, setEncabezados] = useState([''])

  const seleccion = (nombre) =>{
    setState(nombre)
    console.log(nombre)
  }

 const permisosSesion = (permisos) =>{
    setEncabezados(permisos)
 }
  return (
    <Box sx={{ display: 'flex', margin:0 }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'white' }}
      >
        <Toolbar>
          <img src={logo} width={50} onClick={() => navBar('index')} style={{cursor:'pointer'}}/>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {encabezados.map((text, index) => (
              <ListItem key={text + index} disablePadding>
                  <ListItemIcon>
                    {text === 'Ingreso de fruta' && <BotonIngresoFruta seleccion={seleccion} />}
                    {text === 'Inventario' && <ListaBotonesInventario seleccion={seleccion}/>}
                    {text === 'Contenedores' && <BotonContenedores seleccion={seleccion}/>}
                    {text === 'Calidad' && <BotonesCalidad seleccion={seleccion}/>}
                    {text === 'Proveedores' && <BotonProveedores seleccion={seleccion}/>}
                  </ListItemIcon>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>


      
      <Box component="main" sx={{ flexGrow: 1 }} >
        <Toolbar />

        {state === '' && <Index permisosSesion={permisosSesion} />}
        {state === 'Ingreso de fruta' && <Recepcion />}
        {state === 'Fruta sin procesar' && <FrutaSinProcesar />}
        {state === 'Descarte' && <FrutaDescarte />}
        {state === 'Desverdizado' && <DesverdizadoInv />}
        {state === 'Crear Contenedor' && <CrearContenedor />}
        {state === 'Listas de Empaque' && <VerListasEmpaque />}
        {state === 'Calidad interna' && <CalidadInterna />}
        {state === 'Clasificacion calidad' && <ClasificacionCalidad />}
        {state === 'Formatos' && <Formularios />}
        {state === 'Volante Calidad' && <VolanteCalidadC />}
        {state === 'Proveedor' && <Proveedor />}
      </Box>
    </Box>
  )
}
