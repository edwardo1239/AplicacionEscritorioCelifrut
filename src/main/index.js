import { app, shell, BrowserWindow, net, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let linkObj = {}
let infoPredios
let infoFrutaActual
let infoHistorialVaciado
let infoDescarteInventario

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

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
  const response = await net.fetch(
    'https://script.google.com/macros/s/AKfycbyxbqQq58evRO8Hp5FE88TJPatYPc03coveFaBc9cFYYIii-j5I1tvxsUOQH7xfJ8KB/exec'
  )
  linkObj = await response.json()
  console.log(linkObj)
  await (async () => {
    try {
      const response = await net.fetch(linkObj.recepcion + '?action=recepcion')
      const predios = await response.json()
      infoPredios = predios
    } catch (e) {
      console.log(e)
    }
  })()
  await createWindow()

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
ipcMain.handle('obtenerPredios', async (event) => {
  return infoPredios
})

//funcion para obtener el historial de vaciado
ipcMain.handle('obtenerHistorialProceso', async (event) => {
  return infoHistorialVaciado
})

//funcion para obtener el descarte en el inventario
ipcMain.handle('obtenerDescarte', async (event) => {
  return infoDescarteInventario
})

//funcion para obtener la fruta sin procesar
ipcMain.handle('obtenerFrutaActual', async (event) => {
  return infoFrutaActual
})

//funcion que hace fetch de los datos
setInterval(async () => {
  try {
    if (Object.keys(linkObj).length === 0) {
      console.log('cargando...')
    } else {
      const response = await net.fetch(linkObj.recepcion + '?action=recepcion')
      const info = await response.json()
      infoPredios = info.predios
      infoFrutaActual = info.frutaActual
      infoHistorialVaciado = info.historialVaciado
      infoDescarteInventario = info.descarteInventario
      //console.log(infoDescarteInventario)
    }
  } catch (e) {
    console.log(e)
  }
}, 800)

//funcion para guardar un nuevo lote
ipcMain.handle('guardarLote', async (event, datos) => {
  const response = await net.fetch(linkObj.recepcion, {
    method: 'POST',
    body: JSON.stringify({
      action: 'ingresarLote',
      tipoFruta: datos.tipoFruta,
      nombre: datos.nombre,
      kilos: datos.kilos,
      placa: datos.placa,
      canastillas: datos.canastillas,
      observaciones: datos.observaciones
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
  const responseGuardarLote = await response.json()
  return responseGuardarLote
})

//funcion para vaciar canastillas
ipcMain.handle('vaciarLote', async (event, datos) => {
  const response = await net.fetch(linkObj.recepcion, {
    method: 'POST',
    body: JSON.stringify({
      action: 'vaciar',
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
  const response = await net.fetch(linkObj.recepcion, {
    method: 'POST',
    body: JSON.stringify({
      action: 'modificarHistorial',
      canastillas: datos.canastillas,
      enf: datos.enf,
      id: datos.id
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
  const responseGuardarLote = await response.json()
  return responseGuardarLote
})
//funcion para enviar la fruta en el inventario de descarte

ipcMain.handle('eliminarFrutaDescarte', async (event, datos) => {
  const response = await net.fetch(linkObj.recepcion, {
    method: 'POST',
    body: JSON.stringify({
      action: 'eliminarFrutaDescarte',
      objEnf: datos
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
  const responseGuardarLote = await response.json()
  return responseGuardarLote
})
