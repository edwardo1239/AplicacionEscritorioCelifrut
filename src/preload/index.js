import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  logIn: async (datos) => {
    const response = await ipcRenderer.invoke('logIn', datos)
    return response
  },
  ingresoFruta: async (datos) => {
    const response = await ipcRenderer.invoke('ingresoFruta', datos)
    return response
  },
  inventario: async (datos) => {
    const response = await ipcRenderer.invoke('inventario', datos)
    return response
  },
  contenedores: async (datos) => {
    const response = await ipcRenderer.invoke('contenedores', datos)
    return response
  },
  calidad: async (datos) => {
    const response = await ipcRenderer.invoke('calidad', datos)
    return response
  },
  descartes: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args))
  },
  listaEmpaqueInfo: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args))
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
