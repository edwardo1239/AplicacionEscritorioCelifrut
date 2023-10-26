import React, { useEffect, useState } from 'react';
import './App.css';



export default function ClasificacionCalidadLimon({  loteSeleccionado }) {
  const initialState = {
    lote: loteSeleccionado, // Lote seleccionado
    detalles: {
      'Oleocelosis': { lavado: '', proceso: '' },
      'Fruta Verde': { lavado: '', proceso: '' },
      'Daños Herbicida': { lavado: '', proceso: '' },
      'Fruta Sobre Madura': { lavado: '', proceso: '' },
      'Daños Mecanicos': { lavado: '', proceso: '' },
      'Escama y Piojo Blanco': { lavado: '', proceso: '' },
      'Daños Acaro': { lavado: '', proceso: '' },
      'Mgrillo': { lavado: '', proceso: '' },
      'Elsinoe-Roña': { lavado: '', proceso: '' },
      'Melanosis': { lavado: '', proceso: '' },
      'Trips': { lavado: '', proceso: '' },
      'Division Celular': { lavado: '', proceso: '' },
      'Piel Nodular': { lavado: '', proceso: '' },
      'Fumagina': { lavado: '', proceso: '' },
      'Wood Pocket': { lavado: '', proceso: '' },
      'Sombra': { lavado: '', proceso: '' },
      'Mancha Fantasma': { lavado: '', proceso: '' },
      'Deshidratada': { lavado: '', proceso: '' },
    },
  };

  const [detalles, setDetalles] = useState(initialState);
  const [totalPorcentaje, setTotalPorcentaje] = useState(0);
  const [errorPorcentaje, setErrorPorcentaje] = useState('');
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [actualizacionExitosa, setActualizacionExitosa] = useState(false);

  useEffect(() => {
    calcularTotalPorcentaje();
  }, [detalles]);

  const calcularTotalPorcentaje = () => {
    const promedios = Object.keys(detalles.detalles).map((key) => {
      const lavado = parseFloat(detalles.detalles[key].lavado) || 0;
      const proceso = parseFloat(detalles.detalles[key].proceso) || 0;
      return (lavado + proceso) / 2;
    });

    const total = promedios.reduce((acu, promedio) => acu + promedio, 0);
    setTotalPorcentaje(total);
  };

  const handleGuardar = () => {
    if (totalPorcentaje !== 100) {
      setErrorPorcentaje('El porcentaje debe ser igual a 100%');
      setActualizacionExitosa(false);
      return;
    }
  
    setErrorPorcentaje('');
    setActualizacionExitosa(false);
  
    const clavesTransformadas = {
      Oleocelosis: 'oleocelosis',
      'Fruta Verde': 'frutaVerde',
      'Daños Herbicida': 'herbicida',
      'Fruta Sobre Madura': 'frutaMadura',
      'Daños Mecanicos': 'dannosMecanicos',
      'Escama y Piojo Blanco': 'escama',
      'Daños Acaro': 'acaro',
      Mgrillo: 'grillo',
      'Elsinoe-Roña': 'alsinoe',
      Melanosis: 'melanosis',
      'Division Celular': 'division',
      'Piel Nodular': 'piel',
      Fumagina: 'fumagina',
      'Wood Pocket': 'wood',
      'Trips': 'trips',
      'Sombra': 'sombra',
      'Mancha Fantasma': 'mancha',
      'Deshidratada': 'deshidratada',
    };
  
    const promedios = {}; // Objeto para almacenar los promedios
  
    Object.keys(detalles.detalles).forEach((key) => {
      const lavado = parseFloat(detalles.detalles[key].lavado) || 0;
      const proceso = parseFloat(detalles.detalles[key].proceso) || 0;
      const promedio = (lavado + proceso) / 2;
  
      // Utiliza el mapeo para obtener la clave transformada
      const claveTransformada = clavesTransformadas[key];
  
      promedios[claveTransformada] = promedio; // Almacena el promedio en el objeto con la clave transformada
    });
  
    const resultado = {
      lote: initialState.lote,
      acaro: promedios.acaro,
      alsinoe: promedios.alsinoe,
      dannosMecanicos: promedios.dannosMecanicos,
      deshidratada: promedios.deshidratada,
      division: promedios.division,
      escama: promedios.escama,
      frutaMadura: promedios.frutaMadura, 
      frutaVerde: promedios.frutaVerde,
      fumagina: promedios.fumagina,
      grillo: promedios.grillo,
      herbicida: promedios.herbicida,
      mancha: promedios.mancha,
      melanosis: promedios.melanosis,
      oleocelosis: promedios.oleocelosis,
      piel: promedios.piel,
      sombra: promedios.sombra,
      trips: promedios.trips,
      wood: promedios.wood
    };
  
    console.log('Resultado:', resultado);
    window.api.guardarClasificacionCalidad(resultado)
  
    setGuardadoExitoso(true);
    setActualizacionExitosa(true);
  
    setDetalles(initialState);
    setTotalPorcentaje(0);
  };

  const handleReset = () => {
    setDetalles(initialState);
    setTotalPorcentaje(0);
    setGuardadoExitoso(false);
    setActualizacionExitosa(false);
  };

  return (
    <div className="containerC">
      <div>
        <div className="floating-percentage">
          Total Porcentaje: {totalPorcentaje.toFixed(2)}%
        </div>
      </div>
      <div className="details-container">
        {Object.keys(detalles.detalles).reduce((columns, key, index) => {
          if (index % 5 === 0) {
            columns.push([]);
          }
          columns[columns.length - 1].push(
            <div key={key} className="detail-item">
              <h3>{key}</h3>
              <div className="row-container">
                <div className="column-container">
                  <div className="sub-label">Lavado:</div>
                  <input
                    className="input"
                    type="number"
                    onChange={(e) => {
                      const newDetalles = {
                        ...detalles,
                        detalles: {
                          ...detalles.detalles,
                          [key]: { ...detalles.detalles[key], lavado: e.target.value },
                        },
                      };
                      setDetalles(newDetalles);
                      calcularTotalPorcentaje();
                    }}
                    value={detalles.detalles[key].lavado}
                    placeholder="Lavado"
                  />
                </div>
                <div className="column-container">
                  <div className="sub-label">Proceso: </div>
                  <input
                    className="input"
                    type="number"
                    onChange={(e) => {
                      const newDetalles = {
                        ...detalles,
                        detalles: {
                          ...detalles.detalles,
                          [key]: { ...detalles.detalles[key], proceso: e.target.value },
                        },
                      };
                      setDetalles(newDetalles);
                      calcularTotalPorcentaje();
                    }}
                    value={detalles.detalles[key].proceso}
                    placeholder="Proceso"
                  />
                </div>
              </div>
            </div>
          );
          return columns;
        }, []).map((column, columnIndex) => (
          <div key={columnIndex} className="column-container">
            {column}
          </div>
        ))}
      </div>
      <div>{errorPorcentaje}</div>
      {guardadoExitoso ? (
        <div>
          Datos guardados correctamente.{' '}
          <button onClick={handleReset}>Aceptar</button>
        </div>
      ) : (
        <button className="button" onClick={handleGuardar}>
          Guardar
        </button>
      )}
      {actualizacionExitosa && (
        <div>Actualización exitosa. Los valores se han actualizado correctamente.</div>
      )}
    </div>
  );
};


