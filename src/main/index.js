import { app, shell, BrowserWindow, ipcMain, Menu, Notification } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater, AppUpdater } from 'electron-updater'
import { io } from 'socket.io-client'
const fs = require('fs')
const { mainMenu } = require('./menuMaker')
//import icon from '../../resources/icon.png?asset'

import icon from '../renderer/src/assets/CELIFRUT.jpg'

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    icon: icon,
    show: false,
    autoHideMenuBar: false,

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

  socket.on('descartesInfo', (data) => {
    console.log(data)
    if (data.status === 200) mainWindow.webContents.send('descartes', data.data)
    else console.log('error')
  })
  socket.on('listaEmpaqueInfo', (data) => {
    console.log("no entiendo ")
    console.log(data)
    if (data.status === 200) mainWindow.webContents.send('listaEmpaqueInfo', data)
    else console.log('error')
  })
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

const socket = io('ws://192.168.0.172:3000/', {
  rejectUnauthorized: false
})
//la funcion que loguea la cuenta
ipcMain.handle('logIn', async (event, datos) => {
  try {
    const request = { data: datos, id: socket.id }
    const user = await new Promise((resolve, reject) => {
      socket.emit('logIn', request, (response) => {
        if (typeof response === 'object') {
          resolve(response)
        } else {
          resolve({ status: 400, user: '', permisos: [] })
        }
      })
    })
    return user
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})

// funcion encargada para enviar y recibir los datos de ingreso de fruta
ipcMain.handle('ingresoFruta', async (event, data) => {
  try {
    console.log(data)
    const request = { data: data, id: socket.id }
    const response = await new Promise((resolve, reject) => {
      socket.emit('celifrutListen', request, (serverResponse) => {
        if (typeof serverResponse === 'object') {
          resolve(serverResponse)
        } else {
          resolve({ status: 400 })
        }
      })
    })
    console.log(response)
    return response
  } catch (e) {
    console.log(`${e.name}:${e.message}`)
  }
})
//seccion inventario
ipcMain.handle('inventario', async (event, data) => {
  try {
    const request = { data: data, id: socket.id }
    console.log(request)
    const response = await new Promise((resolve, reject) => {
      socket.emit('celifrutListen', request, (serverResponse) => {
        if (typeof serverResponse === 'object') {
          resolve(serverResponse)
        } else {
          resolve({ status: 400 })
        }
      })
    })
    console.log(response)
    return response
  } catch (e) {
    return { status: 400 }
  }
})

// funcion encargada para enviar y tecibir los datos del area de contenedores
ipcMain.handle('contenedores', async (event, data) => {
  try {
    const request = { data: data, id: socket.id }
    console.log(request)
    const response = await new Promise((resolve, reject) => {
      socket.emit('contenedoresService', request, (serverResponse) => {
        if (typeof serverResponse === 'object') {
          resolve(serverResponse)
        } else {
          resolve({ status: 400 })
        }
      })
    })
    console.log(response)
    return response
  } catch (e) {
    return { status: 400 }
  }
})

// funcion encargada para enviar y tecibir los datos del area de calidad
ipcMain.handle('calidad', async (event, data) => {
  try {
    const request = { data: data, id: socket.id }
    console.log(request)
    const response = await new Promise((resolve, reject) => {
      socket.emit('calidad', request, (serverResponse) => {
        if (typeof serverResponse === 'object') {
          resolve(serverResponse)
        } else {
          resolve({ status: 400 })
        }
      })
    })
    console.log(response)
    return response
  } catch (e) {
    return { status: 400 }
  }
})

// const socket = io('ws://localhost:3000/',{
//   rejectUnauthorized: false,
// });

socket.on('serverResponse', async (data) => {
  try {
    console.log(data)
    if (data.status === 401) return data.data
    const response = await server[data.action](data.data)
  } catch (e) {
    return { status: 401, message: e.message }
  }
})

