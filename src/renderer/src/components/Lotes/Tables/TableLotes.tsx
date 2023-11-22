// Importa las librerías necesarias
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Definir el tipo de datos que recibes del servidor
interface LoteData {
  _id: string;
  nombrePredio: string;
  fechaIngreso: string;
  canastillas: string;
  tipoFruta: string;
  observaciones: string;
  kilos: number;
  placa: string;
  kilosVaciados: number;
  promedio: number;
  rendimiento: number;
  descarteLavado: {
    descarteGeneral: number;
    pareja: number;
    balin: number;
    descompuesta: number;
    piel: number;
    hojas: number;
  };
  descarteEncerado: {
    descarteGeneral: number;
    pareja: number;
    balin: number;
    extra: number;
    descompuesta: number;
    suelo: number;
  };
  directoNacional: number;
  frutaNacional: number;
  desverdizado: number;
  exportacion: {
    [key: string]: {
      calidad1: number;
      calidad1_5: number;
      calidad2: number;
    };
  };
}

// Estilos con styled-components
const Container = styled.div`
  max-width: 2000px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  max-height: 500px; /* Altura máxima de la tabla */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    max-height: 1000px; /* Ajusta según sea necesario */
  }
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  background-color: #f2f2f2;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  //white-space: pre-line; /* Esta propiedad permite que los saltos de línea se respeten */
`;

const Loading = styled.p`
  text-align: center;
  margin-top: 20px;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  position: relative;

  &:hover {
    color: #4caf50;
    transition: color 0.3s ease-in-out;
  }

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #4caf50;
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out;
  }

  &:hover:before {
    visibility: visible;
    transform: scaleX(1);
  }
`;

const LoteTable: React.FC = () => {
  // Estado para almacenar los datos del lote
  const [loteData, setLoteData] = useState<LoteData[] | null>(null);

  // Efecto para realizar la solicitud al servidor
  useEffect(() => {
    const obtenerDatosDelServidor = async () => {
      try {
        // Realizar la solicitud al servidor
        const request = { action: 'obtenerDatosLotes' }; // ajusta 'obtenerDatosLote' según tu API
        const datosLotes = await window.api.inventario(request);

        // Almacenar los datos en el estado
        setLoteData(datosLotes.data);
      } catch (error) {
        console.error('Error al obtener datos del lote:', error);
      }
    };

    // Llamar a la función de solicitud
    obtenerDatosDelServidor();
  }, []); // El segundo argumento del useEffect indica que solo se debe ejecutar una vez al montar el componente

  // Función para renderizar la tabla
  const renderTable = () => {
    if (!loteData) {
      return <Loading>Cargando...</Loading>;
    }

    return (
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Nombre del Predio</Th>
            <Th>Fecha de Ingreso</Th>
            <Th>Canastillas</Th>
            <Th>Tipo de Fruta</Th>
            <Th>Observaciones</Th>
            <Th>Kilos</Th>
            <Th>Placa</Th>
            <Th>Kilos Vaciados</Th>
            <Th>Promedio</Th>
            <Th>Rendimiento</Th>
            <Th>Descarte Lavado</Th>
            <Th>Descarte Encerado</Th>
            <Th>Directo Nacional</Th>
            <Th>Fruta Nacional</Th>
            <Th>desverdizado</Th>
            <Th>Exportación</Th>
            {/* Agrega más encabezados según sea necesario */}
          </tr>
        </thead>
        <tbody>
          {/* Map sobre el array de datos para renderizar múltiples filas */}
          {loteData.map((lote) => (
            <tr key={lote._id}>
              <Td>{lote._id}</Td>
              <Td>{lote.nombrePredio}</Td>
              <Td>{lote.fechaIngreso}</Td>
              <Td>{lote.canastillas}</Td>
              <Td>{lote.tipoFruta}</Td>
              <Td>{lote.observaciones}</Td>
              <Td>{lote.kilos}</Td>
              <Td>{lote.placa}</Td>
              <Td>{lote.kilosVaciados}</Td>
              <Td>{lote.promedio}</Td>
              <Td>{lote.rendimiento}</Td>
              <Td>
                {lote.descarteLavado && `General: ${lote.descarteLavado.descarteGeneral}, Pareja: ${lote.descarteLavado.pareja}, Balin: ${lote.descarteLavado.balin}, Descompuesta: ${lote.descarteLavado.descompuesta}, Piel: ${lote.descarteLavado.piel} , Hojas: ${lote.descarteLavado.hojas}`}
              </Td>
              <Td>
                {lote.descarteEncerado && `General: ${lote.descarteEncerado.descarteGeneral}, Pareja: ${lote.descarteEncerado.pareja}, Balin: ${lote.descarteEncerado.balin}, Extra: ${lote.descarteEncerado.extra}, Descompuesta: ${lote.descarteEncerado.descompuesta}, Suelo: ${lote.descarteEncerado.suelo}`}
              </Td>
              <Td>{lote.directoNacional}</Td>
              <Td>{lote.frutaNacional}</Td>
              <Td>{lote.desverdizado}</Td>
              <Td>
  {lote.exportacion &&
    Object.keys(lote.exportacion).map((calidad, index) => (
      <div key={index}>
        {`${calidad}: ${lote.exportacion[calidad].calidad1}, ${lote.exportacion[calidad].calidad1_5}, ${lote.exportacion[calidad].calidad2}`}
      </div>
    ))}
</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <Title>Lotes</Title>
      {renderTable()}
    </Container>
  );
};

export default LoteTable;