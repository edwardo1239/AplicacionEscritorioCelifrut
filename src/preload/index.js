import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'


// Custom APIs for renderer
const api = {
  obtenerPredios: async () => {
    const predios = await ipcRenderer.invoke("obtenerPredios");
    return predios;
  },

  guardarLote: async (datos) => {
    const response = await ipcRenderer.invoke("guardarLote", datos);
    return response;
  },

  obtenerFrutaActual: async () => {
    const response = await ipcRenderer.invoke("obtenerFrutaActual");
    return response;
  },

  vaciarLote: async (datos) => {
    const response = await ipcRenderer.invoke('vaciarLote', datos);
    return response
  },

  directoNacional: async (datos) => {
    const response = await ipcRenderer.invoke('directoNacional', datos);
    return response
  },

  desverdizado: async (datos) => {
    const response = await ipcRenderer.invoke('desverdizado', datos);
    return response
  },

  obtenerHistorialProceso: async () => {
    const response = await ipcRenderer.invoke('obtenerHistorialProceso');
    return response
  },

  modificarHistorial: async (datos) => {
    const response = await ipcRenderer.invoke('modificarHistorial', datos);
    return response
  },
  actualizarDescarte: async () => {
    const response = await ipcRenderer.invoke('actualizarDescarte');
    return response
  },

  obtenerDescarte: async () => {
    const response = await ipcRenderer.invoke('obtenerDescarte');
    return response;
  },

  eliminarFrutaDescarte: async (datos) => {
    const response = await ipcRenderer.invoke('eliminarFrutaDescarte', datos);
    return response;
  },
  obtenerHistorialDirectoNacional: async () => {
    const response = await ipcRenderer.invoke('obtenerHistorialDirectoNacional');
    return response
  },

  modificarHistorialDirectoNacional: async (datos) => {
    const response = await ipcRenderer.invoke('modificarHistorialDirectoNacional', datos);
    return response
  },
  obtenerFrutaDesverdizando: async () => {
    const response = await ipcRenderer.invoke('obtenerFrutaDesverdizando');
    return response
  },
  procesarDesverdizado: async (datos) => {
    const response = await ipcRenderer.invoke('procesarDesverdizado', datos);
    return response
  },
  finalizarDesverdizado: async (datos) => {
    const response = await ipcRenderer.invoke('finalizarDesverdizado', datos);
    return response
  },
  setParametrosDesverdizado: async (datos) => {
    const response = await ipcRenderer.invoke('setParametrosDesverdizado', datos);
    return response
  },
  reprocesarDescarteUnPredio: async (datos) => {
    const response = await ipcRenderer.invoke('reprocesarDescarteUnPredio', datos);
    return response
  },
  ReprocesarDescarteCelifrut: async (datos) => {
    const response = await ipcRenderer.invoke('ReprocesarDescarteCelifrut', datos);
    return response
  },
  crearContenedor: async (datos) => {
    const response = await ipcRenderer.invoke('crearContenedor', datos);
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

