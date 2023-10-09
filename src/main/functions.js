const { net } = require('electron')
const { join } = require('path')
const fs = require('fs')
//Desarrollo
const ID = 'AKfycbxIgSlDlBRL2FbBAlVhANmWqjHP0KvgTWJe2I_C_bciYpCcCPnGeOFF9Tt4lhqcj6wVrw'

//Produccion
// const ID = 'AKfycbzfh9iCoArZuo7A7LtInqMY3vpHPjlQj2AGN81nistAX_WbwjFtTjEKniohx_xL3ddT'


const url = 'https://script.google.com/macros/s/' + ID + '/exec'
const pathProveedores = join(__dirname, '../../../../../data/proveedores.json');
const pathClientes = join(__dirname, '../../../../../data/clientes.json');
const pathIDs = join(__dirname, '../../../../../data/ids.json');
const pathInventario = join(__dirname, '../../../../../data/inventario.json');
const pathHistorialVaciado = join(__dirname, '../../../../../data/historialVaciado.json');
const pathHistorialDirectoNacional = join(__dirname, '../../../../../data/historialDirectoNacional.json');
const pathDesverdizado = join(__dirname, '../../../../../data/inventarioDesverdizado.json');
const pathHistorialDescarte = join(__dirname, '../../../../../data/historialDescarte.json');


//UsersPath
const userPath = join(__dirname, '../../data/users.json');

