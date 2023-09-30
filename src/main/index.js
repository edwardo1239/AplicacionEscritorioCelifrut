import { app, shell, BrowserWindow, net, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { resolve } from 'node:path'
import { Worker } from 'node:worker_threads'
const fs = require('fs')
const { mainMenu } = require('./menuMaker')
import icon from '../../resources/icon.png?asset'
import { eliminarInventarioDescarte, fetchFunction, functionObtenerDescarte } from './functions'

//desarrollo
const ID = 'AKfycbz5FjWgwq1t40FFvQdHhnJcwwu9thOgCK3iXBP8dfYPTHwgBG_vL9Fch77PPGovPorhBQ'
//produccion
//  const ID = 'AKfycbxHM6BBe6vG7LUyJHSADB36A3p116A-fO370mazy0qXWs0hUffapnhQFMAlCzsdFZA'

const pathIDs = './ids.json'
const pathProveedores = './proveedores.json'
const pathInventario = './inventario.json'
const pathHistorialVaciado = './historialVaciado.json'
const pathHistorialDirectoNacional = './historialDirectoNacional.json'
const pathInventarioDesverdizando = './inventarioDesverdizado.json'
const pathHistorialDescarte = './historialDescarte.json'


///IDs de produccion y de desarrollo
//produccion

// const pathIDs = join(__dirname, '../../../ids.json')
// const pathProveedores = join(__dirname, '../../../proveedores.json')
// const pathInventario = join(__dirname, '../../../inventario.json')
// const pathHistorialVaciado = join(__dirname, '../../../historialVaciado.json')
// const pathHistorialDirectoNacional = join(__dirname, '../../../historialDirectoNacional.json')
// const pathInventarioDesverdizando = join(__dirname, '../../../inventarioDesverdizado.json')


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,

    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegrationInWorker: true
    }
  })

  Menu.setApplicationMenu(mainMenu)

  //    process.setFdLimit(131072)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

//funcion para obtener el nombre de los predios
ipcMain.handle('obtenerPredios', async () => {
  try {
    let prediosJSON = fs.readFileSync(pathProveedores)
    let predios = JSON.parse(prediosJSON)

    let enfJSON = fs.readFileSync(pathIDs)
    let enf = JSON.parse(enfJSON)

    let obj = {}
    obj['predios'] = predios
    obj['enf'] = enf.enf
    //console.log(obj)
    return obj
  } catch (e) {
    console.error(`${e.name}: ${e.message}`)
  }
})

//funcion para obtener la fruta sin procesar
ipcMain.handle('obtenerFrutaActual', async () => {
  let inventarioJSON = fs.readFileSync(pathInventario)
  let inventario = JSON.parse(inventarioJSON)

  let prediosJSON = fs.readFileSync(pathProveedores)
  let proveedores = JSON.parse(prediosJSON)

  let objFrutaActual = {}
  //console.log(inventario)

  if (Object.keys(inventario).length !== 0) {
    Object.keys(inventario).map((item) => {
      if (!inventario[item].hasOwnProperty('inventario')) {
      } else if (inventario[item]['inventario'] > 0) {
        objFrutaActual[item] = {}
        objFrutaActual[item]['ICA'] = proveedores[inventario[item]['nombre']]['ICA']
        objFrutaActual[item]['nombre'] = inventario[item]['nombre']
        objFrutaActual[item]['fecha'] = inventario[item]['fecha']
        objFrutaActual[item]['inventario'] = inventario[item]['inventario']
        objFrutaActual[item]['observaciones'] = inventario[item]['observaciones']
        objFrutaActual[item]['tipoFruta'] = inventario[item]['tipoFruta']
        objFrutaActual[item]['KilosActual'] =
          (inventario[item]['kilos'] / inventario[item]['canastillas']) *
          inventario[item]['inventario']
      }
    })
  }
  //console.log(objFrutaActual)
  return objFrutaActual
})

//funcion para obtener el historial de vaciado
ipcMain.handle('obtenerHistorialProceso', async () => {
  try {
    let historialVaciadoJSON = fs.readFileSync(pathHistorialVaciado)
    let historialVaciado = JSON.parse(historialVaciadoJSON)

    let inventarioJSON = fs.readFileSync(pathInventario)
    let inventario = JSON.parse(inventarioJSON)

    let enfJSON = fs.readFileSync(pathIDs)
    let enf = JSON.parse(enfJSON)

    let datos = {}
    let id = enf.idVaciado
    let rango = id - 200

    if (rango < 0) rango = 0
    for (let i = id - 1; i >= rango; i--) {
      datos[i] = {}

      datos[i]['enf'] = historialVaciado[i]['enf']
      datos[i]['nombre'] = inventario[datos[i]['enf']]['nombre']
      datos[i]['canastillas'] = historialVaciado[i]['canastillas']
      datos[i]['kilos'] = historialVaciado[i]['kilos']
      datos[i]['tipoFruta'] = inventario[datos[i]['enf']]['tipoFruta']
      datos[i]['fecha'] = historialVaciado[i]['fecha']
    }

    //console.log(datos)
    return datos
  } catch (e) {
    // return `${e.name}: ${e.message}`
    console.log(`${e.name}: ${e.message}`)
  }
})

