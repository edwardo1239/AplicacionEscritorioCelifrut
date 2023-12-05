import React, { useEffect, useState } from 'react';

const TuComponente = () => {
  const [datos, setDatos] = useState([]);
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const obtenerDatosDelServidor = async () => {
      try {
        const request = { action: 'obtenerInformes' };
        const respuesta = await window.api.calidad(request);

        const lotes = respuesta.data.lotes;

        console.log('Datos del servidor:', lotes);

        if (Array.isArray(lotes) && lotes.length > 0) {
          setDatos(lotes);
          setDatosFiltrados(lotes); // Inicializa los datos filtrados con los datos originales
        } else {
          console.error('El formato de lotes no es el esperado o está vacío.');
        }
      } catch (error) {
        console.error('Error al obtener informes:', error);
      }
    };

    obtenerDatosDelServidor();
  }, []);

  useEffect(() => {
    const datosFiltrados = datos.filter(
      (item) =>
        item._id.toLowerCase().includes(filtro.toLowerCase()) ||
        item.nombrePredio.toLowerCase().includes(filtro.toLowerCase()) ||
        item.tipoFruta.toLowerCase().includes(filtro.toLowerCase())
    );
    setDatosFiltrados(datosFiltrados);
  }, [filtro, datos]);

  const handleAccederDocumento = (enlace) => {
    window.open(enlace, '_blank');
  };

  const tableCellStyle = {
    padding: '12px',
    textAlign: 'center',
  };

  const tableRowEvenStyle = {
    background: '#f3f6f1',
  };

  const tableRowOddStyle = {
    background: '#fff',
  };

  const tableRowStyle = {
    borderBottom: '1px solid #ddd',
    transition: 'background-color 0.3s ease',
  };

  const inputStyle = {
    padding: '8px',
    marginBottom: '10px',
    marginLeft: '450px',
  };

  const titleStyle = {
    color: '#000',
    backgroundColor: '#4CAF50',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '1.5em',
    transition: 'color 0.3s ease',
    cursor: 'pointer',
    marginTop: '8px',
    borderRadius: '10px',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <h2 style={titleStyle}>📊 INFORMES 📊</h2>
      <input
        type="text"
        placeholder="Buscador ..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={inputStyle}
      />
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '20px',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th style={tableCellStyle}>📦 ENF</th>
            <th style={tableCellStyle}>🍋 Nombre del Predio</th>
            <th style={tableCellStyle}>🍊 Tipo de Fruta</th>
            <th style={tableCellStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datosFiltrados.map((item, index) => (
            <tr
              key={index}
              style={{
                ...tableRowStyle,
                ...tableCellStyle,
                ...(index % 2 === 0 ? tableRowEvenStyle : tableRowOddStyle),
              }}
            >
              <td style={tableCellStyle}>{item._id}</td>
              <td style={tableCellStyle}>{item.nombrePredio}</td>
              <td style={tableCellStyle}>{item.tipoFruta}</td>
              <td style={tableCellStyle}>
                <button
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '5px',
                  }}
                  onClick={() => handleAccederDocumento(item.urlInformeCalidad)}
                >
                  Documento
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TuComponente;