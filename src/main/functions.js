const { net } = require('electron')
const fs = require('fs')
const ID = 'AKfycbxUbww4_8uzbiLnYSIajaBERrWSCYs9sEQ-DSOMRVCYqSE1rYRRk29MHRGBpVykHFJUNw'
let url = 'https://script.google.com/macros/s/' + ID + '/exec'

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
}

export const eliminarInventarioDescarte = async (datos) => {
  try {
    let inventarioJSON = fs.readFileSync(pathInventario)
    let inventario = JSON.parse(inventarioJSON)

    let idsJSON = fs.readFileSync(pathIDs)
    let ids = JSON.parse(idsJSON)

    let historialDescarteJSON = fs.readFileSync(pathHistorialDescarte)
    let historialDescarte = JSON.parse(historialDescarteJSON)

    historialDescarte[ids['idHistorialDescarte']] = {}

    Object.keys(datos).map((item) => {
      let [enf, descarte, tipoDescarte] = item.split('/')
      historialDescarte[ids['idHistorialDescarte']][enf] = {}
      historialDescarte[ids['idHistorialDescarte']][enf]['descarteLavado'] = {}
      historialDescarte[ids['idHistorialDescarte']][enf]['descarteEncerado'] = {}
    })

    Object.keys(datos).map((item) => {
      let [enf, descarte, tipoDescarte] = item.split('/')
      // console.log(enf)
      inventario[enf][descarte][tipoDescarte] -= datos[item]
      historialDescarte[ids['idHistorialDescarte']][enf][descarte][tipoDescarte] = datos[item]
    })

    ids['idHistorialDescarte'] += 1

    inventarioJSON = JSON.stringify(inventario)
    fs.writeFileSync(pathInventario, inventarioJSON)

    idsJSON = JSON.stringify(ids)
    fs.writeFileSync(pathIDs, idsJSON)

    historialDescarteJSON = JSON.stringify(historialDescarte)
    fs.writeFileSync(pathHistorialDescarte, historialDescarteJSON)

    return 200
  } catch (e) {
    return `${e.name}:${e.message}`
  }
}

export const functionObtenerDescarte = async (inventario) => {
  let descarteObj = {}

  Object.keys(inventario).map((item) => {
    if (
      inventario[item].hasOwnProperty('descarteLavado') ||
      inventario[item].hasOwnProperty('descarteEncerado')
    ) {
      let isCelifrut = item.split("-")
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
}
