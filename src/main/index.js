import { app, shell, BrowserWindow, ipcMain, Menu, Notification } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater, AppUpdater } from 'electron-updater'
import os from 'os'
import { resolve } from 'node:path'
import { Worker, isMainThread } from 'node:worker_threads'
const fs = require('fs')
const { mainMenu } = require('./menuMaker')
import icon from '../../resources/icon.png?asset'
import {
  actualizarDescarte,
  eliminarInventarioDescarte,
  fetchFunction,
  functionObtenerDescarte,
  guardarDesverdizado,
  guardarHistorialDescarte,
  guardarHistorialDirectoNacional,
  guardarHistorialVaciado,
  guardarIDs,
  guardarInventario,
  logInProcess,
  obtenerClientes,
  obtenerDesverdizado,
  obtenerENF,
  obtenerHistorialDescarte,
  obtenerHistorialDirectoNacional,
  obtenerHistorialVaciado,
  obtenerIDs,
  obtenerIdCelifrut,
  obtenerInventario,
  obtenerProveedores
} from './functions'
import { info } from 'console'

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

const _cuentas = 'admin'
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
  await obtenerENF()
  await obtenerIdCelifrut()

  if (!fs.existsSync(join(__dirname, '../../../../../data'))) {
    fs.mkdirSync(join(__dirname, '../../../../../data'))
  }
  //se crearan carpetas diferentes cada mes
  // let fecha = new Date();
  // let year = fecha.getFullYear().toString();
  // let month = String(Number(fecha.getMonth()) + 1)
  // let path = "../../../../../data/" + month + year + "carpeta"

  // if(!fs.existsSync(join(__dirname, path))) {

  //   fs.mkdirSync(join(__dirname, path))
  // }
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
  const inventario = await obtenerInventario()
  const proveedores = await obtenerProveedores()

  let objFrutaActual = {}

  if (Object.keys(inventario).length !== 0) {
    Object.keys(inventario).forEach((item) => {
      if (inventario[item].hasOwnProperty('inventario') && inventario[item]['inventario'] > 0) {
        objFrutaActual[item] = {
          ICA: proveedores[inventario[item]['nombre']]['ICA'],
          nombre: inventario[item]['nombre'],
          fecha: inventario[item]['fecha'],
          inventario: inventario[item]['inventario'],
          observaciones: inventario[item]['observaciones'],
          tipoFruta: inventario[item]['tipoFruta'],
          KilosActual:
            (inventario[item]['kilos'] / inventario[item]['canastillas']) *
            inventario[item]['inventario']
        }
      }
    })
  }

  return objFrutaActual
})
//funcion para obtener el historial de vaciado
ipcMain.handle('obtenerHistorialProceso', async () => {
  try {
    const historialVaciado = await obtenerHistorialVaciado()
    const inventario = await obtenerInventario()
    const enf = await obtenerIDs()

    let datos = {}
    let id = enf.idVaciado
    let rango = Math.max(0, id - 200)

    for (let i = id - 1; i >= rango; i--) {
      datos[i] = {
        enf: historialVaciado[i]['enf'],
        nombre: inventario[historialVaciado[i]['enf']]['nombre'],
        canastillas: historialVaciado[i]['canastillas'],
        kilos: historialVaciado[i]['kilos'],
        tipoFruta: inventario[historialVaciado[i]['enf']]['tipoFruta'],
        fecha: historialVaciado[i]['fecha']
      }
    }

    return datos
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})
//funcion para obtener el descarte de la base de datos local en el inventario
ipcMain.handle('obtenerDescarte', async () => {
  try {
    const inventario = await obtenerInventario()
    const descarteObj = await functionObtenerDescarte(inventario)
    return descarteObj
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})
//funcion para obtener el descarte en el inventario
ipcMain.handle('actualizarDescarte', async () => {
  try {
    const descarte = await actualizarDescarte()
    console.log(descarte)
    const inventario = await obtenerInventario()

    // se guarda el descarte en el inventario
    if (typeof descarte === 'object') {
      Object.keys(descarte).forEach((enf) => {
        if (
          !inventario[enf].hasOwnProperty('descarteLavado') ||
          !inventario[enf].hasOwnProperty('descarteEncerado')
        ) {
          inventario[enf]['descarteLavado'] = {}
          inventario[enf]['descarteEncerado'] = {}
        }

        inventario[enf]['descarteLavado'] = descarte[enf]['descarteLavado']
        inventario[enf]['descarteEncerado'] = descarte[enf]['descarteEncerado']
        inventario[enf]['tipoFruta'] = descarte[enf]['tipoFruta']
      })
    }

    let descarteObj = await functionObtenerDescarte(inventario)
    await guardarInventario(inventario)
    return descarteObj
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})
//funcion para obtener el historial de directo nacional
ipcMain.handle('obtenerHistorialDirectoNacional', async () => {
  try {
    const historialDirectoNacional = await obtenerHistorialDirectoNacional()
    const inventario = await obtenerInventario()
    const enf = await obtenerIDs()

    let datos = {}
    let id = enf.idDirectoNacional
    let rango = Math.max(0, id - 200)

    for (let i = id - 1; i >= rango; i--) {
      datos[i] = {
        enf: historialDirectoNacional[i]['enf'],
        nombre: inventario[historialDirectoNacional[i]['enf']]['nombre'],
        canastillas: historialDirectoNacional[i]['canastillas'],
        kilos: historialDirectoNacional[i]['kilos'],
        tipoFruta: inventario[historialDirectoNacional[i]['enf']]['tipoFruta'],
        fecha: historialDirectoNacional[i]['fecha']
      }
    }

    return datos
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
})
//funcion para obtener la fruta sin procesar
ipcMain.handle('obtenerFrutaDesverdizando', async () => {
  const inventario = await obtenerInventario()
  const desverdizado = await obtenerDesverdizado()

  let objDesverdizando = {}

  Object.keys(desverdizado).forEach((enf) => {
    if (desverdizado[enf]['desverdizando'] === true) {
      objDesverdizando[enf] = {
        nombre: inventario[enf]['nombre'],
        ...desverdizado[enf]
      }
    }
  })

  return objDesverdizando
})
ipcMain.handle('obtenerClientes', async () => {
  try {
    const clientes = await obtenerClientes()
    return clientes
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})

// funcion que hace fetch de los datos
const server = async () => {
  try {
      // This re-loads the current file inside a Worker instance.
      const worker = new Worker(resolve(__dirname, './worker.js'), {})
      worker.once('message', (data) => {
        console.log(data)
      });
  } catch (e) {
    console.log(e)
  }
}
server();

//Se guarda data en la nube
setInterval(async () => {
  try {
    // This re-loads the current file inside a Worker instance.
    const nombreDelEquipo = os.hostname();
    const inventario = await obtenerInventario()
    const data = [nombreDelEquipo, inventario]
    let response = await fetchFunction('uploadAppData', data)
    console.log(response)

  } catch (e) {
    console.log(e)
  }
}, 10_400_000);

//funcion para guardar un nuevo lote
ipcMain.handle('guardarLote', async (event, datos) => {
  try {
    const responseGuardarLote = await fetchFunction('ingresarLote', datos)
    if (responseGuardarLote === 'Guardado con exito') {
      const fecha = new Date()
      const codigoENF =
        'EF1-' +
        fecha.getFullYear().toString().slice(-2) +
        String(fecha.getMonth() + 1).padStart(2, '0') +
        datos.enf

      const enf = await obtenerIDs()
      const inventario = await obtenerInventario()

      inventario[codigoENF] = {
        inventario: datos.canastillas,
        canastillas: datos.canastillas,
        kilos: datos.kilos,
        nombre: datos.nombre,
        tipoFruta: datos.tipoFruta,
        observaciones: datos.observaciones,
        fecha: fecha
      }

      enf.enf += 1

      await guardarInventario(inventario)
      await guardarIDs(enf)
    }
    return responseGuardarLote
  } catch (e) {
    console.error(e)
  }
})
//funcion para vaciar canastillas
ipcMain.handle('vaciarLote', async (event, datos) => {
  try {
    const responseGuardarLote = await fetchFunction('vaciarLote', datos)
    if (responseGuardarLote === 200) {
      const inventario = await obtenerInventario()
      const enf = await obtenerIDs()
      const historialVaciado = await obtenerHistorialVaciado()

      enf['ENF-vaciando'] = datos.enf
      inventario[datos.enf]['inventario'] -= Number(datos.canastillas)

      historialVaciado[enf['idVaciado']] = {
        enf: datos.enf,
        canastillas: datos.canastillas,
        kilos:
          datos.canastillas *
          (inventario[datos.enf]['kilos'] / inventario[datos.enf]['canastillas']),
        fecha: new Date()
      }

      enf['idVaciado'] += 1

      await guardarInventario(inventario)
      await guardarIDs(enf)
      await guardarHistorialVaciado(historialVaciado)
    } else if (responseGuardarLote === 401) {
      return 'No se ha terminado de vacear el lote anterior'
    }
    return responseGuardarLote
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})
//funcion para directo nacional
ipcMain.handle('directoNacional', async (event, datos) => {
  try {
    const responseDirectoNacional = await fetchFunction('directoNacional', datos)

    if (responseDirectoNacional === 'Directo nacional con exito') {
      const [inventario, enf, historialDirectoNacional] = await Promise.all([
        obtenerInventario(),
        obtenerIDs(),
        obtenerHistorialDirectoNacional()
      ])
      inventario[datos.enf]['inventario'] -= Number(datos.canastillas)
      historialDirectoNacional[enf['idDirectoNacional']] = {
        enf: datos.enf,
        canastillas: datos.canastillas,
        kilos:
          datos.canastillas *
          (inventario[datos.enf]['kilos'] / inventario[datos.enf]['canastillas']),
        fecha: new Date()
      }
      enf['idDirectoNacional'] += 1
      await Promise.all([
        guardarInventario(inventario),
        guardarIDs(enf),
        guardarHistorialDirectoNacional(historialDirectoNacional)
      ])
    }
    return responseDirectoNacional
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
    return `${e.name}: ${e.message}`
  }
})
//funcion para desverdizado
ipcMain.handle('desverdizado', async (event, datos) => {
  try {
    const response = await fetchFunction('desverdizado', datos)
    console.log(response)
    console.log(datos)
    if (response === 'Lote' + datos.enf + 'Ingreado a desverdizado') {
      const [inventario, inventarioDesverdizado] = await Promise.all([
        obtenerInventario(),
        obtenerDesverdizado()
      ])

      inventario[datos.enf]['inventario'] -= Number(datos.canastillas)

      if (!inventarioDesverdizado.hasOwnProperty(datos.enf)) {
        inventarioDesverdizado[datos.enf] = {
          canastillasIngreso: 0,
          kilosIngreso: 0,
          cuartoDesverdizado: ''
        }
      }

      inventarioDesverdizado[datos.enf]['canastillasIngreso'] += Number(datos.canastillas)
      inventarioDesverdizado[datos.enf]['kilosIngreso'] +=
        datos.canastillas * (inventario[datos.enf]['kilos'] / inventario[datos.enf]['canastillas'])
      inventarioDesverdizado[datos.enf]['fechaIngreso'] = new Date()
      inventarioDesverdizado[datos.enf]['desverdizando'] = true
      inventarioDesverdizado[datos.enf]['cuartoDesverdizado'] += datos.cuartoDesverdizado + ' '

      await Promise.all([
        guardarInventario(inventario),
        guardarDesverdizado(inventarioDesverdizado)
      ])
    }

    return response
  } catch (e) {
    console.error(`${e.name}: ${e.message}`)
    return `${e.name}: ${e.message}`
  }
})
//funcion para modificar el historial
ipcMain.handle('modificarHistorial', async (event, datos) => {
  try {
    console.log(datos)
    const response = await fetchFunction('modificarHistorial', datos)
    if (response === 200) {
      const [inventario, historialVaciado] = await Promise.all([
        obtenerInventario(),
        obtenerHistorialVaciado()
      ])

      inventario[datos.enf]['inventario'] += Number(datos.canastillas)
      historialVaciado[datos.id]['canastillas'] -= datos.canastillas
      historialVaciado[datos.id]['modificado'] = datos.canastillas
      historialVaciado[datos.id]['kilos'] =
        historialVaciado[datos.id]['canastillas'] *
        (inventario[datos.enf]['kilos'] / inventario[datos.enf]['canastillas'])

      await Promise.all([guardarInventario(inventario), guardarHistorialVaciado(historialVaciado)])
    }
    return response
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})
//funcion para enviar la fruta en el inventario de descarte
ipcMain.handle('eliminarFrutaDescarte', async (event, datos) => {
  try {
    const response = await fetchFunction('eliminarFrutaDescarte', datos[0])
    if (response === 200) {
      const [inventario, ids, historialDescarte] = await Promise.all([
        obtenerInventario(),
        obtenerIDs(),
        obtenerHistorialDescarte()
      ])

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

      await Promise.all([
        guardarInventario(inventario),
        guardarIDs(ids),
        guardarHistorialDescarte(historialDescarte)
      ])
    }
    return response
  } catch (e) {
    console.error(`${e.name}: ${e.message}`)
    return `${e.name}: ${e.message}`
  }
})
//funcion para modificar el historial de directo nacional
ipcMain.handle('modificarHistorialDirectoNacional', async (event, datos) => {
  try {
    const response = await fetchFunction('modificarHistorialDirecto', datos)

    if (response === 200) {
      const [inventario, historialDirectoNacional] = await Promise.all([
        obtenerInventario(),
        obtenerHistorialDirectoNacional()
      ])

      inventario[datos.enf]['inventario'] += Number(datos.canastillas)
      historialDirectoNacional[datos.id]['canastillas'] -= datos.canastillas
      historialDirectoNacional[datos.id]['modificado'] = datos.canastillas
      historialDirectoNacional[datos.id]['kilos'] =
        historialDirectoNacional[datos.id]['canastillas'] *
        (inventario[datos.enf]['kilos'] / inventario[datos.enf]['canastillas'])
      //console.log(inventario);

      await Promise.all([
        guardarInventario(inventario),
        guardarHistorialDirectoNacional(historialDirectoNacional)
      ])
    }
    return response
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})

ipcMain.handle('finalizarDesverdizado', async (event, datos) => {
  try {
    const response = await fetchFunction('finalizarDesverdizado', datos)
    if (response === 200) {
      const inventarioDesverdizado = await obtenerDesverdizado()
      inventarioDesverdizado[datos.enf]['fechaFinalizado'] = new Date()
      await guardarDesverdizado(inventarioDesverdizado)
    }
    return response
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})

ipcMain.handle('setParametrosDesverdizado', async (event, datos) => {
  try {
    const response = await fetchFunction('setParametrosDesverdizado', datos)
    if (response === 200) {
      const inventarioDesverdizado = await obtenerDesverdizado()

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

      await guardarDesverdizado(inventarioDesverdizado)
    }
    return response
  } catch (e) {
    console.log(`${e.name}:${e.message}`)
    return `${e.name}:${e.message}`
  }
})

ipcMain.handle('procesarDesverdizado', async (event, datos) => {
  try {
    const response = await fetchFunction('procesarDesverdizado', datos)

    if (response === 200) {
      const inventarioDesverdizado = await obtenerDesverdizado()

      if (inventarioDesverdizado[datos.enf]['canastillasIngreso'] - datos.canastillas === 0) {
        inventarioDesverdizado[datos.enf]['desverdizando'] = false
      }
      await guardarDesverdizado(inventarioDesverdizado)
    }
    return response
  } catch (e) {
    return `${e.name}: ${e.message}`
  }
})

ipcMain.handle('reprocesarDescarteUnPredio', async (event, datos) => {
  try {
    const response = fetchFunction('reprocesarDescarteUnPredio', datos)
    if (response === 200) {
      let keys = Object.keys(datos)
      let [enf, descarte, tipoDescarte] = keys[0].split('/')

      const [inventario, ids, historialDescarte] = await Promise.all([
        obtenerInventario(),
        obtenerIDs(),
        obtenerHistorialDescarte()
      ])

      historialDescarte[ids['idHistorialDescarte']] = {}

      Object.keys(datos).forEach((item) => {
        let [enf, descarte, tipoDescarte] = item.split('/')
        historialDescarte[ids['idHistorialDescarte']][enf] = {
          descarteLavado: {},
          descarteEncerado: {}
        }
      })

      Object.keys(datos).forEach((item) => {
        let [enf, descarte, tipoDescarte] = item.split('/')
        // console.log(enf)
        inventario[enf][descarte][tipoDescarte] -= datos[item]
        historialDescarte[ids['idHistorialDescarte']][enf][descarte][tipoDescarte] = datos[item]
      })

      ids['idHistorialDescarte'] += 1

      await Promise.all([
        guardarInventario(inventario),
        guardarIDs(ids),
        guardarHistorialDescarte(historialDescarte)
      ])
    }
    return fetchResponse
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})

ipcMain.handle('ReprocesarDescarteCelifrut', async (event, datos) => {
  try {
    //funcion que hace el fecth
    const ids = await obtenerIDs()
    const vec = [datos, ids['idCelifrut']]
    const response = await fetchFunction('ReprocesarDescarteCelifrut', vec)
    console.log(response)

    if (response === 200) {
      //se leen los archivos json
      const [inventario, historialDescarte] = await Promise.all([
        obtenerInventario(),
        obtenerHistorialDescarte()
      ])
      // se agrega los datos al historiald de descarte
      historialDescarte[ids['idHistorialDescarte']] = {}

      //se crean los objetos que tendran los datos del historiald e vaciado
      Object.keys(datos).forEach((item) => {
        let [enf, descarte, tipoDescarte] = item.split('/')
        historialDescarte[ids['idHistorialDescarte']][enf] = {
          descarteLavado: {},
          descarteEncerado: {}
        }
      })

      // se elimina la fruta del inventario y se mete en el historial
      Object.keys(datos).forEach((item) => {
        let [enf, descarte, tipoDescarte] = item.split('/')
        // console.log(enf)
        inventario[enf][descarte][tipoDescarte] -= datos[item]
        historialDescarte[ids['idHistorialDescarte']][enf][descarte][tipoDescarte] = datos[item]
      })

      //se crea en el inventario el item correspondiente a celifrut
      inventario['Celifrut-' + ids.idCelifrut] = { fecha: new Date() }

      // se suma el id del historial descarte
      ids['idHistorialDescarte'] += 1
      ids['idCelifrut'] += 1

      await Promise.all([
        guardarInventario(inventario),
        guardarIDs(ids),
        guardarHistorialDescarte(historialDescarte)
      ])

      return 200
    }
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})

ipcMain.handle('crearContenedor', async (event, datos) => {
  try {
    console.log(datos)
    const response = await fetchFunction('crearContenedor', datos)
    console.log(response)
    return response
  } catch (e) {
    console.log(e)
    return e
  }
})

ipcMain.handle('logIn', async (event, datos) => {
  try {
    const response = await logInProcess(datos)
    return response
  } catch (e) {
    return `${e.name}:${e.message}`
  }
})
