import { app, shell, BrowserWindow, ipcMain, Menu, Notification } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater, AppUpdater } from 'electron-updater'
import { io } from 'socket.io-client'
const fs = require('fs')
const { mainMenu } = require('./menuMaker')
import icon from '../../resources/icon.png?asset'
import {
  guardarIDs,
  logInProcess,
  obtenerClientes,
  obtenerIDs,
  obtenerListaEmpaque,
  obtenerProveedores
} from './functions'


//globals
let frutaActual = {}
let historialProceso = {}
let historialDirectoNacional = {}
let frutaDesverdizando = {}
let descarteInventario = {}
let historialDescarte = {}
let lotesCalidadInterna = {}
let clasificacionCalidad = {}

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

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
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      contextIsolation: false
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
  electronApp.setAppUserModelId('com.electronRecepcionApp')

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
  autoUpdater.checkForUpdates()

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

autoUpdater.on('error', (info) => {
  new Notification({
    title: 'Error',
    body: info.message
  }).show()
})

autoUpdater.on('update-available', (info) => {
  new Notification({
    title: 'update',
    body: info.stagingPercentage
  }).show()
  let pth = autoUpdater.downloadUpdate()
  new Notification({
    title: 'descargando',
    body: pth
  }).show()
})

autoUpdater.on('update-not-available', (info) => {
  new Notification({
    title: 'no avaiable',
    body: info.version
  }).show()
})

