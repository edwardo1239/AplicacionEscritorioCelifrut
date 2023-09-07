import { app, shell, BrowserWindow, net, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { resolve } from 'node:path'
import { Worker } from 'node:worker_threads'
const fs = require('fs')
const { mainMenu } = require('./menuMaker')
import icon from '../../resources/icon.png?asset'

// let linkObj = {}
// //let infoPredios
// let infoFrutaActual
// let infoHistorialVaciado
// let infoDescarteInventario
// let infoHistorialDirectoNacional

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

  // const response = await net.fetch(
  //   'https://script.google.com/macros/s/AKfycbyxbqQq58evRO8Hp5FE88TJPatYPc03coveFaBc9cFYYIii-j5I1tvxsUOQH7xfJ8KB/exec'
  // )
  // linkObj = await response.json()
  // console.log(linkObj)
  // await (async () => {
  //   try {
  //     let infoPredios
  //     const response = await net.fetch(linkObj.recepcion + '?action=recepcion')
  //     const predios = await response.json()
  //     infoPredios = predios
  //   } catch (e) {
  //     console.log(e)
  //   }
  // })()

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
    let prediosJSON = fs.readFileSync('./proveedores.json')
    let predios = JSON.parse(prediosJSON)

    let enfJSON = fs.readFileSync('./inventario.json')
    let enf = JSON.parse(enfJSON)
    //console.log(predios)

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
  let inventarioJSON = fs.readFileSync('./inventario.json')
  let inventario = JSON.parse(inventarioJSON)

  let prediosJSON = fs.readFileSync('./proveedores.json')
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
ipcMain.handle('obtenerHistorialProceso', async (eent) => {
  try {
    let inventarioJSON = fs.readFileSync('./inventario.json')
    let inventario = JSON.parse(inventarioJSON)

    let datos = {}
    let id = inventario['idVaciado']
    let rango = id - 200

    if (rango < 0) rango = 0
    for (let i = id - 1; i >= rango; i--) {
      datos[i] = {}

      datos[i]['enf'] = inventario['historialVaciado'][i]['enf']
      datos[i]['nombre'] = inventario[datos[i]['enf']]['nombre']
      datos[i]['canastillas'] = inventario['historialVaciado'][i]['canastillas']
      datos[i]['kilos'] = inventario['historialVaciado'][i]['kilos']
      datos[i]['tipoFruta'] = inventario[datos[i]['enf']]['tipoFruta']
      datos[i]['fecha'] = inventario['historialVaciado'][i]['fecha']
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
    //Se obtiene los datos para mostrar en la tabla
    let inventarioJSON = fs.readFileSync('./inventario.json')
    let inventario = JSON.parse(inventarioJSON)
    let descarteObj = {}

    Object.keys(inventario).map((item) => {
      if (
        item !== 'enf' ||
        item !== 'ENF-vaciando' ||
        item !== 'idVaciado' ||
        item !== 'idDirectoNacional' ||
        item !== 'historialVaciado'
      ) {
        if (
          inventario[item].hasOwnProperty('descarteLavado') ||
          inventario[item].hasOwnProperty('descarteEncerado')
        ) {
          if (
            !(
              inventario[item]['descarteLavado']['descarteGeneral'] === 0 &&
              inventario[item]['descarteLavado']['pareja'] === 0 &&
              inventario[item]['descarteLavado']['balin'] === 0 &&
              inventario[item]['descarteEncerado']['descarteGeneral'] === 0 &&
              inventario[item]['descarteEncerado']['pareja'] === 0 &&
              inventario[item]['descarteEncerado']['balin'] === 0 &&
              inventario[item]['descarteEncerado']['extra'] === 0
            )
          ) {
            descarteObj[item] = {}
            descarteObj[item]['nombre'] = inventario[item]['nombre']
            descarteObj[item]['tipoFruta'] = inventario[item]['tipoFruta']
            descarteObj[item]['descarteLavado'] = inventario[item]['descarteLavado']
            descarteObj[item]['descarteEncerado'] = inventario[item]['descarteEncerado']
          }
        }
      }
    })

    return descarteObj
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})

//funcion para obtener el descarte en el inventario
ipcMain.handle('actualizarDescarte', async () => {
  try {
    const ID = 'AKfycbzjDOayt3ndFtwXz1YJflsmEM9Sjl-IP0iKZ1FXJ4GQholfUef9KhGrUuCZ3UrLCvBQ'
    const url = 'https://script.google.com/macros/s/' + ID + '/exec'
    const request = '?action=obtenerDescarte'
    const response = await net.fetch(url + request)
    const descarte = await response.json()

    let inventarioJSON = fs.readFileSync('./inventario.json')
    let inventario = JSON.parse(inventarioJSON)

    // se guarda el descarte en el inventario
    if (typeof descarte === 'object') {
      Object.keys(descarte).map((enf) => {
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

        inventarioJSON = JSON.stringify(inventario)
        fs.writeFileSync('./inventario.json', inventarioJSON)
      })

      //console.log(inventario)
    }

    //Se obtiene los datos para mostrar en la tabla
    inventarioJSON = fs.readFileSync('./inventario.json')
    inventario = JSON.parse(inventarioJSON)
    let descarteObj = {}

    Object.keys(inventario).map((item) => {
      if (
        item !== 'enf' ||
        item !== 'ENF-vaciando' ||
        item !== 'idVaciado' ||
        item !== 'idDirectoNacional' ||
        item !== 'historialVaciado'
      ) {
        if (
          inventario[item].hasOwnProperty('descarteLavado') ||
          inventario[item].hasOwnProperty('descarteEncerado')
        ) {
          if (
            !(
              inventario[item]['descarteLavado']['descarteGeneral'] === 0 &&
              inventario[item]['descarteLavado']['pareja'] === 0 &&
              inventario[item]['descarteLavado']['balin'] === 0 &&
              inventario[item]['descarteEncerado']['descarteGeneral'] === 0 &&
              inventario[item]['descarteEncerado']['pareja'] === 0 &&
              inventario[item]['descarteEncerado']['balin'] === 0 &&
              inventario[item]['descarteEncerado']['extra'] === 0
            )
          ) {
            descarteObj[item] = {}
            descarteObj[item]['nombre'] = inventario[item]['nombre']
            descarteObj[item]['tipoFruta'] = inventario[item]['tipoFruta']
            descarteObj[item]['descarteLavado'] = inventario[item]['descarteLavado']
            descarteObj[item]['descarteEncerado'] = inventario[item]['descarteEncerado']
          }
        }
      }
    })
    console.log(descarteObj)
    return descarteObj
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})

ipcMain.handle('obtenerHistorialDirectoNacional', async () => {
  return infoHistorialDirectoNacional
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
  try {
    let ID = 'AKfycbze4iDi5-wZeS0om1f17To1pYLzvzP4aA3V2HiNAqJmKLAvOtbn9DiIHwGqOqUsrfoAwQ'
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
        'ENF-' +
        fecha.getFullYear().toString().slice(-2) +
        String(fecha.getMonth() + 1).padStart(2, '0') +
        datos.enf

      try {
        let inventarioJSON = fs.readFileSync('./inventario.json')
        let inventario = JSON.parse(inventarioJSON)

        if (!inventario.hasOwnProperty(datos.enf)) {
          inventario[codigoENF] = {}
        }

        inventario[codigoENF]
        inventario[codigoENF]['inventario'] = datos.canastillas
        inventario[codigoENF]['canastillas'] = datos.canastillas
        inventario[codigoENF]['kilos'] = datos.kilos
        inventario[codigoENF]['nombre'] = datos.nombre
        inventario[codigoENF]['tipoFruta'] = datos.tipoFruta
        inventario[codigoENF]['observaciones'] = datos.observaciones
        inventario[codigoENF]['fecha'] = fecha

        inventario['enf'] += 1

        // console.log(inventario)
        inventarioJSON = JSON.stringify(inventario)
        fs.writeFileSync('./inventario.json', inventarioJSON)
      } catch (e) {
        console.log(`${e.name}: ${e.message}`)
        let inventario = {}
        inventario['enf'] = 0
        inventario['idVaciado'] = 0
        inventario['idDirectoNacional'] = 0

        fs.writeFileSync('./inventario.json', inventario)
        console.log('Data saved')
      }
    }
    return responseGuardarLote
  } catch (e) {
    console.error(e)
  }
})

//funcion para vaciar canastillas
ipcMain.handle('vaciarLote', async (event, datos) => {
  let ID = 'AKfycbzXGeZQdWCSt5VYJYJU1bBJ7aLGJOTWJbiTusSLJK54u9Zlr9q3RDd-Ay5AUhJsjY5e7g'
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
      let inventarioJSON = fs.readFileSync('./inventario.json')
      let inventario = JSON.parse(inventarioJSON)

      //console.log(inventario)

      inventario['ENF-vaciando'] = datos.enf
      inventario[datos.enf]['inventario'] -= datos.canastillas

      if (!inventario.hasOwnProperty('historialVaciado')) {
        inventario['historialVaciado'] = {}
      }
      inventario['historialVaciado'][inventario['idVaciado']] = {}
      inventario['historialVaciado'][inventario['idVaciado']]['enf'] = datos.enf
      inventario['historialVaciado'][inventario['idVaciado']]['canastillas'] = datos.canastillas
      inventario['historialVaciado'][inventario['idVaciado']]['kilos'] =
        datos.canastillas * (inventario[datos.enf]['kilos'] / inventario[datos.enf]['canastillas'])
      inventario['historialVaciado'][inventario['idVaciado']]['fecha'] = new Date()
      inventario['idVaciado'] += 1

      //console.log(inventario)

      inventarioJSON = JSON.stringify(inventario)
      fs.writeFileSync('./inventario.json', inventarioJSON)
      console.log('Data saved')
    }

    return responseGuardarLote
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})

//funcion para directo nacional
ipcMain.handle('directoNacional', async (event, datos) => {
  const response = await net.fetch(linkObj.recepcion, {
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
  const responseGuardarLote = await response.json()
  return responseGuardarLote
})

//funcion para desverdizado
ipcMain.handle('desverdizado', async (event, datos) => {
  const response = await net.fetch(linkObj.recepcion, {
    method: 'POST',
    body: JSON.stringify({
      action: 'desverdizado',
      canastillas: datos.canastillas,
      enf: datos.enf
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
  const responseGuardarLote = await response.json()
  return responseGuardarLote
})

//funcion para modificar el historial

ipcMain.handle('modificarHistorial', async (event, datos) => {
  let ID = 'AKfycbwTnPSF89F_GKwqNRmyjJRdT8KXS_o3RWP7Ay5pHJMsRvbbGNyjhNf4QIdXj9Xhph61'
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
      let inventarioJSON = fs.readFileSync('./inventario.json')
      let inventario = JSON.parse(inventarioJSON)

      inventario[datos.enf]['inventario'] += Number(datos.canastillas)
      inventario['historialVaciado'][datos.id]['canastillas'] -= datos.canastillas
      inventario['historialVaciado'][datos.id]['modificado'] = datos.canastillas
      inventario['historialVaciado'][datos.id]['kilos'] =
        inventario['historialVaciado'][datos.id]['canastillas'] *
        (inventario[datos.enf]['kilos'] / inventario[datos.enf]['canastillas'])
      //console.log(inventario);
      inventarioJSON = JSON.stringify(inventario)
      fs.writeFileSync('./inventario.json', inventarioJSON)
    }
    return responseModificarLote
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})
//funcion para enviar la fruta en el inventario de descarte

ipcMain.handle('eliminarFrutaDescarte', async (event, datos) => {
  try {
    let ID = "AKfycbyZTBrl5SZwpV4W0cPJsSRbWwNHuUB05a_982z1woO1ioR2duQAe7B_DdTLBuHaQ2Bruw"
    let url = "https://script.google.com/macros/s/"+ID+"/exec"

    const response = await net.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'eliminarFrutaDescarte',
        objEnf: datos
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    const responseEliminarDescarte = await response.json()

    if (responseEliminarDescarte === 'Enviado con exito') {
      let inventarioJSON = fs.readFileSync('./inventario.json')
      let inventario = JSON.parse(inventarioJSON)

      Object.keys(datos).map((item) => {
        let [enf, descarte, tipoDescarte] = item.split('/')
       // console.log(enf)
        inventario[enf][descarte][tipoDescarte] -= datos[item]
      })

      inventarioJSON = JSON.stringify(inventario)
      fs.writeFileSync('./inventario.json', inventarioJSON)
    }
    return responseEliminarDescarte
  } catch (e) {
    console.error(`${e.name}: ${e.message}`)
    return `${e.name}: ${e.message}`
  }
})
//funcion para modificar el historial de directo nacional

ipcMain.handle('modificarHistorialDirectoNacional', async (event, datos) => {
  const response = await net.fetch(linkObj.recepcion, {
    method: 'POST',
    body: JSON.stringify({
      action: 'modificarHistorialDirectoNacional',
      objEnf: datos
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
  const responseGuardarLote = await response.json()
  return responseGuardarLote
})
