import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import GraficasLotes from './GraficasLotes'; // Reemplaza './ruta/del/componente/GraficasLotes' con la ruta correcta


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
  max-width: 4000px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const TotalKilosExportacion = styled.p`
  font-size: 19px;
  color: #00000; /* o el color que prefieras */
  margin-top: 10px;
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
  margin-bottom: 30px;
  margin-top: 35px;
  & > * {
    margin-right: 20px;
  }
`;

const FilterSelect = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 26px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover {
    background-color: #4caf50; /* Color de fondo en hover */
    color: #000; /* Color del texto en hover */
  }

  &:focus {
    outline: none;
    border-color: #4caf50; /* Color del borde al enfocar */
  }
`;

const FilterInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 26px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover {
    background-color: #4caf50; /* Color de fondo en hover */
    color: #000; /* Color del texto en hover */
  }

  &:focus {
    outline: none;
    border-color: #4caf50; /* Color del borde al enfocar */
  }
`;

const FilterDate = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 1px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover {
    background-color: #4caf50; /* Color de fondo en hover */
    color: #000; /* Color del texto en hover */
  }

  &:focus {
    outline: none;
    border-color: #4caf50; /* Color del borde al enfocar */
  }
`;

const FilterDateLabel = styled.label`
  margin-right: 8px;
`;


const CardContainer = styled.div`
  max-width: 6000px;
  margin: auto;
  padding: 20px;
  border-radius: 12px; /* Ajusta según sea necesario para hacer la tarjeta redonda */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f2f2f2; /* Ajusta el color de fondo según sea necesario */
`;
const CardContainerS = styled.div`
  max-width: 6000px;
  margin: auto;
  padding: 20px;
  border-radius: 12px; /* Ajusta según sea necesario para hacer la tarjeta redonda */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff; /* Ajusta el color de fondo según sea necesario */
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

const ColumnVisibilityToggle = styled(({ label, checked, onChange, className }) => (
  <label className={className}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    {label}
  </label>
))`
  display: flex;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
  font-size: 17px;
  margin-bottom: 10px;

  input {
    margin-right: 5px;

    &:checked {
      &::before {
        background-color: #4caf50 !important;
      }
    }
  }

  span {
    margin-bottom: 2px;
  }
`;


