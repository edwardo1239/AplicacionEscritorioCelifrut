const { net } = require('electron')
//Desarrollo
//const ID = 'AKfycbyiBw89AxnnRw6QAgrPr1vNJbKK1-SN-6dyslBVK_ru4TjpepbJInF7wRcV1y2Dw9tOSg'
//Produccion
const ID = 'AKfycbz5FjWgwq1t40FFvQdHhnJcwwu9thOgCK3iXBP8dfYPTHwgBG_vL9Fch77PPGovPorhBQ'
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
