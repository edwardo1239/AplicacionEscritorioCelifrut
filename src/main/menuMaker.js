import { Menu, app, Notification } from 'electron'
import { join } from 'path'

const isMac = process.platform === 'darwin'

//produccion
// const pathIDsDev = join(__dirname, '../../../ids.json')
// const pathProveedoresDev = join(__dirname, '../../../proveedores.json')
// const urlObtenerENF = 'https://script.google.com/macros/s/AKfycbzeSuR-qsx9ye-AMk1-hJ98t7RdmOIJzHcPXxPiOQUaxDs8--ut_RPGyIG-uOOFZwU8aQ/exec'

//desarrollador
const pathIDsDev = './ids.json'
const pathProveedoresDev = './proveedores.json'
const urlObtenerENF = 'https://script.google.com/macros/s/AKfycbxf8Seb8PcVWcEJ94jBJOjnycQMHw5dm6U4ADJ_wz3ImIujdX2QKXCBxvXAUeQXalIr1w/exec'

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
          const url = 'https://script.google.com/macros/s/AKfycbzNt3WjCm_4A0-KOotz3TfaMnYD4r4VRw_PBq1uuXJt7sYNoDVhraj3MNY272NtECuK/exec'
          try {
            const responseJSON = await net.fetch(url + '?action=actualizarPredio')
            const predios = await responseJSON.json()
            let nombrepredios = JSON.stringify(predios)
            ///para dev
            fs.writeFileSync(pathProveedoresDev, nombrepredios)

            ////////// para produccion
            //fs.writeFileSync(join(__dirname, '../../../proveedores.json'), nombrepredios)


            new Notification({
              title: 'Success',
              body: 'Data saved'
            }).show()
          } catch (e) {
            console.log(`${e.name}: ${e.message}`)
            new Notification({
              title: 'Error',
              body: `${e.name}: ${e.message}`
            }).show()
          }
        }
      },
      {
        /////obtener ENF
        label: 'Obtener ENF',
        click: async () => {
          const { net } = require('electron')
          const fs = require('fs')
      
          try {
            const responseJSON = await net.fetch(urlObtenerENF + '?action=actualizarENF')
            const ENF = await responseJSON.json()
            //console.log(ENF)
            
            if(fs.existsSync(pathIDsDev)){
              let inventarioJSON = fs.readFileSync(pathIDsDev)
              let inventario = JSON.parse(inventarioJSON)

              inventario['enf'] = ENF

              inventarioJSON = JSON.stringify(inventario)
              fs.writeFileSync(pathIDsDev, inventarioJSON)
            }

            else{
              let inventario = {}
              inventario['enf'] = ENF
              let inventarioJSON = JSON.stringify(inventario)
              fs.writeFileSync(pathIDsDev, inventarioJSON)
            }

            
            new Notification({
              title: 'Success',
              body: "EF1 actualizada"
            }).show()
          } catch (e) {
            console.log(`${e.name}: ${e.message}`)
            new Notification({
              title: 'Error',
              body: `${e.name}: ${e.message}`
            }).show()
          }
        }
      },
      // {
      //   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //   label: 'Resetear inventario local',
      //   click: async () => {
      //     const fs = require('fs')
      //     const { net } = require('electron')
      //     try {
      //       const response = await net.fetch('https://script.google.com/macros/s/AKfycbzSr3gqvBAb2JhoPPylZlK5W2FnnrGGvbI47ssJgxw0l6M17Ex4kzJNrqrxhaouMCPvgw/exec')
      //       const datos = await response.json()
      //       console.log(datos)
      //       // let inventario = {}
      //       // inventario['ENF-vaciando'] = ''
      //       // inventario['enf'] = 0
      //       // inventario['idVaciado'] = 0
      //       // inventario['idDirectoNacional'] = 0
      //       // inventario['historialVaciado'] = {}
      //       // console.log(inventario)
      //       // let inventarioJSON = JSON.stringify(inventario)
      //       // fs.writeFileSync(join(__dirname, '../data/inventario.json'), inventarioJSON)
      //       // new Notification({
      //       //   title: 'Success',
      //       //   body: 'Inventario reseteado'
      //       // }).show()

      //     } catch (e) {
      //       new Notification({
      //         title: 'Error',
      //         body: `${e.name}: ${e.message}`
      //       }).show()
      //     }
      //   }
      // },
      // {
      //   label: 'Ver inventario Local',
      //   click: () => {
      //     const fs = require('fs')
      //     try {
      //       let inventarioJSON = fs.readFileSync(join(__dirname, '../data/inventario.json'))
      //       let inventario = JSON.parse(inventarioJSON)

      //       console.log(inventario)
      //     } catch (e) {
      //       console.log(`${e.name}: ${e.message}`)
      //     }
      //   }
      // }
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
