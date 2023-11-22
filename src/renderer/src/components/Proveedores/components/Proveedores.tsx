import { AppBar, Toolbar } from '@mui/material'

import React, { useEffect } from 'react'
import Api from '../../../../../preload/types'




export default function Proveedores() {

useEffect(() => {
    const asyncFunction = async () => {
        try{
        
            const request = { action: 'selimina' , data:{} }
            const proveedores = await  window.api.proveedores(request)
            console.log(proveedores)
        }catch(e){
            console.log(e)
        }
    }
    asyncFunction()
}, [])
 
  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#7D9F3A', justifyContent: 'space-between' }}>
        <h2>Proveedores</h2>
          
        </Toolbar>
      </AppBar>

    </div>
  )
}
