import { Menu, app } from 'electron'

const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
          ]
        }
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
            }
          ]
        : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
        : [{ role: 'close' }])
    ]
  },
  {
    label: 'Options',
    submenu: [
      {
        label: 'Actualizar Proveedores',
        click: async () => {
          const { net } = require('electron')
          const fs = require('fs')
          const url =
            'https://script.google.com/macros/s/AKfycbzNt3WjCm_4A0-KOotz3TfaMnYD4r4VRw_PBq1uuXJt7sYNoDVhraj3MNY272NtECuK/exec'
          try {
            const responseJSON = await net.fetch(url + '?action=actualizarPredio')
            const predios = await responseJSON.json()
            let nombrepredios = JSON.stringify(predios)
            console.log(nombrepredios)
            fs.writeFileSync('./proveedores.json', nombrepredios)
            console.log('Data saved')
          } catch (e) {
            console.log(`${e.name}: ${e.message}`)
          }
        }
      },
      {
        label: 'Obtener ENF',
        click: async () => {
          const { net } = require('electron')
          const fs = require('fs')
          const url =
            'https://script.google.com/macros/s/AKfycbyM7aXbCu2EXkGDNK5fL9zZMIN4W8L4LgBZQau8AI4Nubn2xuliLEh-mQLpOaYSg11FQQ/exec'
          try {
            const responseJSON = await net.fetch(url + '?action=actualizarENF')
            const ENF = await responseJSON.json()

            let inventarioJSON = fs.readFileSync('./inventario.json')
            let inventario = JSON.parse(inventarioJSON)

            inventario['enf'] = ENF

            inventarioJSON = JSON.stringify(inventario)
            fs.writeFileSync('./inventario.json', inventarioJSON)
            
            console.log('Data saved')
          } catch (e) {
            console.log(`${e.name}: ${e.message}`)
          }
        }
      },
      {
        label: 'Resetear inventario local',
        click: () => {
          const fs = require('fs')
          try {
            let inventarioJSON = fs.readFileSync('./inventario.json')
            let inventario = JSON.parse(inventarioJSON)

            inventario = {}
            inventario['ENF-vaciando'] = ''
            inventario['enf'] = 0
            inventario['idVaciado'] = 0
            inventario['idDirectoNacional'] = 0
            inventario['historialVaciado'] = {}
            console.log(inventario)
            inventarioJSON = JSON.stringify(inventario)
            fs.writeFileSync('./inventario.json', inventarioJSON)
            console.log('Data saved')
          } catch (e) {
            console.log(`${e.name}: ${e.message}`)
          }
        }
      },
      {
        label: 'Ver inventario Local',
        click: () => {
          const fs = require('fs')
          try {
            let inventarioJSON = fs.readFileSync('./inventario.json')
            let inventario = JSON.parse(inventarioJSON)

            console.log(inventario)
          } catch (e) {
            console.log(`${e.name}: ${e.message}`)
          }
        }
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

module.exports.mainMenu = Menu.buildFromTemplate(template)
