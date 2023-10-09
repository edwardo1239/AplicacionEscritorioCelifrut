import { IpcRenderer } from 'electron';

export interface Api {
  obtenerPredios: () => Promise<any>;
  guardarLote: (datos: any) => Promise<any>;
  obtenerFrutaActual: () => Promise<any>;
  vaciarLote: (datos: any) => Promise<any>;
  directoNacional: (datos: any) => Promise<any>;
  desverdizado: (datos: any) => Promise<any>;
  obtenerHistorialProceso: () => Promise<any>;
  modificarHistorial: (datos: any) => Promise<any>;
  actualizarDescarte: () => Promise<any>;
  obtenerDescarte: () => Promise<any>;
  eliminarFrutaDescarte: (datos: any) => Promise<any>;
  obtenerHistorialDirectoNacional: () => Promise<any>;
  modificarHistorialDirectoNacional: (datos: any) => Promise<any>;
  crearContenedor: (datos: any) => Promise<any>;
  obtenerClientes:() => Promise<any>
  logIn:(datos: any) => Promise<any>

}

declare global {
  interface Window {
    api: Api;
    ipcRenderer: IpcRenderer;
  }
}
