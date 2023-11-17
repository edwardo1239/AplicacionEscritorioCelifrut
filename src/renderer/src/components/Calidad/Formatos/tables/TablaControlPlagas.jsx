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

const filterContainerStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  marginRight: '10px',
};

const inputStyle = {
  marginRight: '20px',
  padding: '5px',
};

const selectStyle = {
  padding: '5px',
};


class TablaControlPlagas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // Aquí almacenaremos los datos quemados
    };
  }

  componentDidMount() {
   
    const request = { action: 'obtenerRegistroControlPlagas' }
    window.api.calidad(request).then( (newData) => {
      console.log(newData.data)

      // const dataArray = Object.entries(newData.data).map( item => ({
      //   fecha: format(new Date(item.fecha), 'dd/MM/yyyy HH:mm:ss'),
      //   ...item
      // }))
     this.setState({ data: newData.data })
    })
  }
  
  getAreaName = (key) => {
    if (key.startsWith('area_control')) {
      return 'Area Control';
    } else if (key.startsWith('area_cebo')) {
      return 'Area Cebo';
    } else if (key.startsWith('area_hallazgos')) {
      return 'Area Hallazgos';
    }
    return 'Otro'; // Si hay claves no identificadas
  };

  handleFechaFilter = event => {
    const fechaFiltrada = event.target.value;
    console.log(this.state)
    const { originalData } = this.state;

    const filteredData = originalData.filter(item => {
      // Convertir la fecha de los datos a texto y comparar con la fecha filtrada
      return item.fecha.includes(fechaFiltrada);
    });

    this.setState({ data: filteredData });
  };

  handleAreaFilter = (event) => {
    const areaFiltrada = event.target.value;
    const  originalData  = this.state.data;

    const filteredData = originalData.filter(item => {
  
      return Object.keys(item).some(key => key.startsWith(areaFiltrada));
    });

    this.setState({ data: filteredData });
  };
  

  render() {
    const nombreCampo = {
      //AREA CONTROL
      area_control_plagas: 'Plagas en áreas exteriores',
      area_control_contenedores: 'Contenedores de basura limpios, con tapa y bolsa correspondiente',
      area_control_areasLimpias: 'Áreas limpias, libres de residuos solidos, material vegetal y estancamiento de agua',
      area_control_ausencia: 'Ausencia de animales domésticos dentro de la planta',
      area_control_rejillas: 'Rejillas, drenajes, sifones y vistieres',
      area_control_ventanas: 'Ventanas, vidrios y angeos en buen estado',
      area_control_puertas: 'Puertas',
      area_control_mallas: 'Mallas de protección para extractores y ventilación',
      area_control_espacios: 'Espacios entre equipos',
      area_control_estado: 'Estado sótano',
      //AREA CEBO
      area_cebo_consumo: 'Consumo',
      //AREA HALLAZGOS
      area_hallazgos_roedores: 'Roedores vivos o muertos',
      area_hallazgos_cucarachas: 'Cucarachas',
      area_hallazgos_hormigas: 'Hormigas',
      area_hallazgos_insectos: 'Insectos',
      area_hallazgos_excremento: 'Excremento',
      area_hallazgos_sonidos: 'Sonidos',
      area_hallazgos_huellas: 'Huellas',
      area_hallazgos_madrigueras: 'Madrigueras',
      area_hallazgos_olores: 'Olores anormales',
      area_hallazgos_pelos: 'Pelos',
      area_hallazgos_manchas: 'Manchas de orina',
      area_hallazgos_otras: 'Otras plagas',


    };
    const nombreObservaciones = {
      //AREA CONTROL
      area_control_plagas_observaciones: 'Observaciónes Plagas en áreas exteriores',
      area_control_contenedores_observaciones: 'Observaciones Contenedores de basura limpios, con tapa y bolsa correspondiente',
      area_control_areasLimpias_observaciones: 'Observaciones Áreas limpias, libres de residuos solidos, material vegetal y estancamiento de agua',
      area_control_ausencia_observaciones: 'Observaciones Ausencia de animales domésticos dentro de la planta',
      area_control_rejillas_observaciones: 'Observaciones Rejillas, drenajes, sifones y vistieres',
      area_control_ventanas_observaciones: 'Observaciones Ventanas, vidrios y angeos en buen estado',
      area_control_puertas_observaciones: 'Observaciones de Puertas',
      area_control_mallas_observaciones: 'Observaciones Mallas de protección para extractores y ventilación',
      area_control_espacios_observaciones: 'Observaciones Espacios entre equipos',
      area_control_estado_observaciones: 'Observaciones Estado sótano',
      //AREA CEBO
      area_cebo_consumo_observaciones: 'Observaciones Consumo',
      //HALLAZGOS
      area_hallazgos_cucarachas_observaciones: 'Observaciones Cucarachas',
      area_hallazgos_roedores_observaciones: 'Observaciones Roedores vivos o muertos',
      area_hallazgos_hormigas_observaciones: 'Observaciones Hormigas',
      area_hallazgos_accion_insectos_observaciones: 'Observaciones Insectos',
      area_hallazgos_excremento_observaciones: 'Observaciones Excremento',
      area_hallazgos_sonidos_observaciones: 'Observaciones Sonidos',
      area_hallazgos_huellas_observaciones: 'Observaciones Huellas',
      area_hallazgos_madrigueras_observaciones: 'Observaciones Madrigueras',
      area_hallazgos_olores_observaciones: 'Observaciones Olores anormales',
      area_hallazgos_pelos_observaciones: 'Observaciones Pelos',
      area_hallazgos_manchas_observaciones: 'Observaciones Manchas de orina',
      area_hallazgos_otras_observaciones: 'Otras Plagas', 
    };

    const nombreAcciones = {
      area_control_accion_plagas_observaciones: 'Acción Correctiva/Preventiva Plagas en áreas exteriores',
      area_control_accion_contenedores_observaciones: 'Acción Correctiva/Preventiva Contenedores de basura limpios, con tapa y bolsa correspondiente',
      area_control_accion_areasLimpias_observaciones: 'Acción Correctiva/Preventiva Áreas limpias, libres de residuos solidos, material vegetal y estancamiento de agua',
      area_control_accion_ausencia_observaciones: 'Acción Correctiva/Preventiva Ausencia de animales domésticos dentro de la planta',
      area_control_accion_rejillas_observaciones: 'Acción Correctiva/Preventiva Rejillas, drenajes, sifones y vistieres',
      area_control_accion_ventanas_observaciones: 'Acción Correctiva/Preventiva Ventanas, vidrios y angeos en buen estado',
      area_control_accion_puertas_observaciones: 'Acción Correctiva/Preventiva Puertas',
      area_control_accion_mallas_observaciones: 'Acción Correctiva/Preventiva Mallas de protección para extractores y ventilación',
      area_control_accion_espacios_observaciones: 'Acción Correctiva/Preventiva Espacios entre equipos',
      area_control_accion_estado_observaciones: 'Acción Correctiva/Preventiva Estado sótano',
      //CEBOs
      area_cebo_accion_consumo_observaciones: 'Acción Correctiva/Preventiva Consumo',
      //HALLAZGOS
      area_hallazgos_accion_roedores_observaciones: 'Acción Correctiva/Preventiva Roedores vivos o muertos',
      area_hallazgos_accion_cucarachas_observaciones: 'Acción Correctiva/Preventiva Cucarachas',
      area_hallazgos_accion_insectos_observaciones: 'Acción Correctiva/Preventiva Insectos',
      area_hallazgos_accion_excremento_observaciones: 'Acción Correctiva/Preventiva Excremento',
      area_hallazgos_accion_sonidos_observaciones: 'Acción Correctiva/Preventiva Sonidos',
      area_hallazgos_accion_huellas_observaciones: 'Acción Correctiva/Preventiva Huellas',
      area_hallazgos_accion_madrigueras_observaciones: 'Acción Correctiva/Preventiva Madrigueras',
      area_hallazgos_accion_olores_observaciones: 'Acción Correctiva/Preventiva Olores anormales',
      area_hallazgos_accion_pelos_observaciones: 'Acción Correctiva/Preventiva Pelos',
      area_hallazgos_accion_manchas_observaciones: 'Acción Correctiva/Preventiva Manchas de orina',
      area_hallazgos_accion_otras_observaciones: 'Acción Correctiva/Preventiva Otras Plagas',
    };

    return (
      <div>
        <h2 style={thStyle}>CONTROL Y MONITOREO DE PLAGAS</h2>
        <div style={filterContainerStyle}>
        <label htmlFor="fechaFilter" style={labelStyle}>
          Filtrar por Fecha:
        </label>
        <input
          type="text"
          id="fechaFilter"
          onChange={this.handleFechaFilter}
          style={inputStyle}
        />
        <label htmlFor="areaFilter" style={labelStyle}>
          Filtrar por Área:
        </label>
        <select id="areaFilter" onChange={(e) => this.handleAreaFilter(e)} style={selectStyle}>
          <option value="">Todas</option>
          <option value="area_control">Área de Control</option>
          <option value="area_cebo">Área de Cebo</option>
          <option value="area_hallazgos">Área de Hallazgos</option>
        </select>
      </div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Responsable</th>
              <th style={thStyle}>Tipo Área</th>
              <th style={thStyle}>Área</th>
              <th style={thStyle}>Observaciones</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((item, index) => (
              <tr key={index} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
                <td style={tdStyle}>{format(new Date(item.fecha), 'dd/MM/yyyy HH:mm:ss')}</td>
                <td style={tdStyle}>{item.responsable}</td>
                <td style={tdStyle}>
                  {Object.keys(item).reduce((areas, key) => {
                    if (key !== 'responsable' && key !== 'fecha') {
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
                  {Object.entries(item).map(([key, value]) => {
                    if (key !== "responsable" && key !== "fecha" && key !== "_id" && key !== "__v" && !key.includes('observaciones') && value !== '') {
                      const nombreMostrado = nombreCampo[key] || key; // Usa el nombre deseado si está definido en nombreCampo
                      return (
                        <p key={key} style={tdStyle}>
                          {nombreMostrado}: {value ? 'Si' : 'No'}
                        </p>
                      );
                    }
                    return null;
                  })}
                </td>
                <td style={tdStyle}>
                  {Object.entries(item).map(([key, value]) => {
                    if (key !== "responsable" && key !== "fecha" && key.includes('observaciones') && !key.includes('accion') && value !== '') {
                      const nombreMostrado = nombreObservaciones[key] || key; // Usa el nombre deseado si está definido en nombreObservaciones
                      return (
                        <p key={key} style={tdStyle}>
                          {nombreMostrado}: {value}
                        </p>
                      );
                    }
                    return null;
                  })}
                </td>
                <td style={tdStyle}>
                  {Object.entries(item).map(([key, value]) => {
                    if (key !== "responsable" && key !== "fecha" && key.includes('accion') && value !== '') {
                      const nombreMostrado = nombreAcciones[key] || key; // Usa el nombre deseado si está definido en nombreAcciones
                      return (
                        <p key={key} style={tdStyle}>
                          {nombreMostrado}: {value}
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

export default TablaControlPlagas;