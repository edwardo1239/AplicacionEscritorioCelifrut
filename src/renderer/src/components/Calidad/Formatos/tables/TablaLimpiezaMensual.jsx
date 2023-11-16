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

class TablaLimpiezaMensual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        "2023-10-27T20:12:06.589Z": {
          area_cuartos_pisos: true,
          area_cuartos_muelle_observaciones: "das",
          area_cuartos_muelle: true,
          responsable: "Paula Cardenas",
          area_cuartos_cortinas_observaciones: "das",
          area_cuartos_pisos_observaciones: "dsad",
          area_cuartos_ventiladores: true,
          area_cuartos_ventiladores_observaciones: "dads",
          area_cuartos_cortinas: true
          },
          "2023-10-27T20:12:47.658Z": {
          area_recepcion_pisos: true,
          area_recepcion_vigas_observaciones: "",
          area_recepcion_canecas_observaciones: "",
          area_recepcion_filtro_observaciones: "fdsf",
          area_recepcion_banda: true,
          area_recepcion_anjeos: true,
          area_recepcion_cortinas_observaciones: "",
          area_recepcion_estibadores_observaciones: "",
          area_recepcion_tanqueInmersion_observaciones: "dsfsdf",
          area_recepcion_desverdizado_observaciones: "fdsfs",
          area_recepcion_oficina_observaciones: "",
          area_recepcion_estibas_observaciones: "ssssd",
          area_recepcion_filtro: true,
          area_recepcion_tanque: false,
          area_recepcion_oficina: true,
          area_recepcion_cortinas: true,
          area_recepcion_banda_observaciones: "sdf",
          area_recepcion_tanque_observaciones: "",
          responsable: "Paula Cardenas",
          area_recepcion_soporte: true,
          area_recepcion_soporte_observaciones: "fsdfs",
          area_recepcion_pisos_observaciones: "hola",
          area_recepcion_muelles: false,
          area_recepcion_vigas: false,
          area_recepcion_estibadores: true,
          area_recepcion_anjeos_observaciones: "",
          area_recepcion_desverdizado: true,
          area_recepcion_canecas: false,
          area_recepcion_muelles_observaciones: "",
          area_recepcion_tanqueInmersion: true,
          area_recepcion_estibas: false
          },
          "2023-10-27T20:13:41.099Z": {
          area_lavado_rodillosLavado: true,
          area_lavado_rodillos_observaciones: "asda",
          area_lavado_extractores_observaciones: "dsad",
          area_lavado_rodillos: true,
          area_lavado_rodillosLavado_observaciones: "dasd",
          area_lavado_extractoresSecado_observaciones: "",
          responsable: "Paula Cardenas",
          area_lavado_paredes: true,
          area_lavado_anjeos_observaciones: "dsada",
          area_lavado_extractores: true,
          area_lavado_extractoresSecado: false,
          area_lavado_anjeos: true,
          area_lavado_paredes_observaciones: "dsad"
          },
          "2023-10-27T20:14:00.738Z": {
          area_produccion_oficina: true,
          area_produccion_herramientas_observaciones: "dasda",
          area_produccion_cuarto_observaciones: "",
          area_produccion_ventiladoresPiso_observaciones: "dsad",
          area_produccion_paredes: true,
          area_produccion_escaleras_observaciones: "",
          area_produccion_rodillosEncerados_observaciones: "",
          area_produccion_oficina_observaciones: "",
          responsable: "Paula Cardenas",
          area_produccion_cuarto: false,
          area_produccion_estibadores_observaciones: "",
          area_produccion_ventiladores: true,
          area_produccion_laboratorio_observaciones: "",
          area_produccion_escaleras: false,
          area_produccion_extractores_observaciones: "",
          area_produccion_pisos_observaciones: "",
          area_produccion_extractores: true,
          area_produccion_filtro_observaciones: "",
          area_produccion_anjeos: false,
          area_produccion_bandejas: false,
          area_produccion_ventiladoresPiso: true,
          area_produccion_canecas: false,
          area_produccion_laboratorio: false,
          area_produccion_filtro: true,
          area_produccion_estibadores: true,
          area_produccion_herramientas: true,
          area_produccion_soportes_observaciones: "",
          area_produccion_clasificadora: false,
          area_produccion_carritos_observaciones: "",
          area_produccion_rodillosEncerados: true,
          area_produccion_anjeos_observaciones: "",
          area_produccion_ventiladores_observaciones: "",
          area_produccion_pisos: true,
          area_produccion_canecas_observaciones: "",
          area_produccion_cilindro: true,
          area_produccion_clasificadora_observaciones: "",
          area_produccion_carritos: false,
          area_produccion_paredes_observaciones: "",
          area_produccion_bandejas_observaciones: "",
          area_produccion_soportes: false,
          area_produccion_cilindro_observaciones: ""
          },
          "2023-10-27T20:14:05.909Z": {
          area_pasillo_pisos: true,
          area_pasillo_pisos_observaciones: "hhh",
          responsable: "Paula Cardenas"
          },
          "2023-10-27T20:14:57.109Z": {
          area_carton_esstibadores: true,
          responsable: "Daniela Florez",
          area_carton_pisos: true,
          area_carton_estibadores_observaciones: "aaa",
          area_carton_pisos_observaciones: "jjj"
          },
          "2023-10-27T20:15:18.365Z": {
          area_sociales_comedorExterior_observaciones: "hola",
          area_sociales_paredes: false,
          responsable: "Daniela Florez",
          area_sociales_comedorExterior: true,
          area_sociales_lockers_observaciones: "hola",
          area_sociales_pisos: false,
          area_sociales_nevera: true,
          area_sociales_hornos: false,
          area_sociales_comedor_observaciones: "",
          area_sociales_exteriores_observaciones: "",
          area_sociales_canecas_observaciones: "",
          area_sociales_exteriores: false,
          area_sociales_nevera_observaciones: "hola",
          area_sociales_comedor: false,
          area_sociales_lockers: true,
          area_sociales_anjeos_observaciones: "hola",
          area_sociales_pisos_observaciones: "",
          area_sociales_paredes_observaciones: "",
          area_sociales_canecas: false,
          area_sociales_hornos_observaciones: "",
          area_sociales_anjeos: true
          }
      },
      filteredData: null,
      searchText: '', 
    };
  }
  handleTextFilter = (text) => {
    // Filtra los elementos según el texto de búsqueda
    const filteredData = Object.entries(this.state.data).reduce((filtered, [fecha, elementos]) => {
      if (fecha.includes(text)) {
        filtered[fecha] = elementos;
      }
      return filtered;
    }, {});

    this.setState({ filteredData, searchText: text });
  };
  getAreaName = (key) => {
    if (key.startsWith('area_recepcion')) {
      return 'Area Recepcion';
    } else if (key.startsWith('area_lavado')) {
      return 'Area Lavado';
    } else if (key.startsWith('area_produccion')) {
      return 'Area Produccion';
    } else if (key.startsWith('area_pasillo')) {
      return 'Area Pasillo';
    } else if (key.startsWith('area_cuartos')) {
      return 'Area Cuartos Frios';
    } else if (key.startsWith('area_carton')) {
      return 'Area Carton';
    } else if (key.startsWith('area_sociales')) {
      return 'Areas Sociales';
    }
    return 'Otro'; // Si hay claves no identificadas
  };

  

  render() {
    const nombreCampo = {
      //AREA CUARTOS
      area_cuartos_cortinas: 'Cortinas filtro',
      area_cuartos_muelle: 'Muelle',
      area_cuartos_pisos: 'Pisos, paredes, techos',
      area_cuartos_ventiladores: 'Ventiladores',
      //AREA RECEPCION
      area_recepcion_pisos: 'Pisos, paredes, puertas',
      area_recepcion_estibas: 'Estibas plásticas',
      area_recepcion_anjeos: 'Anjeos',
      area_recepcion_vigas: 'Vigas',
      area_recepcion_muelles: 'Muelles',
      area_recepcion_desverdizado: 'Cuartos desverdizado',
      area_recepcion_tanque: 'Tanque reserva agua',
      area_recepcion_soporte: 'Soporte tanque reserva',
      area_recepcion_oficina: 'Oficina',
      area_recepcion_estibadores: 'Estibadores',
      area_recepcion_tanqueInmersion: 'Tanque inmersión',
      area_recepcion_banda: 'Banda transportadora',
      area_recepcion_filtro: 'Filtro desinfección calzado y manos',
      area_recepcion_canecas: 'Canecas residuos',
      area_recepcion_cortinas: 'Cortinas filtro',
      //AREA LAVADO
      area_lavado_paredes: 'Paredes, pisos, techo',
      area_lavado_anjeos: 'Anjeos',
      area_lavado_extractores: 'Extractores',
      area_lavado_rodillos: 'Rodillos drench',
      area_lavado_rodillosLavado: 'Rodillos lavado fruta',
      area_lavado_extractoresSecado: 'Extractores secado',
      //AREA PRODUCCION
      area_produccion_pisos: 'Pisos, paredes, puertas',
      area_produccion_ventiladores: 'Ventiladores túnel de secado',
      area_produccion_paredes: 'paredes túnel de secado',
      area_produccion_ventiladoresPiso: 'Ventiladores piso',
      area_produccion_rodillosEncerados: 'Rodillos encerados',
      area_produccion_cilindro: 'Cilindro almacenamiento cera',
      area_produccion_clasificadora: 'Clasificadora',
      area_produccion_bandejas: 'Bandejas Clasificadora',
      area_produccion_soportes: 'Soportes pesaje cajas',
      area_produccion_extractores: 'Extractores',
      area_produccion_anjeos: 'Anjeos',
      area_produccion_cuarto: 'Cuarto de insumos',
      area_produccion_oficina: 'Oficina',
      area_produccion_laboratorio: 'Laboratorio',
      area_produccion_filtro: 'Filtro desinfección calzado y manos',
      area_produccion_canecas: 'Canecas residuos',
      area_produccion_estibadores: 'Estibadores',
      area_produccion_escaleras: 'Escaleras',
      area_produccion_carritos: 'Carritos',
      area_produccion_herramientas: 'Herramientas de trabajo',
      //PASILLO
      area_pasillo_pisos: 'Pisos, paredes',
      //AREA CARTON
      area_carton_pisos: 'Pisos, estibas',
      area_carton_esstibadores: 'Estibadores',
      //AREA SOCIAL
      area_sociales_lockers: 'Lockers',
      area_sociales_comedor: 'Comedor',
      area_sociales_nevera: 'Nevera',
      area_sociales_hornos: 'Hornos microondas',
      area_sociales_pisos: 'Pisos',
      area_sociales_paredes: 'Paredes',
      area_sociales_anjeos: 'Anjeos',
      area_sociales_canecas: 'Canecas residuos',
      area_sociales_exteriores: 'Exteriores planta',
      area_sociales_comedorExterior: 'Comedor exterior',
      //////////////////////////////////////////////////
      //OBS CUARTOS
      area_cuartos_cortinas_observaciones: 'Observaciones Cortinas filtro',
      area_cuartos_muelle_observaciones: 'Observaciones Muelle',
      area_cuartos_pisos_observaciones: 'Observaciones Pisos, paredes, techos',
      area_cuartos_ventiladores_observaciones: 'Observaciones Ventiladores',
      //OBS RECEPCIÓN
      area_recepcion_pisos_observaciones: 'Observaciones Pisos, paredes, puertas',
      area_recepcion_estibas_observaciones: 'Observaciones Estibas plásticas',
      area_recepcion_anjeos_observaciones: 'Observaciones Anjeos',
      area_recepcion_vigas_observaciones: 'Observaciones Vigas',
      area_recepcion_muelles_observaciones: 'Observaciones Muelles',
      area_recepcion_desverdizado_observaciones: 'Observaciones Cuartos desverdizado',
      area_recepcion_tanque_observaciones: 'Observaciones Tanque reserva agua',
      area_recepcion_soporte_observaciones: 'Observaciones Soporte tanque reserva',
      area_recepcion_oficina_observaciones: 'Observaciones Oficina',
      area_recepcion_estibadores_observaciones: 'Observaciones Estibadores',
      area_recepcion_tanqueInmersion_observaciones: 'Observaciones Tanque inmersión',
      area_recepcion_banda_observaciones: 'Observaciones Banda transportadora',
      area_recepcion_filtro_observaciones: 'Observaciones Filtro desinfección calzado y manos',
      area_recepcion_canecas_observaciones: 'Observaciones Canecas residuos',
      area_recepcion_cortinas_observaciones: 'Observaciones Cortinas filtro',
      //OBS LAVADO
      area_lavado_paredes_observaciones: 'Observaciones Paredes, pisos, techo',
      area_lavado_anjeos_observaciones: 'Observaciones Anjeos',
      area_lavado_extractores_observaciones: 'Observaciones Extractores',
      area_lavado_rodillos_observaciones: 'Observaciones Rodillos drench',
      area_lavado_rodillosLavado_observaciones: 'Observaciones Rodillos lavado fruta',
      area_lavado_extractoresSecado_observaciones: 'Observaciones Extractores secado',
      //OBS PRODUCCION
      area_produccion_pisos_observaciones: 'Observaciones Pisos, paredes, puertas',
      area_produccion_ventiladores_observaciones: 'Observaciones Ventiladores túnel de secado',
      area_produccion_paredes_observaciones: 'Observaciones Paredes túnel de secado',
      area_produccion_ventiladoresPiso_observaciones: 'Observaciones Ventiladores piso',
      area_produccion_rodillosEncerados_observaciones: 'Observaciones Rodillos encerados',
      area_produccion_cilindro_observaciones: 'Observaciones Cilindro almacenamiento cera',
      area_produccion_clasificadora_observaciones: 'Observaciones Clasificadora',
      area_produccion_bandejas_observaciones: 'Observaciones Bandejas Clasificadora',
      area_produccion_soportes_observaciones: 'Observaciones Soportes pesaje cajas',
      area_produccion_extractores_observaciones: 'Observaciones Extractores',
      area_produccion_anjeos_observaciones: 'Observaciones Anjeos',
      area_produccion_cuarto_observaciones: 'Observaciones Cuarto de insumos',
      area_produccion_oficina_observaciones: 'Observaciones Oficina',
      area_produccion_laboratorio_observaciones: 'Observaciones Laboratorio',
      area_produccion_filtro_observaciones: 'Observaciones Filtro desinfección calzado y manos',
      area_produccion_canecas_observaciones: 'Observaciones Canecas residuos',
      area_produccion_estibadores_observaciones: 'Observaciones Estibadores',
      area_produccion_escaleras_observaciones: 'Observaciones Escaleras',
      area_produccion_carritos_observaciones: 'Observaciones Carritos',
      area_produccion_herramientas_observaciones: 'Observaciones Herramientas de trabajo',
      //OBS PASILLO
      area_pasillo_pisos_observaciones: 'Observaciones Pisos, paredes',
      //OBS CARTON
      area_carton_pisos_observaciones: 'Observaciones Pisos, estibas',
      area_carton_estibadores_observaciones: 'Observaciones Estibadores',
      //OBS SOCIALES
      area_sociales_lockers_observaciones: 'Observaciones Lockers',
      area_sociales_comedor_observaciones: 'Observaciones Comedor',
      area_sociales_nevera_observaciones: 'Observaciones Nevera',
      area_sociales_hornos_observaciones: 'Observaciones Hornos microondas',
      area_sociales_pisos_observaciones: 'Observaciones Pisos',
      area_sociales_paredes_observaciones: 'Observaciones Paredes',
      area_sociales_anjeos_observaciones: 'Observaciones Anjeos',
      area_sociales_canecas_observaciones: 'Observaciones Canecas residuos',
      area_sociales_exteriores_observaciones: 'Observaciones Exteriores planta',
      area_sociales_comedorExterior_observaciones: 'Observaciones Comedor exterior',
      

    };


    return (
      <div>
        <h2 style={thStyle}>REGISTRO DE LIMPIEZA Y DESINFECCIÓN GENERAL MENSUAL</h2>
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
              <th style={thStyle}>Responsable</th>
              <th style={thStyle}>Tipo Área</th>
              <th style={thStyle}>Área</th>
              <th style={thStyle}>Observaciones</th>
            </tr>
          </thead>
          <tbody>
          {Object.entries(this.state.filteredData || this.state.data).map(([fecha, elementos], index) => (
              <tr key={index} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
                <td style={tdStyle}>{format(new Date(fecha), 'dd/MM/yyyy HH:mm:ss')}</td>
                <td style={tdStyle}>{elementos.responsable}</td>
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
                    if (elemento !== 'responsable' && !elemento.includes('_observaciones')) {
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

export default TablaLimpiezaMensual;