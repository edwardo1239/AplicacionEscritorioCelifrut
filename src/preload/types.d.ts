import { IpcRenderer } from 'electron';
import { contenedoresObj } from '../renderer/src/components/Contenedores/types';

export interface Api {
  obtenerPredios: () => Promise<any>;
  guardarLote: (datos: any) => Promise<any>;
  obtenerFrutaActual: () => Promise<any>;
  reqObtenerFrutaActual: () => Promise<any>
  vaciarLote: (datos: any) => Promise<any>;
  directoNacional: (datos: any) => Promise<any>;
  desverdizado: (datos: any) => Promise<any>;
  obtenerHistorialProceso: () => Promise<any>;
  reqObtenerHistorialProceso: () => Promise<any>;
  modificarHistorial: (datos: any) => Promise<any>;
  obtenerFrutaDesverdizando: () => Promise<any>;
  reqObtenerFrutaDesverdizando: () => Promise<any>;
  obtenerDescarte: () => Promise<any>;
  reqObtenerDescarte: () => Promise<any>;
  eliminarFrutaDescarte: (datos: any) => Promise<any>;
  obtenerHistorialDirectoNacional: () => Promise<any>;
  reqObtenerHistorialDirectoNacional: () => Promise<any>;
  modificarHistorialDirectoNacional: (datos: any) => Promise<any>;
  crearContenedor: (datos: any) => Promise<any>;
  obtenerClientes:() => Promise<any>
  logIn:(datos: any) => Promise<any>
  obtenerHistorialDescarte:() => Promise<any>
  reqObtenerHistorialDescarte:() => Promise<any>
  obtenerLotesCalidadInterna: () => Promise<any>
  guardarCalidadInterna: (datos:any) => Promise<any>
  obtenerLotesClasificacionCalidad: () => Promise<any>
  obtenerContenedoresListaEmpaque: () => Promise<contenedoresObj>
}

declare global {
  interface Window {
    api: Api;
    ipcRenderer: IpcRenderer;
  }
}
