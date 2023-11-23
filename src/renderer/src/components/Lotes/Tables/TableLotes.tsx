import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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
  max-height: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    max-height: 1000px;
  }

  &:hover th {
    background-color: #ddd;
  }
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  background-color: #f2f2f2;
  transition: background-color 0.3s ease-in-out;
  position: relative;

  &:hover {
    background-color: #ddd;
    transition: background-color 0.3s ease-in-out;
  }
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
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
`;

// const ColumnVisibilityToggle = styled.label`
//   display: flex;
//   align-items: center;
//   margin-right: 10px; /* Ajusta según sea necesario para el espacio entre las columnas */
//   cursor: pointer;

//   input {
//     margin-right: 5px;
//   }
// `;

const ColumnVisibilityToggle = styled(({ label, checked, onChange, className }) => (
  <label className={className}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    {label}
  </label>
))`
  display: flex;
  align-items: center;
  margin-right: 10px; /* Ajusta según sea necesario para el espacio entre las columnas */
  cursor: pointer;
  font-size: 17px; /* Tamaño de fuente ajustado */
  margin-bottom: 5px; /* Ajusta según sea necesario */
  input {

    margin-right: 5px;
  }

  span {
    margin-bottom: 2px; /* Ajusta el espacio entre el texto y el borde inferior */
  }
`;


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
  // Estado para la visibilidad de las columnas
  const [columnVisibility, setColumnVisibility] = useState({
    canastillas: false,
    kilos: false,
    placa: false,
    promedio: false,
    rendimiento: false,
    descarteLavado: false,
    descarteEncerado: false,
    directoNacional: false,
    frutaNacional: false,
    desverdizado: false,
    exportacion: false,
  });

  useEffect(() => {
    const obtenerDatosDelServidor = async () => {
      try {
        const request = {
          action: 'obtenerDatosLotes',
          data: { filtros: {} },
        };

        const datosLotes = await window.api.inventario(request);
        setOriginalLoteData(datosLotes.data);
      } catch (error) {
        console.error('Error al obtener datos del lote:', error);
      }
    };

    obtenerDatosDelServidor();
  }, []);

  useEffect(() => {
    const filteredData =
      originalLoteData &&
      originalLoteData.filter(
        (lote) =>
          (filtros.tipoFruta === '' || lote.tipoFruta === filtros.tipoFruta) &&
          (filtros.nombrePredio === '' || lote.nombrePredio.includes(filtros.nombrePredio)) &&
          (!filtros.fechaInicio || lote.fechaIngreso >= filtros.fechaInicio) &&
          (!filtros.fechaFin || lote.fechaIngreso <= filtros.fechaFin)
      );

    setFilteredLoteData(filteredData);
  }, [originalLoteData, filtros]);

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
            {columnVisibility.canastillas && <Th>Canastillas</Th>}
            <Th>Tipo de Fruta</Th>
            <Th>Observaciones</Th>
            {columnVisibility.kilos && <Th>Kilos</Th>}
            {columnVisibility.placa && <Th>Placa</Th>}
            {columnVisibility.kilosVaciados && <Th>Kilos Vaciados</Th>}
            {columnVisibility.promedio && <Th>Promedio</Th>}
            {columnVisibility.rendimiento && <Th>Rendimiento</Th>}
            {columnVisibility.descarteLavado && <Th>Descarte Lavado</Th>}
            {columnVisibility.descarteEncerado && <Th>Descarte Encerado</Th>}
            {columnVisibility.directoNacional && <Th>Directo Nacional</Th>}
            {columnVisibility.frutaNacional && <Th>Fruta Nacional</Th>}
            {columnVisibility.desverdizado && <Th>Desverdizado</Th>}
            {columnVisibility.exportacion && <Th>Exportación</Th>}
          </tr>
        </thead>
        <tbody>
          {dataToRender.map((lote) => (
            <tr key={lote._id}>
              <Td>{lote._id}</Td>
              <Td>{lote.nombrePredio}</Td>
              <Td>{lote.fechaIngreso}</Td>
              {columnVisibility.canastillas && <Td>{lote.canastillas}</Td>}
              <Td>{lote.tipoFruta}</Td>
              <Td>{lote.observaciones}</Td>
              {columnVisibility.kilos && <Td>{lote.kilos}</Td>}
              {columnVisibility.placa && <Td>{lote.placa}</Td>}
              {columnVisibility.kilosVaciados && <Td>{lote.kilosVaciados}</Td>}
              {columnVisibility.promedio && <Td>{lote.promedio}</Td>}
              {columnVisibility.rendimiento && <Td>{lote.rendimiento}</Td>}
              {columnVisibility.descarteLavado && (
                <Td>
                  {lote.descarteLavado &&
                    `General: ${lote.descarteLavado.descarteGeneral}, Pareja: ${lote.descarteLavado.pareja}, Balin: ${lote.descarteLavado.balin}, Descompuesta: ${lote.descarteLavado.descompuesta}, Piel: ${lote.descarteLavado.piel} , Hojas: ${lote.descarteLavado.hojas}`}
                </Td>
              )}
              {columnVisibility.descarteEncerado && (
                <Td>
                  {lote.descarteEncerado &&
                    `General: ${lote.descarteEncerado.descarteGeneral}, Pareja: ${lote.descarteEncerado.pareja}, Balin: ${lote.descarteEncerado.balin}, Extra: ${lote.descarteEncerado.extra}, Descompuesta: ${lote.descarteEncerado.descompuesta}, Suelo: ${lote.descarteEncerado.suelo}`}
                </Td>
              )}
              {columnVisibility.directoNacional && <Td>{lote.directoNacional}</Td>}
              {columnVisibility.frutaNacional && <Td>{lote.frutaNacional}</Td>}
              {columnVisibility.desverdizado && <Td>{lote.desverdizado}</Td>}
              {columnVisibility.exportacion && (
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
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <Title>Lotes</Title>
      <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <ColumnVisibilityToggle
  label="Canastillas"
  checked={columnVisibility.canastillas}
  onChange={() =>
    setColumnVisibility((prev) => ({ ...prev, canastillas: !prev.canastillas }))
  }
>
  <input type="checkbox" checked={columnVisibility.canastillas} onChange={() => null} />
  <span>Canastillas</span>
</ColumnVisibilityToggle>
        <ColumnVisibilityToggle
          label="Kilos"
          checked={columnVisibility.kilos}
          onChange={() => setColumnVisibility((prev) => ({ ...prev, kilos: !prev.kilos }))}
        />
          <ColumnVisibilityToggle
        label="Placa"
        checked={columnVisibility.placa}
        onChange={() => setColumnVisibility((prev) => ({ ...prev, placa: !prev.placa }))}
      />
      <ColumnVisibilityToggle
        label="Kilos Vaciados"
        checked={columnVisibility.kilosVaciados}
        onChange={() => setColumnVisibility((prev) => ({ ...prev, kilosVaciados: !prev.kilosVaciados }))}
      />
      <ColumnVisibilityToggle
        label="Promedio"
        checked={columnVisibility.promedio}
        onChange={() => setColumnVisibility((prev) => ({ ...prev, promedio: !prev.promedio }))}
      />
      <ColumnVisibilityToggle
        label="Rendimiento"
        checked={columnVisibility.rendimiento}
        onChange={() => setColumnVisibility((prev) => ({ ...prev, rendimiento: !prev.rendimiento }))}
      />
      <ColumnVisibilityToggle
        label="Descarte Lavado"
        checked={columnVisibility.descarteLavado}
        onChange={() => setColumnVisibility((prev) => ({ ...prev, descarteLavado: !prev.descarteLavado }))}
      />
      <ColumnVisibilityToggle
        label="Descarte Encerado"
        checked={columnVisibility.descarteEncerado}
        onChange={() => setColumnVisibility((prev) => ({ ...prev, descarteEncerado: !prev.descarteEncerado }))}
      />
      <ColumnVisibilityToggle
        label="Directo Nacional"
        checked={columnVisibility.directoNacional}
        onChange={() => setColumnVisibility((prev) => ({ ...prev, directoNacional: !prev.directoNacional }))}
      />
      <ColumnVisibilityToggle
        label="Fruta Nacional"
        checked={columnVisibility.frutaNacional}
        onChange={() => setColumnVisibility((prev) => ({ ...prev, frutaNacional: !prev.frutaNacional }))}
      />
      <ColumnVisibilityToggle
        label="Desverdizado"
        checked={columnVisibility.desverdizado}
        onChange={() => setColumnVisibility((prev) => ({ ...prev, desverdizado: !prev.desverdizado }))}
      />
      <ColumnVisibilityToggle
        label="Exportación"
        checked={columnVisibility.exportacion}
        onChange={() => setColumnVisibility((prev) => ({ ...prev, exportacion: !prev.exportacion }))}
      />
       </div>
      </div>
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