//funcion para obtener el descarte de la base de datos local en el inventario
ipcMain.handle('obtenerDescarte', async () => {
  try {

    let inventarioJSON = fs.readFileSync(pathInventario)
    let inventario = JSON.parse(inventarioJSON)

    let descarteObj = await functionObtenerDescarte(inventario);

    return descarteObj
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})

//funcion para obtener el descarte en el inventario
ipcMain.handle('actualizarDescarte', async () => {
  try {
    //const ID = 'AKfycbzjDOayt3ndFtwXz1YJflsmEM9Sjl-IP0iKZ1FXJ4GQholfUef9KhGrUuCZ3UrLCvBQ'
    const url = 'https://script.google.com/macros/s/' + ID + '/exec'
    const request = '?action=obtenerDescarte'
    const response = await net.fetch(url + request)
    const descarte = await response.json()
    console.log(descarte)
    let inventarioJSON = fs.readFileSync(pathInventario)
    let inventario = JSON.parse(inventarioJSON)
    // se guarda el descarte en el inventario
    if (typeof descarte === 'object') {
      Object.keys(descarte).map((enf) => {
        let isCelifrut = enf.split('-')
        if (isCelifrut[0] == 'Celifrut') {
          if (
            !(
              inventario[enf].hasOwnProperty('descarteLavado') ||
              inventario[enf].hasOwnProperty('descarteEncerado')
            )
          ) {
            inventario[enf]['descarteLavado'] = {}
            inventario[enf]['descarteEncerado'] = {}
          }

          inventario[enf]['descarteLavado'] = descarte[enf]['descarteLavado']
          inventario[enf]['descarteEncerado'] = descarte[enf]['descarteEncerado']
          inventario[enf]['tipoFruta'] = descarte[enf]['tipoFruta']

        } else if(isCelifrut !== 'Celifrut') {
          if (
            !(
              inventario[enf].hasOwnProperty('descarteLavado') ||
              inventario[enf].hasOwnProperty('descarteEncerado')
            )
          ) {
            inventario[enf]['descarteLavado'] = {}
            inventario[enf]['descarteEncerado'] = {}
          }

          inventario[enf]['descarteLavado'] = descarte[enf]['descarteLavado']
          inventario[enf]['descarteEncerado'] = descarte[enf]['descarteEncerado']
        }
      })

    }
    let descarteObj = await functionObtenerDescarte(inventario);
    inventarioJSON = JSON.stringify(inventario)
    fs.writeFileSync(pathInventario, inventarioJSON)

    return descarteObj
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})

ipcMain.handle('obtenerHistorialDirectoNacional', async () => {
  try {
    let historialDirectoNacionalJSON = fs.readFileSync(pathHistorialDirectoNacional)
    let historialDirectoNacional = JSON.parse(historialDirectoNacionalJSON)

    let inventarioJSON = fs.readFileSync(pathInventario)
    let inventario = JSON.parse(inventarioJSON)

    let enfJSON = fs.readFileSync(pathIDs)
    let enf = JSON.parse(enfJSON)

    let datos = {}
    let id = enf.idDirectoNacional
    let rango = id - 200

    if (rango < 0) rango = 0
    for (let i = id - 1; i >= rango; i--) {
      datos[i] = {}

      datos[i]['enf'] = historialDirectoNacional[i]['enf']
      datos[i]['nombre'] = inventario[datos[i]['enf']]['nombre']
      datos[i]['canastillas'] = historialDirectoNacional[i]['canastillas']
      datos[i]['kilos'] = historialDirectoNacional[i]['kilos']
      datos[i]['tipoFruta'] = inventario[datos[i]['enf']]['tipoFruta']
      datos[i]['fecha'] = historialDirectoNacional[i]['fecha']
    }

    //console.log(datos)
    return datos
  } catch (e) {
    // return `${e.name}: ${e.message}`
    console.log(`${e.name}: ${e.message}`)
  }
})

//funcion para obtener la fruta sin procesar
ipcMain.handle('obtenerFrutaDesverdizando', async () => {
  let inventarioJSON = fs.readFileSync(pathInventario)
  let inventario = JSON.parse(inventarioJSON)

  let desverdizandoJSON = fs.readFileSync(pathInventarioDesverdizando)
  let desverdizado = JSON.parse(desverdizandoJSON)

  let objDesverdizando = {}
  //console.log(inventario)

  Object.keys(desverdizado).map((enf) => {
    if (desverdizado[enf]['desverdizando'] == true) {
      objDesverdizando[enf] = {}
      objDesverdizando[enf]['nombre'] = inventario[enf]['nombre']
      objDesverdizando[enf] = { ...objDesverdizando[enf], ...desverdizado[enf] }
    }
  })

  //console.log(objDesverdizando)
  return objDesverdizando
})

//funcion que hace fetch de los datos
// setInterval(async () => {
//   try {

//   const worker = new Worker(resolve(__dirname, './worker.js'), {})
//   worker.on('message', (data) => {
//     console.log(data)
//   })

//   } catch (e) {
//     console.log(e)
//   }
// }, 800)

//funcion para guardar un nuevo lote
ipcMain.handle('guardarLote', async (event, datos) => {
  console.log(datos)
  try {
    let url = 'https://script.google.com/macros/s/' + ID + '/exec'
    const response = await net.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'ingresarLote',
        tipoFruta: datos.tipoFruta,
        nombre: datos.nombre,
        kilos: datos.kilos,
        placa: datos.placa,
        canastillas: datos.canastillas,
        observaciones: datos.observaciones,
        enf: datos.enf
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    const responseGuardarLote = await response.json()
    //console.log(responseGuardarLote)

    if (responseGuardarLote === 'Guardado con exito') {
      let fecha = new Date()
      let codigoENF =
        'EF1-' +
        fecha.getFullYear().toString().slice(-2) +
        String(fecha.getMonth() + 1).padStart(2, '0') +
        datos.enf

      let enfJSON = fs.readFileSync(pathIDs)

      let enf = JSON.parse(enfJSON)

      try {
        if (!fs.existsSync(pathInventario)) {
          let inventario = {}
          inventario[codigoENF] = {}
          inventario[codigoENF]['inventario'] = datos.canastillas
          inventario[codigoENF]['canastillas'] = datos.canastillas
          inventario[codigoENF]['kilos'] = datos.kilos
          inventario[codigoENF]['nombre'] = datos.nombre
          inventario[codigoENF]['tipoFruta'] = datos.tipoFruta
          inventario[codigoENF]['observaciones'] = datos.observaciones
          inventario[codigoENF]['fecha'] = fecha

          enf.enf += 1

          let inventarioJSON = JSON.stringify(inventario)
          fs.writeFileSync(pathInventario, inventarioJSON)

          enfJSON = JSON.stringify(enf)
          fs.writeFileSync(pathIDs, enfJSON)
        } else {
          let inventarioJSON = fs.readFileSync(pathInventario)

          let inventario = JSON.parse(inventarioJSON)

          if (!inventario.hasOwnProperty(datos.enf)) {
            inventario[codigoENF] = {}
          }

          inventario[codigoENF] = {}
          inventario[codigoENF]['inventario'] = datos.canastillas
          inventario[codigoENF]['canastillas'] = datos.canastillas
          inventario[codigoENF]['kilos'] = datos.kilos
          inventario[codigoENF]['nombre'] = datos.nombre
          inventario[codigoENF]['tipoFruta'] = datos.tipoFruta
          inventario[codigoENF]['observaciones'] = datos.observaciones
          inventario[codigoENF]['fecha'] = fecha

          enf.enf += 1

          inventarioJSON = JSON.stringify(inventario)
          fs.writeFileSync(pathInventario, inventarioJSON)

          enfJSON = JSON.stringify(enf)
          fs.writeFileSync(pathIDs, enfJSON)
        }
      } catch (e) {
        return `${e.name}: ${e.message}`
      }
    }
    return responseGuardarLote
  } catch (e) {
    console.error(e)
  }
})

//funcion para vaciar canastillas
ipcMain.handle('vaciarLote', async (event, datos) => {
  //let ID = 'AKfycbxvljaMDbqzLzCjZsNvXGKEdgGStMhd47eCx94E6nBlqJH1QCSxmeHREs_gt2ViDgl36A'
  let url = 'https://script.google.com/macros/s/' + ID + '/exec'
  try {
    const response = await net.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'vaciarLote',
        canastillas: datos.canastillas,
        enf: datos.enf
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    const responseGuardarLote = await response.json()
    //const responseGuardarLote = 'Vaciado con exito'
    //console.log(datos)
    if (responseGuardarLote === 'Vaciado con exito') {
      let inventarioJSON = fs.readFileSync(pathInventario)
      let inventario = JSON.parse(inventarioJSON)

      let enfJSON = fs.readFileSync(pathIDs)
      let enf = JSON.parse(enfJSON)

      //console.log(inventario)

      enf['ENF-vaciando'] = datos.enf
      inventario[datos.enf]['inventario'] -= Number(datos.canastillas)

      if (!fs.existsSync(pathHistorialVaciado)) {
        let historialVaciado = {}
        let historialVaciadoJSON = JSON.stringify(historialVaciado)
        fs.writeFileSync(pathHistorialVaciado, historialVaciadoJSON)
        enf['idVaciado'] = 0
      }

      let historialVaciadoJSON = fs.readFileSync(pathHistorialVaciado)
      let historialVaciado = JSON.parse(historialVaciadoJSON)

      historialVaciado[enf['idVaciado']] = {}
      historialVaciado[enf['idVaciado']]['enf'] = datos.enf
      historialVaciado[enf['idVaciado']]['canastillas'] = datos.canastillas
      historialVaciado[enf['idVaciado']]['kilos'] =
        datos.canastillas * (inventario[datos.enf]['kilos'] / inventario[datos.enf]['canastillas'])
      historialVaciado[enf['idVaciado']]['fecha'] = new Date()
      enf['idVaciado'] += 1

      //console.log(inventario)

      inventarioJSON = JSON.stringify(inventario)
      fs.writeFileSync(pathInventario, inventarioJSON)

      enfJSON = JSON.stringify(enf)
      fs.writeFileSync(pathIDs, enfJSON)

      historialVaciadoJSON = JSON.stringify(historialVaciado)
      fs.writeFileSync(pathHistorialVaciado, historialVaciadoJSON)

      console.log('Data saved')
    }

    return responseGuardarLote
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})

//funcion para directo nacional
ipcMain.handle('directoNacional', async (event, datos) => {
  //let ID = "AKfycbx-AMW2OtRiln4eo5lI32YMCKhZ_-QogslqgLoCuy0pYJ3VXV3DrMVLoMxGuYqh5-SP"
  let url = 'https://script.google.com/macros/s/' + ID + '/exec'
  try {
    const response = await net.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'directoNacional',
        canastillas: datos.canastillas,
        enf: datos.enf
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    const responseDirectoNacional = await response.json()

    if (responseDirectoNacional === 'Directo nacional con exito') {
      let inventarioJSON = fs.readFileSync(pathInventario)
      let inventario = JSON.parse(inventarioJSON)

      let enfJSON = fs.readFileSync(pathIDs)
      let enf = JSON.parse(enfJSON)

      inventario[datos.enf]['inventario'] -= Number(datos.canastillas)

      if (!fs.existsSync(pathHistorialDirectoNacional)) {
        let historialDirectoNacional = {}
        let historialDirectoNacionalJSON = JSON.stringify(historialDirectoNacional)
        fs.writeFileSync(pathHistorialDirectoNacional, historialDirectoNacionalJSON)
        enf['idDirectoNacional'] = 0
      }

      let historialDirectoNacionalJSON = fs.readFileSync(pathHistorialDirectoNacional)
      let historialDirectoNacional = JSON.parse(historialDirectoNacionalJSON)

      historialDirectoNacional[enf['idDirectoNacional']] = {}
      historialDirectoNacional[enf['idDirectoNacional']]['enf'] = datos.enf
      historialDirectoNacional[enf['idDirectoNacional']]['canastillas'] = datos.canastillas
      historialDirectoNacional[enf['idDirectoNacional']]['kilos'] =
        datos.canastillas * (inventario[datos.enf]['kilos'] / inventario[datos.enf]['canastillas'])
      historialDirectoNacional[enf['idDirectoNacional']]['fecha'] = new Date()
      enf['idDirectoNacional'] += 1

      //console.log(inventario)

      inventarioJSON = JSON.stringify(inventario)
      fs.writeFileSync(pathInventario, inventarioJSON)

      enfJSON = JSON.stringify(enf)
      fs.writeFileSync(pathIDs, enfJSON)

      historialDirectoNacionalJSON = JSON.stringify(historialDirectoNacional)
      fs.writeFileSync(pathHistorialDirectoNacional, historialDirectoNacionalJSON)
    }
    return responseDirectoNacional
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
    return `${e.name}: ${e.message}`
  }
})

//funcion para desverdizado
ipcMain.handle('desverdizado', async (event, datos) => {
  //let ID = 'AKfycbxESIUbUJ_eBgdl5XrtNCHfk2IkthvmbtmuHi5kzUGcBKCIGb-Ftj-SJijYGj7n9sHi'
  let url = 'https://script.google.com/macros/s/' + ID + '/exec'
  console.log('0')
  try {
    const response = await net.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'desverdizado',
        canastillas: datos.canastillas,
        enf: datos.enf,
        cuartoDesverdizado: datos.cuartoDesverdizado
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    const responseGuardarLote = await response.json()
    //const responseGuardarLote = 'Vaciado con exito'
    console.log(responseGuardarLote)
    if (responseGuardarLote === 'Lote' + datos.enf + 'Ingreado a desverdizado') {
      console.log('1')
      let inventarioJSON = fs.readFileSync(pathInventario)
      let inventario = JSON.parse(inventarioJSON)

      // let enfJSON = fs.readFileSync(pathIDs)
      // let enf = JSON.parse(enfJSON)

      //console.log(inventario)

      inventario[datos.enf]['inventario'] -= Number(datos.canastillas)

      if (!fs.existsSync(pathInventarioDesverdizando)) {
        let inventarioDesverdizado = {}
        let inventarioDesverdizadoJSON = JSON.stringify(inventarioDesverdizado)
        fs.writeFileSync(pathInventarioDesverdizando, inventarioDesverdizadoJSON)
      }

      let inventarioDesverdizadoJSON = fs.readFileSync(pathInventarioDesverdizando)
      let inventarioDesverdizado = JSON.parse(inventarioDesverdizadoJSON)

      if (!inventarioDesverdizado.hasOwnProperty(datos.enf)) {
        inventarioDesverdizado[datos.enf] = {}
        inventarioDesverdizado[datos.enf]['canastillasIngreso'] = 0
        inventarioDesverdizado[datos.enf]['kilosIngreso'] = 0
        inventarioDesverdizado[datos.enf]['cuartoDesverdizado'] = ''
      }

      inventarioDesverdizado[datos.enf]['canastillasIngreso'] += Number(datos.canastillas)
      inventarioDesverdizado[datos.enf]['kilosIngreso'] +=
        datos.canastillas * (inventario[datos.enf]['kilos'] / inventario[datos.enf]['canastillas'])
      inventarioDesverdizado[datos.enf]['fechaIngreso'] = new Date()
      inventarioDesverdizado[datos.enf]['desverdizando'] = true
      inventarioDesverdizado[datos.enf]['cuartoDesverdizado'] += datos.cuartoDesverdizado + ' '

      //console.log(inventario)

      inventarioJSON = JSON.stringify(inventario)
      fs.writeFileSync(pathInventario, inventarioJSON)

      inventarioDesverdizadoJSON = JSON.stringify(inventarioDesverdizado)
      fs.writeFileSync(pathInventarioDesverdizando, inventarioDesverdizadoJSON)

      console.log('Data saved')
    }

    return responseGuardarLote
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})

//funcion para modificar el historial

ipcMain.handle('modificarHistorial', async (event, datos) => {
  //let ID = 'AKfycbwTnPSF89F_GKwqNRmyjJRdT8KXS_o3RWP7Ay5pHJMsRvbbGNyjhNf4QIdXj9Xhph61'
  let url = 'https://script.google.com/macros/s/' + ID + '/exec'
  try {
    const response = await net.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'modificarHistorial',
        canastillas: datos.canastillas,
        enf: datos.enf
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    const responseModificarLote = await response.json()
    if (responseModificarLote === 'Modificado con exito') {
      let inventarioJSON = fs.readFileSync(pathInventario)
      let inventario = JSON.parse(inventarioJSON)

      let historialVaciadoJSON = fs.readFileSync(pathHistorialVaciado)
      let historialVaciado = JSON.parse(historialVaciadoJSON)

      inventario[datos.enf]['inventario'] += Number(datos.canastillas)
      historialVaciado[datos.id]['canastillas'] -= datos.canastillas
      historialVaciado[datos.id]['modificado'] = datos.canastillas
      historialVaciado[datos.id]['kilos'] =
        historialVaciado[datos.id]['canastillas'] *
        (inventario[datos.enf]['kilos'] / inventario[datos.enf]['canastillas'])
      //console.log(inventario);

      inventarioJSON = JSON.stringify(inventario)
      fs.writeFileSync(pathInventario, inventarioJSON)

      historialVaciadoJSON = JSON.stringify(historialVaciado)
      fs.writeFileSync(pathHistorialVaciado, historialVaciadoJSON)
    }
    return responseModificarLote
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})
//funcion para enviar la fruta en el inventario de descarte

ipcMain.handle('eliminarFrutaDescarte', async (event, datos) => {
  try {
    //let ID = 'AKfycbyZTBrl5SZwpV4W0cPJsSRbWwNHuUB05a_982z1woO1ioR2duQAe7B_DdTLBuHaQ2Bruw'
    let url = 'https://script.google.com/macros/s/' + ID + '/exec'

    const response = await net.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'eliminarFrutaDescarte',
        objEnf: datos[0]
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    const responseEliminarDescarte = await response.json()

    if (responseEliminarDescarte === 'Enviado con exito') {
      let inventarioJSON = fs.readFileSync(pathInventario)
      let inventario = JSON.parse(inventarioJSON)

      let idsJSON = fs.readFileSync(pathIDs)
      let ids = JSON.parse(idsJSON)

      //se crea el documento que guarda los datos de la salida de el descarte
      if (!fs.existsSync(pathHistorialDescarte)) {
        let idsJSON = fs.readFileSync(pathIDs)
        let ids = JSON.parse(idsJSON)
        // let historialDescarteJSON = fs.readFileSync(pathHistorialDescarte)
        // let historialDescarte = JSON.parse(historialDescarteJSON)

        ids['idHistorialDescarte'] = 0
        let historialDescarte = {}

        idsJSON = JSON.stringify(ids)
        fs.writeFileSync(pathIDs, idsJSON)

        let historialDescarteJSON = JSON.stringify(historialDescarte)
        fs.writeFileSync(pathHistorialDescarte, historialDescarteJSON)
      }

      let historialDescarteJSON = fs.readFileSync(pathHistorialDescarte)
      let historialDescarte = JSON.parse(historialDescarteJSON)

      historialDescarte[ids['idHistorialDescarte']] = {}

      Object.keys(datos[0]).map((item) => {
        let [enf, descarte, tipoDescarte] = item.split('/')
        historialDescarte[ids['idHistorialDescarte']][enf] = {}
        historialDescarte[ids['idHistorialDescarte']][enf]['descarteLavado'] = {}
        historialDescarte[ids['idHistorialDescarte']][enf]['descarteEncerado'] = {}
        historialDescarte[ids['idHistorialDescarte']][enf]['cliente'] = {}
      })

      Object.keys(datos[0]).map((item) => {
        let [enf, descarte, tipoDescarte] = item.split('/')
        // console.log(enf)
        inventario[enf][descarte][tipoDescarte] -= datos[0][item]
        historialDescarte[ids['idHistorialDescarte']][enf]['cliente'] = datos[1]
        historialDescarte[ids['idHistorialDescarte']][enf][descarte][tipoDescarte] = datos[0][item]
      })

      ids['idHistorialDescarte'] += 1

      inventarioJSON = JSON.stringify(inventario)
      fs.writeFileSync(pathInventario, inventarioJSON)

      idsJSON = JSON.stringify(ids)
      fs.writeFileSync(pathIDs, idsJSON)

      historialDescarteJSON = JSON.stringify(historialDescarte)
      fs.writeFileSync(pathHistorialDescarte, historialDescarteJSON)
    }
    return responseEliminarDescarte
  } catch (e) {
    console.error(`${e.name}: ${e.message}`)
    return `${e.name}: ${e.message}`
  }
})
//funcion para modificar el historial de directo nacional

ipcMain.handle('modificarHistorialDirectoNacional', async (event, datos) => {
  //let ID = "AKfycbyNvCqx8f3_V6kXVx-5BwqArei8xtvO6z0cxMYYpRwGydEBCG0tZ9lIlPgG_qbeRyoR"
  let url = 'https://script.google.com/macros/s/' + ID + '/exec'
  try {
    const response = await net.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'modificarHistorialDirecto',
        canastillas: datos.canastillas,
        enf: datos.enf
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })

    const responseModificarLote = await response.json()
    if (responseModificarLote === 'Modificado con exito') {
      let inventarioJSON = fs.readFileSync(pathInventario)
      let inventario = JSON.parse(inventarioJSON)

      let historialDirectoNacionalJSON = fs.readFileSync(pathHistorialDirectoNacional)
      let historialDirectoNacional = JSON.parse(historialDirectoNacionalJSON)

      inventario[datos.enf]['inventario'] += Number(datos.canastillas)
      historialDirectoNacional[datos.id]['canastillas'] -= datos.canastillas
      historialDirectoNacional[datos.id]['modificado'] = datos.canastillas
      historialDirectoNacional[datos.id]['kilos'] =
        historialDirectoNacional[datos.id]['canastillas'] *
        (inventario[datos.enf]['kilos'] / inventario[datos.enf]['canastillas'])
      //console.log(inventario);

      inventarioJSON = JSON.stringify(inventario)
      fs.writeFileSync(pathInventario, inventarioJSON)

      historialDirectoNacionalJSON = JSON.stringify(historialDirectoNacional)
      fs.writeFileSync(pathHistorialDirectoNacional, historialDirectoNacionalJSON)
    }
    return responseModificarLote
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})

ipcMain.handle('finalizarDesverdizado', async (event, datos) => {
  //let ID = "AKfycbxcFf4UcCOEPyUGLe5xnsxrsVXfJps0vGg6tM_o553IJh1C0Jb3dqvUrUsMn5BDmU7p"
  let url = 'https://script.google.com/macros/s/' + ID + '/exec'
  console.log(datos)
  try {
    const response = await net.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'finalizarDesverdizado',
        enf: datos.enf
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    const responseFetch = await response.json()
    console.log(responseFetch)
    if (responseFetch == 'Lote' + datos.enf + 'desverdizado finalizado') {
      let inventarioDesverdizadoJSON = fs.readFileSync(pathInventarioDesverdizando)
      let inventarioDesverdizado = JSON.parse(inventarioDesverdizadoJSON)

      inventarioDesverdizado[datos.enf]['fechaFinalizado'] = new Date()

      inventarioDesverdizadoJSON = JSON.stringify(inventarioDesverdizado)
      fs.writeFileSync(pathInventarioDesverdizando, inventarioDesverdizadoJSON)
    }
    return responseFetch
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})

ipcMain.handle('setParametrosDesverdizado', async (event, datos) => {
  //const ID = "AKfycbxtiTGK4Z-oto2NwyANdSoes5TpNQpkVmJmiVy7JJ3iT3saVC4ajmjls86gjd_kur0A";
  const url = 'https://script.google.com/macros/s/' + ID + '/exec'
  try {
    const response = await net.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'setParametrosDesverdizado',
        enf: datos.enf,
        temperatura: datos.temperatura,
        etileno: datos.etileno,
        carbono: datos.carbono,
        humedad: datos.humedad
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    const responseFetch = await response.json()
    console.log(responseFetch)
    if (responseFetch === 'Parametros Guardados con exito') {
      let inventarioDesverdizadoJSON = fs.readFileSync(pathInventarioDesverdizando)
      let inventarioDesverdizado = JSON.parse(inventarioDesverdizadoJSON)

      if (!inventarioDesverdizado[datos.enf].hasOwnProperty('parametros')) {
        inventarioDesverdizado[datos.enf]['parametros'] = []
      }

      inventarioDesverdizado[datos.enf]['parametros'].push([
        new Date(),
        datos.temperatura,
        datos.etileno,
        datos.carbono,
        datos.humedad
      ])

      inventarioDesverdizadoJSON = JSON.stringify(inventarioDesverdizado)
      fs.writeFileSync(pathInventarioDesverdizando, inventarioDesverdizadoJSON)
    }
    console.log(responseFetch)
    return responseFetch
  } catch (e) {
    console.log(`${e.name}:${e.message}`)
    return `${e.name}:${e.message}`
  }
})

ipcMain.handle('procesarDesverdizado', async (event, datos) => {
  const url = 'https://script.google.com/macros/s/' + ID + '/exec'
  try {
    const fetchResponse = await net.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'procesarDesverdizado',
        enf: datos.enf,
        canastillas: datos.canastillas
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    const responsePorcesarDesverdizado = await fetchResponse.json()
    if (responsePorcesarDesverdizado === 'Lote' + datos.enf + 'se a puesto a procesar') {
      let inventarioDesverdizadoJSON = fs.readFileSync(pathInventarioDesverdizando)
      let inventarioDesverdizado = JSON.parse(inventarioDesverdizadoJSON)

      if (inventarioDesverdizado[datos.enf]['canastillasIngreso'] - datos.canastillas === 0) {
        inventarioDesverdizado[datos.enf]['desverdizando'] = false
      }

      inventarioDesverdizadoJSON = JSON.stringify(inventarioDesverdizado)
      fs.writeFileSync(pathInventarioDesverdizando, inventarioDesverdizadoJSON)
    }
    console.log(responsePorcesarDesverdizado)
    return responsePorcesarDesverdizado
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})

ipcMain.handle('reprocesarDescarteUnPredio', async (event, datos) => {
  const url = 'https://script.google.com/macros/s/' + ID + '/exec'
  try {
    const response = await net.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'reprocesarDescarteUnPredio',
        data: datos
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })

    const fetchResponse = await response.json()

    console.log(fetchResponse)
    let keys = Object.keys(datos)
    let [enf, descarte, tipoDescarte] = keys[0].split('/')
    if (fetchResponse === 'Descarte puesto a procesar') {
      try {
        let inventarioJSON = fs.readFileSync(pathInventario)
        let inventario = JSON.parse(inventarioJSON)

        let idsJSON = fs.readFileSync(pathIDs)
        let ids = JSON.parse(idsJSON)

        let historialDescarteJSON = fs.readFileSync(pathHistorialDescarte)
        let historialDescarte = JSON.parse(historialDescarteJSON)

        historialDescarte[ids['idHistorialDescarte']] = {}

        Object.keys(datos).map((item) => {
          let [enf, descarte, tipoDescarte] = item.split('/')
          historialDescarte[ids['idHistorialDescarte']][enf] = {}
          historialDescarte[ids['idHistorialDescarte']][enf]['descarteLavado'] = {}
          historialDescarte[ids['idHistorialDescarte']][enf]['descarteEncerado'] = {}
        })

        Object.keys(datos).map((item) => {
          let [enf, descarte, tipoDescarte] = item.split('/')
          // console.log(enf)
          inventario[enf][descarte][tipoDescarte] -= datos[item]
          historialDescarte[ids['idHistorialDescarte']][enf][descarte][tipoDescarte] = datos[item]
        })

        ids['idHistorialDescarte'] += 1

        inventarioJSON = JSON.stringify(inventario)
        fs.writeFileSync(pathInventario, inventarioJSON)

        idsJSON = JSON.stringify(ids)
        fs.writeFileSync(pathIDs, idsJSON)

        historialDescarteJSON = JSON.stringify(historialDescarte)
        fs.writeFileSync(pathHistorialDescarte, historialDescarteJSON)
      } catch (e) {
        return `${e.name}:${e.message}`
      }
    }
    return fetchResponse
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})

ipcMain.handle('ReprocesarDescarteCelifrut', async (event, datos) => {
  try {
    //funcion que hace el fecth
    const response = await fetchFunction('ReprocesarDescarteCelifrut', datos)
    
    if(response === 200){
        //se leen los archivos json
    let inventarioJSON = fs.readFileSync(pathInventario)
    let inventario = JSON.parse(inventarioJSON)

    let idsJSON = fs.readFileSync(pathIDs)
    let ids = JSON.parse(idsJSON)

    let historialDescarteJSON = fs.readFileSync(pathHistorialDescarte)
    let historialDescarte = JSON.parse(historialDescarteJSON)

    // se agrega los datos al historiald de descarte
    historialDescarte[ids['idHistorialDescarte']] = {}

    //se crean los objetos que tendran los datos del historiald e vaciado
    Object.keys(datos).map((item) => {
      let [enf, descarte, tipoDescarte] = item.split('/')
      historialDescarte[ids['idHistorialDescarte']][enf] = {}
      historialDescarte[ids['idHistorialDescarte']][enf]['descarteLavado'] = {}
      historialDescarte[ids['idHistorialDescarte']][enf]['descarteEncerado'] = {}
    })

    // se elimina la fruta del inventario y se mete en el historial
    Object.keys(datos).map((item) => {
      let [enf, descarte, tipoDescarte] = item.split('/')
      // console.log(enf)
      inventario[enf][descarte][tipoDescarte] -= datos[item]
      historialDescarte[ids['idHistorialDescarte']][enf][descarte][tipoDescarte] = datos[item]
    })

    //se crea en el inventario el item correspondiente a celifrut
    inventario['Celifrut-' + ids.idCelifrut] = {}
    inventario['Celifrut-' + ids.idCelifrut]['fecha'] = new Date()

    // se suma el id del historial descarte
    ids['idHistorialDescarte'] += 1
    ids['idCelifrut'] += 1


    inventarioJSON = JSON.stringify(inventario)
    fs.writeFileSync(pathInventario, inventarioJSON)

    idsJSON = JSON.stringify(ids)
    fs.writeFileSync(pathIDs, idsJSON)

    historialDescarteJSON = JSON.stringify(historialDescarte)
    fs.writeFileSync(pathHistorialDescarte, historialDescarteJSON)
      console.log(response)
      return 200
    } else {
      return 'Error cargar datos' + response
      console.log(response)
    }
  } catch (e) {
    return `${e.name}:${e.message}`
    console.log(e)
  }
})

ipcMain.handle('crearContenedor', async (event, datos) =>{
  try{

    const response = await fetchFunction('crearContenedor', datos)
    console.log(response)
    return response;

  } catch(e){
    console.log(e)
    return e
  }
})