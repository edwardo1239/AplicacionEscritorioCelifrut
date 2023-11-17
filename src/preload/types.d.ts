import { IpcRenderer } from 'electron';


export interface Api {
  logIn:(datos: any) => Promise<any>
  ingresoFruta: (data:any) => Promise<any>
  inventario: (data:any) => Promise<any>
  contenedores: (data:any) => Promise<any>
  calidad: (data:any) => Promise<any>
  listaEmpaqueInfo: (data:any, callback:any) => any
  proveedores: (data:any) => Promise<any>
}

declare global {
  interface Window {
    api: Api;
    ipcRenderer: IpcRenderer;
  }
}
