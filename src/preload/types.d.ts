import { IpcRenderer } from 'electron';


export interface Api {
  logIn:(datos: any) => Promise<any>
  obtenerRendimientoLote: (data:any) => Promise<any>
  ingresoFruta: (data:any) => Promise<any>
  inventario: (data:any) => Promise<any>
  contenedores: (data:any) => Promise<any>
  calidad: (data:any) => Promise<any>
}

declare global {
  interface Window {
    api: Api;
    ipcRenderer: IpcRenderer;
  }
}