/*Download Completion Message*/
autoUpdater.on('update-downloaded', (info) => {
  new Notification({
    title: 'update downloaded',
    body: info.downloadedFile
  }).show()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

//funcion para obtener el nombre de los predios
ipcMain.handle('obtenerPredios', async () => {
  try {
    const proveedores = await obtenerProveedores()
    const ids = await obtenerIDs()
    return { predios: proveedores, enf: ids.enf }
  } catch (e) {
    console.error(`${e.name}: ${e.message}`)
  }
})
//funcion para obtener la fruta sin procesar
ipcMain.handle('obtenerFrutaActual', async () => {
  try {
    return frutaActual
  } catch (e) {
    console.log(e.message)
  }
})
//funcion para obtener la fruta sin procesar
ipcMain.handle('reqObtenerFrutaActual', async () => {
  try {
    socket.emit('obtenerFrutaActual', 200)
    return frutaActual
  } catch (e) {
    console.log(e.message)
  }
})
//funcion para obtener el historial de vaciado
ipcMain.handle('reqObtenerHistorialProceso', async () => {
  try {
    socket.emit('obtenerHistorialProceso')
    return historialProceso
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})
ipcMain.handle('obtenerHistorialProceso', async () => {
  try {
    return historialProceso
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})
//funcion para obtener el historial de directo nacional
ipcMain.handle('reqObtenerHistorialDirectoNacional', async () => {
  try {
    socket.emit('obtenerHistorialDirectoNacional')
    return historialDirectoNacional
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})
ipcMain.handle('obtenerHistorialDirectoNacional', async () => {
  try {
    return historialDirectoNacional
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})
//funcion para obtener la fruta sin procesar
ipcMain.handle('reqObtenerFrutaDesverdizando', async () => {
  try {
    socket.emit('obtenerFrutaDesverdizado')
    return frutaDesverdizando
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})
ipcMain.handle('obtenerFrutaDesverdizando', async () => {
  try {
    return frutaDesverdizando
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})
//funcion para obtener el descarte de la base de datos local en el inventario
ipcMain.handle('reqObtenerDescarte', async () => {
  try {
    socket.emit('obtenerDescarte')
    return descarteInventario
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})
ipcMain.handle('obtenerDescarte', async () => {
  try {
    return descarteInventario
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})
//funcion que envia al front la informacion de los clientes
ipcMain.handle('obtenerClientes', async () => {
  try {
    const clientes = await obtenerClientes()
    return clientes
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})
//funcion que envia al front los datos del descarte que se ha procesado
ipcMain.handle('obtenerHistorialDescarte', async () => {
  try {
    return historialDescarte
  } catch (e) {
    console.log(`${e.name}:${e.message}`)
    return `${e.name}:${e.message}`
  }
})
ipcMain.handle('reqObtenerHistorialDescarte', async () => {
  try {
    socket.emit('obtenerHistorialDescarte')
    return historialDescarte
  } catch (e) {
    console.log(`${e.name}:${e.message}`)
    return `${e.name}:${e.message}`
  }
})

//funcion que envia los lotes que aun no tienen la calidad interna
ipcMain.handle('obtenerLotesCalidadInterna', async () => {
  try {
    socket.emit('obtenerLotesCalidadInterna')
    return lotesCalidadInterna
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})
ipcMain.handle('lotesCalidadInterna', async () => {
  try {
    return lotesCalidadInterna
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})
//funciones que envian los lotes que hay pendientes para clasificacion de calidad
ipcMain.handle('obtenerLotesClasificacionCalidad', async () => {
  try {
    socket.emit('obtenerClasificacionCalidad')
    return clasificacionCalidad
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})
ipcMain.handle('lotesClasificacionCalidad', async () => {
  try {
    return clasificacionCalidad
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})
//funcion que obtiene los contenedores que se estan llenando
ipcMain.handle('obtenerContenedoresListaEmpaque', async () => {
  try {
    const listaEmpaque = await obtenerListaEmpaque()
    return listaEmpaque
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})



const socket = io('ws://192.168.0.168:3000/')

socket.on('frutaActual', (data) => {
  frutaActual = data
})

socket.on('loteVaciando', (data) => {
  console.log(data)
})

socket.on('historialProceso', (data) => {
  historialProceso = data
})

socket.on('historialDirectoNacional', (data) => {
  historialDirectoNacional = data
})

socket.on('frutaDesverdizando', (data) => {
  frutaDesverdizando = data
})

socket.on('descarteInventario', (data) => {
  descarteInventario = data
})

socket.on('historialDescarte', (data) => {
  historialDescarte = data
})

socket.on('lotesCalidadInterna', (data) => {
  lotesCalidadInterna = data
})

socket.on('lotesClasificacionCalidad', (data) => {
  console.log(data)
  clasificacionCalidad = data
})


//funcion para guardar un nuevo lote
ipcMain.handle('guardarLote', async (event, datos) => {
  try {
    socket.emit('guardarLote', datos)
    const ids = await obtenerIDs()
    ids.enf += 1

    await guardarIDs(ids)
    return 200
  } catch (e) {
    console.error(e)
  }
})
//funcion para vaciar canastillas
ipcMain.handle('vaciarLote', async (event, datos) => {
  try {
    socket.emit('vaciarLote', datos)
    return 200
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})
//funcion para directo nacional
ipcMain.handle('directoNacional', async (event, datos) => {
  try {
    socket.emit('directoNacional', datos)
    return 200
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
    return `${e.name}: ${e.message}`
  }
})
//funcion para desverdizado
ipcMain.handle('desverdizado', async (event, datos) => {
  try {
    socket.emit('desverdizado', datos)
    return 200
  } catch (e) {
    console.error(`${e.name}: ${e.message}`)
    return `${e.name}: ${e.message}`
  }
})
//funcion para modificar el historial
ipcMain.handle('modificarHistorial', async (event, datos) => {
  try {
    socket.emit('modificarHistorialVaciado', datos)
    return 200
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})
//funcion para modificar el historial de directo nacional
ipcMain.handle('modificarHistorialDirectoNacional', async (event, datos) => {
  try {
    socket.emit('modificarHistorialDirectoNacional', datos)
    return 200
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})
//funcion que finaliza el desverdizado, es decir que pone la bandera de desverdizando en false
ipcMain.handle('finalizarDesverdizado', async (event, datos) => {
  try {
    socket.emit('finalizarDesverdizado', datos)
    return 200
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})
//funcion que guarda los datos de parametrizado
ipcMain.handle('setParametrosDesverdizado', async (event, datos) => {
  try {
    socket.emit('setParametrosDesverdizado', datos)
    return 200
  } catch (e) {
    console.log(`${e.name}:${e.message}`)
    return `${e.name}:${e.message}`
  }
})
//funcion que procesa la fruta en el inventario de desverdizado
ipcMain.handle('procesarDesverdizado', async (event, datos) => {
  try {
    socket.emit('procesarDesverdizado', datos)
    return 200
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})
//funcion que reprocesa solo un predio, cambiando la informacion del descarte del lote
ipcMain.handle('reprocesarDescarteUnPredio', async (event, datos) => {
  try {
    socket.emit('reprocesarDescarteUnPredio', datos)
    return 200
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})
//funcion para enviar la fruta en el inventario de descarte
ipcMain.handle('eliminarFrutaDescarte', async (event, datos) => {
  try {
    socket.emit('eliminarFrutaDescarte', datos)
    return 200
  } catch (e) {
    console.error(`${e.name}: ${e.message}`)
    return `${e.name}: ${e.message}`
  }
})
//funcion que reprocesa varios predios unidos
ipcMain.handle('ReprocesarDescarteCelifrut', async (event, datos) => {
  try {
    socket.emit('reprocesarDescarteCelifrut', datos)
    return 200
    //}
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})
//fncion que crea el contenedor
ipcMain.handle('crearContenedor', async (event, datos) => {
  try {
    socket.emit('crearContenedor', datos)
    return 200
  } catch (e) {
    console.log(e)
    return e
  }
})
//la funcion que loguea la cuenta
ipcMain.handle('logIn', async (event, datos) => {
  try {
    const [userLogin, permisos] = await logInProcess(datos)

    return permisos
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})
//guardar calidad interna
ipcMain.handle('guardarCalidadInterna', async (event, datos) => {
  try {
   socket.emit('guardarCalidadInterna', datos)
    return 200
  } catch (e) {
    console.log(`${e.name}:${e.message}`)
    return `${e.name}:${e.message}`
  }
})
//guarda la clasificacion calidad
ipcMain.handle('guardarClasificacionCalidad', (event, datos) => {
  try{
    socket.emit('guardarClasificacionCalidad', datos)
    return 200
  } catch(e) {
    console.log(e.message)
  }
})