export const fetchFunction = async (action, datos) => {
  try {
    const response = await net.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: action,
        data: datos
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    const data = await response.json()
    return data
  } catch (e) {
    return `${e.name}:${e.message}`
  }
};
export const functionObtenerDescarte = async (inventario) => {
  let descarteObj = {}

  Object.keys(inventario).forEach((item) => {
    if (
      inventario[item].hasOwnProperty('descarteLavado') ||
      inventario[item].hasOwnProperty('descarteEncerado')
    ) {
      let isCelifrut = item.split('-')
      if (isCelifrut[0] == 'Celifrut') {
        if (
          !(
            inventario[item]['descarteLavado']['descarteGeneral'] === 0 &&
            inventario[item]['descarteLavado']['pareja'] === 0 &&
            inventario[item]['descarteLavado']['balin'] === 0 &&
            inventario[item]['descarteEncerado']['descarteGeneral'] === 0 &&
            inventario[item]['descarteEncerado']['pareja'] === 0 &&
            inventario[item]['descarteEncerado']['balin'] === 0 &&
            inventario[item]['descarteEncerado']['extra'] === 0
          )
        ) {
          descarteObj[item] = {}
          descarteObj[item]['nombre'] = 'Celifrut'
          descarteObj[item]['tipoFruta'] = inventario[item]['tipoFruta']
          descarteObj[item]['descarteLavado'] = inventario[item]['descarteLavado']
          descarteObj[item]['descarteEncerado'] = inventario[item]['descarteEncerado']
        }
      } else {
        if (
          !(
            inventario[item]['descarteLavado']['descarteGeneral'] === 0 &&
            inventario[item]['descarteLavado']['pareja'] === 0 &&
            inventario[item]['descarteLavado']['balin'] === 0 &&
            inventario[item]['descarteEncerado']['descarteGeneral'] === 0 &&
            inventario[item]['descarteEncerado']['pareja'] === 0 &&
            inventario[item]['descarteEncerado']['balin'] === 0 &&
            inventario[item]['descarteEncerado']['extra'] === 0
          )
        ) {
          descarteObj[item] = {}
          descarteObj[item]['nombre'] = inventario[item]['nombre']
          descarteObj[item]['tipoFruta'] = inventario[item]['tipoFruta']
          descarteObj[item]['descarteLavado'] = inventario[item]['descarteLavado']
          descarteObj[item]['descarteEncerado'] = inventario[item]['descarteEncerado']
        }
      }
    }
  })
  return descarteObj
};
export const obtenerProveedores = async () => {
  if (!fs.existsSync(pathProveedores)) {
    fs.writeFileSync(pathProveedores, JSON.stringify({}))
  }
  const proveedoresJSON = fs.readFileSync(pathProveedores)
  const proveedores = JSON.parse(proveedoresJSON)
  return proveedores
};
export const obtenerClientes = async () => {
  if (!fs.existsSync(pathClientes)) {
    fs.writeFileSync(pathClientes, JSON.stringify({}))
  }
  const clientesJSON = fs.readFileSync(pathClientes)
  const clientes = JSON.parse(clientesJSON)
  return clientes
};
export const obtenerIDs = async () => {
  if (!fs.existsSync(pathIDs)) {
    const initialData = {
      "enf": 0,
      "ENF-vaciando": "",
      "idCelifrut": 0,
      "idDirectoNacional": 0,
      "idHistorialDescarte": 0,
      "idVaciado": 0
    };
    fs.writeFileSync(pathIDs, JSON.stringify(initialData));
  }
  const idsJSON = fs.readFileSync(pathIDs);
  const ids = JSON.parse(idsJSON);
  return ids;
};
export const guardarIDs = async (nuevoIDs) => {
  if (!fs.existsSync(pathIDs)) {
    fs.writeFileSync(pathIDs, JSON.stringify({}));
  }
  const idsJSON = JSON.stringify(nuevoIDs);
  fs.writeFileSync(pathIDs, idsJSON);
};
export const obtenerInventario = async () => {
  if (!fs.existsSync(pathInventario)) {
    fs.writeFileSync(pathInventario, JSON.stringify({}))
  }
  const inventarioJSON = fs.readFileSync(pathInventario)
  const inventario = JSON.parse(inventarioJSON)
  return inventario
};
export const guardarInventario = async (inventarioNuevo) => {
  if (!fs.existsSync(pathInventario)) {
    fs.writeFileSync(pathInventario, JSON.stringify({}))
  }
  let inventarioJSON = JSON.stringify(inventarioNuevo)
  fs.writeFileSync(pathInventario, inventarioJSON)
};
export const obtenerHistorialVaciado = async () => {
  if (!fs.existsSync(pathHistorialVaciado)) {
    fs.writeFileSync(pathHistorialVaciado, JSON.stringify({}))
  }

  const historialVaciadoJSON = fs.readFileSync(pathHistorialVaciado)
  const historialVaciado = JSON.parse(historialVaciadoJSON)

  return historialVaciado
};
export const guardarHistorialVaciado = async (nuevoHistorialVaciado) => {
  if (!fs.existsSync(pathHistorialVaciado)) {
    fs.writeFileSync(pathHistorialVaciado, JSON.stringify({}));
  }
  const historialVaciadoJSON = JSON.stringify(nuevoHistorialVaciado);
  fs.writeFileSync(pathHistorialVaciado, historialVaciadoJSON);
};
export const obtenerHistorialDirectoNacional = async () => {
  if (!fs.existsSync(pathHistorialDirectoNacional)) {
    fs.writeFileSync(pathHistorialDirectoNacional, JSON.stringify({}));
  }
  const historialDirectoNacionalJSON = fs.readFileSync(pathHistorialDirectoNacional);
  const historialDirectoNacional = JSON.parse(historialDirectoNacionalJSON);
  return historialDirectoNacional;
};
export const guardarHistorialDirectoNacional = async (nuevoDirectoNacional) => {
  if (!fs.existsSync(pathHistorialDirectoNacional)) {
    fs.writeFileSync(pathHistorialDirectoNacional, JSON.stringify({}));
  }
  const historialDirectoNacionalJSON = JSON.stringify(nuevoDirectoNacional);
  fs.writeFileSync(pathHistorialDirectoNacional, historialDirectoNacionalJSON);
};
export const obtenerDesverdizado = async () => {
  if (!fs.existsSync(pathDesverdizado)) {
    fs.writeFileSync(pathDesverdizado, JSON.stringify({}));
  }

  const desverdizadoJSON = fs.readFileSync(pathDesverdizado);
  const desverdizado = JSON.parse(desverdizadoJSON);

  return desverdizado;
};
export const guardarDesverdizado = async (nuevoDesverdizado) => {
  if (!fs.existsSync(pathDesverdizado)) {
    fs.writeFileSync(pathDesverdizado, JSON.stringify({}));
  }
  const desverdizadoJSON = JSON.stringify(nuevoDesverdizado);
  fs.writeFileSync(pathDesverdizado, desverdizadoJSON);
};
export const obtenerHistorialDescarte = async () => {
  if (!fs.existsSync(pathHistorialDescarte)) {
    fs.writeFileSync(pathHistorialDescarte, JSON.stringify({}));
  }

  const historialDescarteJSON = fs.readFileSync(pathHistorialDescarte);
  const historialDescarte = JSON.parse(historialDescarteJSON);

  return historialDescarte;
};
export const guardarHistorialDescarte = async (nuevoHistorialDescarte) => {
  if (!fs.existsSync(pathHistorialDescarte)) {
    fs.writeFileSync(pathHistorialDescarte, JSON.stringify({}));
  }
  const historialDescarteJSON = JSON.stringify(nuevoHistorialDescarte);
  fs.writeFileSync(pathHistorialDescarte, historialDescarteJSON);
};
export const logInProcess = async (datos) =>{
  if (!fs.existsSync(userPath)) {
    return 401
  }

  const usersJSON = fs.readFileSync(userPath);
  const users = JSON.parse(usersJSON);

  if(users.hasOwnProperty(datos.user)){
    if(users[datos.user]['clave'] === datos.password){
      return users[datos.user]['permisos']
    }
    else{
      return 'Error en la contraseña'
    }
  }
  else{
    return 'Usuario no existe'
  }
}
export const actualizarProveedores = async () =>{

    const responseJSON = await net.fetch(url + '?action=actualizarPredio')
    const predios = await responseJSON.json()
    let nombrepredios = JSON.stringify(predios)
    ///para dev
     fs.writeFileSync(pathProveedores, nombrepredios)

     return 200
}
export const obtenerENF = async () => {

  const responseJSON = await net.fetch(url + '?action=actualizarENF')
  const ENF = await responseJSON.json()
  //console.log(ENF)
  
  const ids = await obtenerIDs();
  ids.enf = ENF
  await guardarIDs(ids);

  return 200
}
export const obtenerIdCelifrut = async () => {

  const responseJSON = await net.fetch(url + '?action=actualizarIdCelifrut');
  const idCelifrut = await responseJSON.json()
  //console.log(ENF)
  
  const ids = await obtenerIDs();
  ids.idCelifrut = idCelifrut
  await guardarIDs(ids);

  return 200
}
export const actualizarClientes = async () =>{

  const responseJSON = await net.fetch(url + '?action=obtenerClientes');
  const clientesObj = await responseJSON.json();
  let clientes = JSON.stringify(clientesObj)
  fs.writeFileSync(pathClientes, clientes)

  return clientes;

}
export const actualizarDescarte = async () => {
  const response = await net.fetch(url + '?action=obtenerDescarte');
  const descarte = await response.json();

  return descarte
};

