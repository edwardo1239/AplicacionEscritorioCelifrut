import React, { Component } from 'react';
import { format } from 'date-fns';

const tableStyle = {
  width: '100%',
  border: '1px solid #ddd',
  borderCollapse: 'collapse',
};

const thStyle = {
  backgroundColor: '#f2f2f2',
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'left',
  marginBottom: '8px',
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'left',
};

const evenRowStyle = {
  backgroundColor: '#f2f2f2',
};

const oddRowStyle = {
  backgroundColor: '#fff',
};


class InspeccionPlanta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      filteredData: null,
      searchText: '',
    };
  }

  componentDidMount() {
   
    const request = { action: 'obtenerRegistroLimpiezaDesinfeccionPlanta' }
    window.api.calidad(request).then( (newData) => {
      console.log(newData.data)

     this.setState({ data: newData.data })
    })
  }

  handleTextFilter = (text) => {
    // Filtra los elementos según el texto de búsqueda
    const request = { action: 'obtenerRegistroLimpiezaDesinfeccionPlanta' }
    window.api.calidad(request).then((data) =>{
      console.log(data)
      const filteredData = Object.entries(data.data).reduce((filtered, [fecha, elementos]) => {
        if (fecha.includes(text)) {
          filtered[fecha] = elementos;
        }
        return filtered;
      }, {});
  
      this.setState({ filteredData });
    })

  };

  getAreaName = (key) => {
    if (key.startsWith('area_social')) {
      return 'Area Social';
    } else if (key.startsWith('area_lavado')) {
      return 'Area Lavado';
    } else if (key.startsWith('area_recepcion')) {
      return 'Area Recepcion';
    } else if (key.startsWith('area_proceso')) {
      return 'Area Proceso';
    } else if (key.startsWith('area_insumos')) {
      return 'Area Cuarto De Insumos';
    } else if (key.startsWith('area_laboratorio')) {
      return 'Area Laboratorio';
    } else if (key.startsWith('area_almacenamiento')) {
      return 'Area Almacenamiento Carton';
    } else if (key.startsWith('area_sanitarios')) {
      return 'Area Servicios Sanitarios';
    } else if (key.startsWith('area_comunes')) {
      return 'Areas Comunes';
    }
    return 'Otro'; // Si hay claves no identificadas
  };

  

  render() {
    const nombreCampo = {
      //AREA SOCIAL
      area_social_microondas: 'Microondas sin residuos?',
      area_social_vestieres: 'Vestieres/Lockers',
      area_social_mesones: 'Mesones',
      //AREA RECEPCION
      area_recepcion_tanque: 'Tanque de inmersión',
      area_recepcion_muelles: 'Muelles',
      area_recepcion_estibadores: 'Estibadores',
      //AREA LAVAD0
      area_lavado_rodillos: 'Rodillos lavado',
      area_lavado_paredes: 'Paredes',
      area_lavado_piso: 'Piso',
      area_lavado_rodillos_tunel: 'Rodillos tunel de secado 1',
      area_lavado_equipo: 'Estructura equipo',
      area_lavado_desbalinadora: 'Desbalinadora',
      //AREA PROCESO
      area_proceso_rodillos_tunel_2: 'Rodillos tunel de secado 2',
      area_proceso_modulo_encerado: 'Modulo encerado',
      area_proceso_rodillos_cera: 'Rodillos cera',
      area_proceso_rodillos_clasificadora: 'Rodillos clasificadora',
      area_proceso_bandejas_clasificadora: 'Bandejas clasificadora',
      area_proceso_pisos: 'Pisos',
      area_proceso_paredes: 'Paredes',
      area_proceso_estibadores: 'Estibadores',
      area_proceso_herramientas: 'Herramientas para enzunchado y palatizado',
      area_proceso_basculas: 'Basculas',
      //AREA CUARTO INSUMOS
      area_insumos_estanteria: 'Estantería',
      area_insumos_piso: 'Piso',
      area_insumos_paredes: 'Paredes',
      area_insumos_elementos: 'Elementos en orden',
      //AREA LABORATIRIO
      area_laboratorio_meson: 'Mesón',
      area_laboratorio_utensilios: 'Utensilios',
      area_laboratorio_cajon_utensilios: 'Cajón de utensilios',
      area_laboratorio_piso: 'Piso',
      area_laboratorio_paredes: 'Paredes',
      //AREA ALMACENAMIENTO CARTON
      area_almacenamiento_pisos: 'Pisos',
      area_almacenamiento_paredes: 'Paredes',
      area_almacenamiento_estibadores: 'Estibadores',
      area_almacenamiento_malla: 'Malla antitrips',
      //AREA sERVICIOS SANITARIOS
      area_sanitarios_sanitarios: 'Sanitarios',
      area_sanitarios_lavamanos: 'Lavamanos',
      area_sanitarios_recipiente: 'Recipiente de basura con bolsa correspondiente a residuo',
      area_sanitarios_piso: 'Piso',
      area_sanitarios_paredes: 'Paredes',
      //AREAS COMUNES
      area_comunes_alrededores: 'Alrededores de la planta libres de residuos',
      area_comunes_cuarto_residuos: 'Cuarto residuos (orden, limpieza y desinfección)',
      /////////////////////////////////////////
      //OBS SOCIAL
      area_social_mesones_observaciones: 'Observaciones Mesones',
      area_social_microondas_observaciones: 'Observaciones Microondas sin residuos?',
      area_social_vestieres_observaciones: 'Observaciones Vestieres/Lockers',
      //OBS RECEPCION
      area_recepcion_tanque_observaciones: 'Observaciones Tanque de inmersión',
      area_recepcion_muelles_observaciones: 'Observaciones Muelles',
      area_recepcion_estibadores_observaciones: 'Observaciones Estibadores',
      //OBS LAVADO
      area_lavado_rodillos_observaciones: 'Observaciones Rodillos lavado',
      area_lavado_paredes_observaciones: 'Observaciones Paredes',
      area_lavado_piso_observaciones: 'Observaciones Piso',
      area_lavado_rodillos_tunel_observaciones: 'Observaciones Rodillos tunel de secado 1',
      area_lavado_equipo_observaciones: 'Observaciones Estructura equipo',
      area_lavado_desbalinadora_observaciones: 'Observaciones Desbalinadora',
      //OBS AREA PROCESO
      area_proceso_rodillos_tunel_2_observaciones: 'Observaciones Rodillos tunel de secado 2',
      area_proceso_modulo_encerado_observaciones: 'Observaciones Modulo encerado',
      area_proceso_rodillos_cera_observaciones: 'Observaciones Rodillos cera',
      area_proceso_rodillos_clasificadora_observaciones: 'Observaciones Rodillos clasificadora',
      area_proceso_bandejas_clasificadora_observaciones: 'Observaciones Bandejas clasificadora',
      area_proceso_pisos_observaciones: 'Observaciones Pisos',
      area_proceso_paredes_observaciones: 'Observaciones Paredes',
      area_proceso_estibadores_observaciones: 'Observaciones Estibadores',
      area_proceso_herramientas_observaciones: 'Observaciones Herramientas para enzunchado y palatizado',
      area_proceso_basculas_observaciones: 'Observaciones Basculas',
      //OBS AREA INSUMOS
      area_insumos_estanteria_observaciones: 'Observaciones Estantería',
      area_insumos_piso_observaciones: 'Observaciones Piso',
      area_insumos_paredes_observaciones: 'Observaciones Paredes',
      area_insumos_elementos_observaciones: 'Observaciones Elementos en orden',
      //OBS AREA LABORATORIOS
      area_laboratorio_meson_observaciones: 'Observaciones Mesón',
      area_laboratorio_utensilios_observaciones: 'Observaciones Utensilios',
      area_laboratorio_cajon_utensilios_observaciones: 'Observaciones Cajón ,de utensilios',
      area_laboratorio_piso_observaciones: 'Observaciones Piso',
      area_laboratorio_paredes_observaciones: 'Observaciones Paredes',
      //OBS AREA ALMACENAMIENTO CARTON
      area_almacenamiento_pisos_observaciones: 'Observaciones Pisos',
      area_almacenamiento_paredes_observaciones: 'Observaciones Paredes',
      area_almacenamiento_estibadores_observaciones: 'Observaciones Estibadores',
      area_almacenamiento_malla_observaciones: 'Observaciones Malla antitrips',
      //OBS AREA SANITARIOS
      area_sanitarios_sanitarios_observaciones: 'Observaciones Sanitarios',
      area_sanitarios_lavamanos_observaciones: 'Observaciones Lavamanos',
      area_sanitarios_recipiente_observaciones: 'Observaciones Recipiente de basura con bolsa correspondiente a residuo',
      area_sanitarios_piso_observaciones: 'Observaciones Piso',
      area_sanitarios_paredes_observaciones: 'Observaciones Paredes',
      //AREAS COMUNES
      area_comunes_alrededores_observaciones: 'Observaciones Alrededores de la planta libres de residuos',
      area_comunes_cuarto_residuos_observaciones: 'Observaciones Cuarto residuos (orden, limpieza y desinfección)',
      
    };

    return (
      <div>
        <h2 style={thStyle}>INSPECCIÓN LIMPIEZA Y DESINFECCIÓN DIARIA PLANTA POSTCOSECHA</h2>
        <input
  type="text"
  placeholder="Buscar por fecha"
  onChange={(e) => this.handleTextFilter(e.target.value)}
  style={{
    padding: '5px',
    fontSize: '16px',
    border: '2px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '180px',
    margin: '8px 1px',
    outline: 'none',
  }}
/>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Área</th>
              <th style={thStyle}>Tipo Área</th>
              <th style={thStyle}>Observaciones</th>
            </tr>
          </thead>
          <tbody>
          {Object.entries(this.state.filteredData || this.state.data).map(([fecha, elementos], index) => (
              <tr key={index} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
                <td style={tdStyle}>{format(new Date(elementos.fecha), 'dd/MM/yyyy HH:mm:ss')}</td>
                <td style={tdStyle}>
                  {Object.keys(elementos).reduce((areas, key) => {
                    if (key !== 'responsable') {
                      const areaName = this.getAreaName(key);
                      if (areaName !== 'Otro' && !areas.includes(areaName)) {
                        areas.push(areaName);
                      }
                    }
                    return areas;
                  }, []).map((areaName, index) => (
                    <p key={index} style={tdStyle}>
                      {areaName}
                    </p>
                  ))}
                </td>
                <td style={tdStyle}>
                  {Object.entries(elementos).map(([elemento, valor], elIndex) => {
                    if (elemento !== 'responsable' && !elemento.includes('_observaciones') && elemento !== '_id' && elemento !== '__v') {
                      const nombreMostrado = nombreCampo[elemento] || elemento;
                      return (
                        <p key={elIndex} style={tdStyle}>
                          {nombreMostrado}: {valor ? 'Sí' : 'No'}
                        </p>
                      );
                    }
                    return null;
                  })}
                </td>
                <td style={tdStyle}>
                  {Object.entries(elementos).map(([elemento, valor], elIndex) => {
                    if (elemento.includes('_observaciones')) {
                      const nombreMostrado = nombreCampo[elemento] || elemento;
                      return (
                        <p key={elIndex} style={tdStyle}>
                          {nombreMostrado}: {valor}
                        </p>
                      );
                    }
                    return null;
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default InspeccionPlanta;