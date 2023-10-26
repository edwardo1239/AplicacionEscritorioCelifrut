import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  obtenerPredios: async () => {
    const predios = await ipcRenderer.invoke('obtenerPredios')
    return predios
  },
  guardarLote: async (datos) => {
    const response = await ipcRenderer.invoke('guardarLote', datos)
    return response
  },
  obtenerFrutaActual: async () => {
    const response = await ipcRenderer.invoke('obtenerFrutaActual')
    return response
  },
  reqObtenerFrutaActual: async () => {
    const response = await ipcRenderer.invoke('reqObtenerFrutaActual')
    return response
  },
  vaciarLote: async (datos) => {
    const response = await ipcRenderer.invoke('vaciarLote', datos)
    return response
  },
  directoNacional: async (datos) => {
    const response = await ipcRenderer.invoke('directoNacional', datos)
    return response
  },
  desverdizado: async (datos) => {
    const response = await ipcRenderer.invoke('desverdizado', datos)
    return response
  },
  obtenerHistorialProceso: async () => {
    const response = await ipcRenderer.invoke('obtenerHistorialProceso')
    return response
  },
  reqObtenerHistorialProceso: async () => {
    const response = await ipcRenderer.invoke('reqObtenerHistorialProceso')
    return response
  },
  modificarHistorial: async (datos) => {
    const response = await ipcRenderer.invoke('modificarHistorial', datos)
    return response
  },
  obtenerDescarte: async () => {
    const response = await ipcRenderer.invoke('obtenerDescarte')
    return response
  },
  reqObtenerDescarte: async () => {
    const response = await ipcRenderer.invoke('reqObtenerDescarte')
    return response
  },
  eliminarFrutaDescarte: async (datos) => {
    const response = await ipcRenderer.invoke('eliminarFrutaDescarte', datos)
    return response
  },
  obtenerHistorialDirectoNacional: async () => {
    const response = await ipcRenderer.invoke('obtenerHistorialDirectoNacional')
    return response
  },
  reqObtenerHistorialDirectoNacional: async () => {
    const response = await ipcRenderer.invoke('reqObtenerHistorialDirectoNacional')
    return response
  },
  modificarHistorialDirectoNacional: async (datos) => {
    const response = await ipcRenderer.invoke('modificarHistorialDirectoNacional', datos)
    return response
  },
  obtenerFrutaDesverdizando: async () => {
    const response = await ipcRenderer.invoke('obtenerFrutaDesverdizando')
    return response
  },
  reqObtenerFrutaDesverdizando: async () => {
    const response = await ipcRenderer.invoke('reqObtenerFrutaDesverdizando')
    return response
  },
  procesarDesverdizado: async (datos) => {
    const response = await ipcRenderer.invoke('procesarDesverdizado', datos)
    return response
  },
  finalizarDesverdizado: async (datos) => {
    const response = await ipcRenderer.invoke('finalizarDesverdizado', datos)
    return response
  },
  setParametrosDesverdizado: async (datos) => {
    const response = await ipcRenderer.invoke('setParametrosDesverdizado', datos)
    return response
  },
  reprocesarDescarteUnPredio: async (datos) => {
    const response = await ipcRenderer.invoke('reprocesarDescarteUnPredio', datos)
    return response
  },
  ReprocesarDescarteCelifrut: async (datos) => {
    const response = await ipcRenderer.invoke('ReprocesarDescarteCelifrut', datos)
    return response
  },
  crearContenedor: async (datos) => {
    const response = await ipcRenderer.invoke('crearContenedor', datos)
    return response
  },
  logIn: async (datos) => {
    const response = await ipcRenderer.invoke('logIn', datos)
    return response
  },
  obtenerClientes: async () => {
    const response = await ipcRenderer.invoke('obtenerClientes')
    return response
  },
  reqObtenerHistorialDescarte: async () => {
    const response = await ipcRenderer.invoke('reqObtenerHistorialDescarte')
    return response
  },
  obtenerHistorialDescarte: async () => {
    const response = await ipcRenderer.invoke('obtenerHistorialDescarte')
    return response
  },
  obtenerLotesCalidadInterna: async () => {
    const response = await ipcRenderer.invoke('obtenerLotesCalidadInterna')
    return response
  },
  guardarCalidadInterna: async (datos) => {
    const response = await ipcRenderer.invoke('guardarCalidadInterna', datos)
    return response
  },
  obtenerContenedoresListaEmpaque: async () => {
    const response = await ipcRenderer.invoke('obtenerContenedoresListaEmpaque')
    return response
  },
  lotesCalidadInterna: async () => {
    const response = await ipcRenderer.invoke('lotesCalidadInterna')
    return response
  },
  obtenerLotesClasificacionCalidad: async () =>{
    const response = await ipcRenderer.invoke('obtenerLotesClasificacionCalidad')
    return response
  },
  lotesClasificacionCalidad: async () => {
    const response = await ipcRenderer.invoke('lotesClasificacionCalidad')
    return response
  },
  guardarClasificacionCalidad: async (datos) => {
    const response = await ipcRenderer.invoke('guardarClasificacionCalidad', datos)
    return response
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
