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
  max-width: 3000px;
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

  &:hover th {
    background-color: #ddd; /* Cambia el color de fondo al pasar el mouse sobre los títulos */
  }
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  background-color: #f2f2f2;
  transition: background-color 0.3s ease-in-out; /* Agrega la transición al color de fondo */
  position: relative;

  &:hover {
    background-color: #ddd; /* Cambia el color de fondo al pasar el mouse sobre el título */
    transition: background-color 0.3s ease-in-out;
  }

  // Resto del estilo...
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

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  & > * {
    margin-right: 20px;
  }
`;

const FilterSelect = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const FilterInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const FilterDate = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const FilterDateLabel = styled.label`
  margin-right: 10px;
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
}`;

const LoteTable: React.FC = () => {
  // Estado para almacenar los datos originales del lote
  const [originalLoteData, setOriginalLoteData] = useState<LoteData[] | null>(null);
  // Estado para almacenar los datos filtrados del lote
  const [filteredLoteData, setFilteredLoteData] = useState<LoteData[] | null>(null);
  const [filtros, setFiltros] = useState<{ tipoFruta: string | ''; nombrePredio: string | ''; fechaInicio: string; fechaFin: string }>({
    tipoFruta: '',
    nombrePredio: '',
    fechaInicio: '',
    fechaFin: '',
  }); // Estado para los filtros

  // Efecto para realizar la solicitud al servidor y almacenar los datos originales
  useEffect(() => {
    const obtenerDatosDelServidor = async () => {
      try {
        // Realizar la solicitud al servidor sin filtros
        const request = {
          action: 'obtenerDatosLotes',
          data: { filtros: {} },
        };

        const datosLotes = await window.api.inventario(request);

        // Almacenar los datos originales en el estado
        setOriginalLoteData(datosLotes.data);
      } catch (error) {
        console.error('Error al obtener datos del lote:', error);
      }
    };

    // Llamar a la función de solicitud
    obtenerDatosDelServidor();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Efecto para filtrar los datos cuando cambian los filtros
  useEffect(() => {
    // Filtrar los datos originales en base a los filtros
    const filteredData =
      originalLoteData &&
      originalLoteData.filter(
        (lote) =>
          (filtros.tipoFruta === '' || lote.tipoFruta === filtros.tipoFruta) &&
          (filtros.nombrePredio === '' || lote.nombrePredio.includes(filtros.nombrePredio)) &&
          (!filtros.fechaInicio || lote.fechaIngreso >= filtros.fechaInicio) &&
          (!filtros.fechaFin || lote.fechaIngreso <= filtros.fechaFin)
      );

    // Almacenar los datos filtrados en el estado
    setFilteredLoteData(filteredData);
  }, [originalLoteData, filtros]);

  // Función para renderizar la tabla
  const renderTable = () => {
    const dataToRender = filteredLoteData || originalLoteData;
  
    if (!dataToRender) {
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
          {dataToRender.map((lote) => (
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
      <div key={index} style={{ marginBottom: '10px' }}>
        <div>
          <strong style={{ color: 'white' }}>
            {calidad.replace(/12:/, '')}:
          </strong>
          <table>
            <thead>
              <tr>
                <Th>Calidad 1</Th>
                <Th>Calidad 1.5</Th>
                <Th>Calidad 2</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>{lote.exportacion[calidad].calidad1}</Td>
                <Td>{lote.exportacion[calidad].calidad1_5}</Td>
                <Td>{lote.exportacion[calidad].calidad2}</Td>
              </tr>
            </tbody>
          </table>
        </div>
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
      <FilterContainer>
        <FilterSelect
          value={filtros.tipoFruta}
          onChange={(e) => setFiltros({ ...filtros, tipoFruta: e.target.value })}
        >
          <option value="">Seleccionar Todos</option>
          <option value="Naranja">Naranja</option>
          <option value="Limon">Limón</option>
        </FilterSelect>
        <FilterInput
          type="text"
          placeholder="Nombre del Predio"
          value={filtros.nombrePredio}
          onChange={(e) => setFiltros({ ...filtros, nombrePredio: e.target.value })}
        />
        <div>
          <FilterDateLabel>Fecha de Inicio:</FilterDateLabel>
          <FilterDate
            type="date"
            placeholder="Fecha de Inicio"
            value={filtros.fechaInicio}
            onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
          />
        </div>
        <div>
          <FilterDateLabel>Fecha de Fin:</FilterDateLabel>
          <FilterDate
            type="date"
            placeholder="Fecha de Fin"
            value={filtros.fechaFin}
            onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
          />
        </div>
      </FilterContainer>
      {renderTable()}
    </Container>
  );
};

export default LoteTable;