const LoteTable: React.FC = () => {
  const [originalLoteData, setOriginalLoteData] = useState<LoteData[] | null>(null);
  const [filteredLoteData, setFilteredLoteData] = useState<LoteData[] | null>(null);
  const [filtroRendimiento, setFiltroRendimiento] = useState<number | null>(null);
  const [porcentajesDeshidratacion, setPorcentajesDeshidratacion] = useState([]);
  const [totalDeshidratacion, setTotalDeshidratacion] = useState<number | null>(null);
  const [tipoGrafico, setTipoGrafico] = useState<string>('bar');
  const [filtros, setFiltros] = useState<{ tipoFruta: string | ''; nombrePredio: string | ''; fechaInicio: string; fechaFin: string }>({
    tipoFruta: '',
    nombrePredio: '',
    fechaInicio: '',
    fechaFin: '',
  });
  const [columnVisibility, setColumnVisibility] = useState({
    canastillas: false,
    kilos: false,
    placa: false,
    kilosVaciados: false,
    promedio: false,
    rendimiento: false,
    descarteLavado: false,
    descarteEncerado: false,
    directoNacional: false,
    frutaNacional: false,
    desverdizado: false,
    exportacion: false,
    observaciones: false,
    deshidratacion: true,
  });
  const [totalExportacionKilos, setTotalExportacionKilos] = useState<number>(0);
  const [selectedLote, setSelectedLote] = useState<string>('');
  
  // Nuevo estado para los datos de las gráficas
  const [graficasData, setGraficasData] = useState<{
    data: number[];
    labels: string[];
  } | null>(null);

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
          // Convertir a minúsculas antes de comparar
          (filtros.nombrePredio === '' || lote.nombrePredio.toLowerCase().includes(filtros.nombrePredio.toLowerCase())) &&
          (!filtros.fechaInicio || lote.fechaIngreso >= filtros.fechaInicio) &&
          (!filtros.fechaFin || lote.fechaIngreso <= filtros.fechaFin) &&
          (filtroRendimiento === null || lote.rendimiento >= filtroRendimiento)
      );
  
    setFilteredLoteData(filteredData);
  
    // Actualizar datos de las gráficas cuando cambian los filtros
    if (filteredData) {
      const dataCuantitativa = filteredData.map((lote) => lote.exportacion?.calidad1 || 0);
      const dataCualitativa = filteredData.map((lote) => lote.tipoFruta || '');
  
      setGraficasData({
        data: dataCuantitativa,
        labels: dataCualitativa,
      });
    } else {
      setGraficasData(null);
    }
  }, [originalLoteData, filtros, filtroRendimiento]);

  useEffect(() => {
    const calcularTotalDescarte = (descarte) => {
      return Object.values(descarte).reduce((total, cantidad) => total + cantidad, 0);
    };
  
    const obtenerTotalExportacion = (exportacion) => {
      if (!exportacion) return 0;
  
      return Object.values(exportacion).reduce(
        (totalCalidad, calidad) =>
          totalCalidad +
          calidad.calidad1 +
          calidad.calidad1_5 +
          calidad.calidad2,
        0
      );
    };
  
    const calcularTotales = () => {
      // Calcular el total de exportación
      let totalExportacionKilos = 0;
    
      if (filteredLoteData) {
        filteredLoteData.forEach((lote) => {
          if (lote.exportacion) {
            Object.values(lote.exportacion).forEach((calidad) => {
              totalExportacionKilos +=
                calidad.calidad1 + calidad.calidad1_5 + calidad.calidad2;
            });
          }
        });
      }
    
      setTotalExportacionKilos(totalExportacionKilos);
    
      // Calcular el total de deshidratación
      let totalDeshidratacion = 0;
      let totalKilos = 0;
    
      if (filteredLoteData && Array.isArray(filteredLoteData)) {
        filteredLoteData.forEach((lote) => {
          totalDeshidratacion +=
            parseFloat(calcularTotalDescarte(lote.descarteLavado)) +
            parseFloat(calcularTotalDescarte(lote.descarteEncerado)) +
            lote.directoNacional +
            obtenerTotalExportacion(lote.exportacion);
    
          totalKilos += lote.kilos || 0;
        });
      }
    
      setTotalDeshidratacion(totalDeshidratacion);
    
      const porcentajesDeshidratacion = (filteredLoteData || []).map((lote) => {
        if (columnVisibility.deshidratacion) {
          const deshidratacionPredio =
            parseFloat(calcularTotalDescarte(lote.descarteLavado)) +
            parseFloat(calcularTotalDescarte(lote.descarteEncerado)) +
            lote.directoNacional +
            obtenerTotalExportacion(lote.exportacion);
    
          const porcentaje =
            lote.kilos !== 0 ? (deshidratacionPredio / lote.kilos) * 100 : 0;
    
          const porcentajeAproximado = porcentaje.toFixed(2);
    
          return porcentajeAproximado + '%';
        } else {
          return ''; // o cualquier otro valor que desees mostrar cuando la columna no está visible
        }
      });
    
      setPorcentajesDeshidratacion(porcentajesDeshidratacion);
    };
    
  
    // Llamada a calcularTotales dentro del bloque de useEffect
    calcularTotales();
  }, [filteredLoteData]);
  
  
  const calcularTotalDescarte = (descarte) => {
    const total = Object.values(descarte).reduce((total, cantidad) => total + cantidad, 0);
    return total.toFixed(2);
  };

  const formatDescarteItem = (lote, label, value) => {
    return lote.tipoFruta === 'Naranja' ? `${label}: ${value}` : `${label}: ${value} `;
  };
  

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
            {columnVisibility.deshidratacion && <Th>Deshidratación</Th>}
            {columnVisibility.observaciones && <Th>Observaciones</Th>}
            {columnVisibility.kilos && <Th>Kilos</Th>}
            {columnVisibility.placa && <Th>Placa</Th>}
            {columnVisibility.kilosVaciados && <Th>Kilos Vaciados</Th>}
            {columnVisibility.promedio && <Th>Promedio</Th>}
            {columnVisibility.rendimiento && <Th>Rendimiento (%)</Th>}
            {columnVisibility.descarteLavado && <Th>Descarte Lavado</Th>}
            {columnVisibility.descarteEncerado && <Th>Descarte Encerado</Th>}
            {columnVisibility.directoNacional && <Th>Directo Nacional</Th>}
            {columnVisibility.frutaNacional && <Th>Fruta Nacional</Th>}
            {columnVisibility.desverdizado && <Th>Desverdizado</Th>}
            {columnVisibility.exportacion && <Th>Exportación</Th>}
            <br></br>
          </tr>
        </thead>
        <tbody>
          {dataToRender.map((lote) => (
            <tr key={lote._id}>
              <Td>{lote._id}</Td>
              <Td>{lote.nombrePredio}</Td>
              <Td>{format(new Date(lote.fechaIngreso),  'dd/MM/yyyy HH:mm:ss')}</Td>
              {columnVisibility.canastillas && <Td>{lote.canastillas}</Td>}
              <Td>{lote.tipoFruta}</Td>
              {columnVisibility.deshidratacion && <Td>{porcentajesDeshidratacion[0]}</Td>}
              {columnVisibility.observaciones && <Td>{lote.observaciones}</Td>}
              {columnVisibility.kilos && <Td>{lote.kilos}</Td>}
              {columnVisibility.placa && <Td>{lote.placa}</Td>}
              {columnVisibility.kilosVaciados && <Td>{lote.kilosVaciados}</Td>}
              {columnVisibility.promedio && <Td>{lote.promedio}</Td>}
              {columnVisibility.rendimiento && <Td>{`${Math.round(lote.rendimiento)}%`}</Td>}
              {columnVisibility.descarteLavado && (
  <Td className="total-descartes">
    {lote.descarteLavado && (
      <>
        {formatDescarteItem(lote, 'General', lote.descarteLavado.descarteGeneral)},{' '}
        {formatDescarteItem(lote, 'Pareja', lote.descarteLavado.pareja)},{' '}
        {formatDescarteItem(lote, 'Balin', lote.descarteLavado.balin)},{' '}
        {formatDescarteItem(lote, 'Descompuesta', lote.descarteLavado.descompuesta)},{' '}
        {formatDescarteItem(lote, 'Piel', lote.descarteLavado.piel)},{' '}
        {formatDescarteItem(lote, 'Hojas', lote.descarteLavado.hojas)},{' '}
        <br></br>
        <strong>Total: {calcularTotalDescarte(lote.descarteLavado)}</strong>
      </>
    )}
  </Td>
)}

{columnVisibility.descarteEncerado && (
  <Td className="total-descartes">
    {lote.descarteEncerado && (
      <>
        {formatDescarteItem(lote, 'General', lote.descarteEncerado.descarteGeneral)},{' '}
        {formatDescarteItem(lote, 'Pareja', lote.descarteEncerado.pareja)},{' '}
        {formatDescarteItem(lote, 'Balin', lote.descarteEncerado.balin)},{' '}
        {formatDescarteItem(lote, 'Extra', lote.descarteEncerado.extra)},{' '}
        {formatDescarteItem(lote, 'Descompuesta', lote.descarteEncerado.descompuesta)},{' '}
        {formatDescarteItem(lote, 'Suelo', lote.descarteEncerado.suelo)},{' '}
        <br></br>
        <strong>Total: {calcularTotalDescarte(lote.descarteEncerado)}</strong>
      </>
    )}
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
          <strong style={{ color: '#000' }}> Contenedor {calidad.replace(/12:/, '')}:</strong>
            <table>
              <thead>
                <tr>
                  <Th>Calidad 1</Th>
                  <Th>Calidad 1.5</Th>
                  <Th>Calidad 2</Th>
                  <Th>Total</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>{lote.exportacion[calidad].calidad1}</Td>
                  <Td>{lote.exportacion[calidad].calidad1_5}</Td>
                  <Td>{lote.exportacion[calidad].calidad2}</Td>
                  <Td>
                    {lote.exportacion[calidad].calidad1 +
                      lote.exportacion[calidad].calidad1_5 +
                      lote.exportacion[calidad].calidad2}
                  </Td>
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
       <CardContainer>
      <Title>Lotes</Title>
      <div>
      <CardContainerS>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <ColumnVisibilityToggle
  label="Canastillas"
  checked={columnVisibility.canastillas}
  onChange={() =>
    setColumnVisibility((prev) => ({ ...prev, canastillas: !prev.canastillas }))
  }
>
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
        label="Fruta Desverdizado"
        checked={columnVisibility.desverdizado}
        onChange={() => setColumnVisibility((prev) => ({ ...prev, desverdizado: !prev.desverdizado }))}
      />
      <ColumnVisibilityToggle
        label="Observaciones"
        checked={columnVisibility.observaciones}
        onChange={() => setColumnVisibility((prev) => ({ ...prev, observaciones: !prev.observaciones }))}
      />
      <ColumnVisibilityToggle
        label="Fruta Exportación"
        checked={columnVisibility.exportacion}
        onChange={() => setColumnVisibility((prev) => ({ ...prev, exportacion: !prev.exportacion }))}
      />
      <ColumnVisibilityToggle
  label="Deshidratación"
  checked={columnVisibility.deshidratacion}
  onChange={() =>
    setColumnVisibility((prev) => ({ ...prev, deshidratacion: !prev.deshidratacion }))
  }
/>
       </div>
      </CardContainerS>
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
        <FilterInput
  type="number"
  placeholder="Filtrar por rendimiento"
  value={filtroRendimiento !== null ? filtroRendimiento : ''}
  onChange={(e) => {
    const valor = e.target.value === '' ? null : parseFloat(e.target.value.replace('.', '.')); // Reemplaza la coma por punto
    setFiltroRendimiento(valor);
  }}  
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
        <TotalKilosExportacion>
          Total kilos exportación Filtrados: {totalExportacionKilos}
        </TotalKilosExportacion>
      </FilterContainer>
      <CardContainer>
          <Title>Gráficas</Title>
          <div>
            <FilterSelect value={selectedLote} onChange={(e) => setSelectedLote(e.target.value)}>
              <option value="">Seleccionar Lote</option>
              {originalLoteData?.map((lote) => (
                <option key={lote.nombrePredio} value={lote.nombrePredio}>
                  {lote.nombrePredio}
                </option>
              ))}
            </FilterSelect>
          </div>
          <GraficasLotes lotes={originalLoteData} selectedLote={selectedLote} />
        </CardContainer>
      </CardContainer>
      {renderTable()}
    </Container>
  );
};
export default LoteTable;