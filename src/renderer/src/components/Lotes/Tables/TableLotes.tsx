import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

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
  margin-top: 0px;
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

const ChartContainer = styled.div`
  margin-top: 0;  /* Elimina el margen superior o ajusta según sea necesario */
  display: flex;
  flex-direction: column;  /* Ajusta la dirección del flex container a columna */
`;

const ChartSelector = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  margin-top: 30px;
`;

const ChartButton = styled.button`
  padding: 9px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? '#4caf50' : '#ddd')};
  color: ${(props) => (props.selected ? '#fff' : '#000')};
  border: 1px solid #ddd;
  border-radius: 5px;
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
  const [filtroRendimientoMin, setFiltroRendimientoMin] = useState<number | null>(null);
  const [filtroRendimientoMax, setFiltroRendimientoMax] = useState<number | null>(null);
  const [totalDeshidratacion, setTotalDeshidratacion] = useState<number | null>(null);
  const [tipoGrafico, setTipoGrafico] = useState<string>('bar');
  const [selectedChart, setSelectedChart] = useState<string>('bar');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedEfId, setSelectedEfId] = useState<string | null>(null);
  const [filtroId, setFiltroId] = useState<string | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<string>('');
  const [porcentajesDeshidratacion, setPorcentajesDeshidratacion] = useState<number[]>([]);

  const [filtros, setFiltros] = useState<{ tipoFruta: string | ''; nombrePredio: string | ''; fechaInicio: string; fechaFin: string;  id: string | ''; }>({
    tipoFruta: '',
    nombrePredio: '',
    fechaInicio: '',
    fechaFin: '',
    id: '',
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
  
  useEffect(() => {
    const obtenerDatosDelServidor = async () => {
      try {
        const request = {
          action: 'obtenerDatosLotes',
          data: { filtros: {} },
        };
  
        const datosLotes = await window.api.inventario(request);
        setOriginalLoteData(datosLotes.data);
  
        const dataCuantitativa = datosLotes.data.map((lote) => lote.exportacion?.calidad1 || 0);
        const dataCualitativa = datosLotes.data.map((lote) => lote.tipoFruta || '');
  
      } catch (error) {
        console.error('Error al obtener datos del lote:', error);
      }
    };
  
    obtenerDatosDelServidor();
  }, []);
  
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

  useEffect(() => {
    const filteredData =
  originalLoteData &&
  originalLoteData.filter(
    (lote) =>
      (filtros.tipoFruta === '' || lote.tipoFruta === filtros.tipoFruta) &&
      (filtros.nombrePredio === '' || lote.nombrePredio.toLowerCase().startsWith(filtros.nombrePredio.toLowerCase())) &&
      (filtros.id === '' || lote._id.toLowerCase().includes(filtros.id.toLowerCase())) && // Nuevo filtro por ID
      (!filtros.fechaInicio || lote.fechaIngreso >= filtros.fechaInicio) &&
      (!filtros.fechaFin || lote.fechaIngreso <= filtros.fechaFin) &&
      (filtroRendimientoMin === null || lote.rendimiento >= filtroRendimientoMin) &&
      (filtroRendimientoMax === null || lote.rendimiento <= filtroRendimientoMax)
  );
  
      setFilteredLoteData(filteredData);

      const dataCuantitativa = filteredData?.map((lote) => lote.exportacion?.calidad1 || 0);
      const dataCualitativa = filteredData?.map((lote) => lote.tipoFruta || '');
    
    }, [originalLoteData, filtros, filtroRendimientoMax, filtroRendimientoMin]);


    const renderBarChart = () => {
      const totalExportacion = {};
      const totalDescarteLavado = {};
      const totalDescarteEncerado = {};
      const totalKilos = {};
      const totalKilosVaciados = {};
      const totalDeshidratacion = {};
    
      filteredLoteData?.forEach((lote) => {
        const nombrePredio = lote.nombrePredio;
    
        totalExportacion[nombrePredio] = (totalExportacion[nombrePredio] || 0) + obtenerTotalExportacion(lote.exportacion);
        totalDescarteLavado[nombrePredio] = (totalDescarteLavado[nombrePredio] || 0) + parseFloat(calcularTotalDescarte(lote.descarteLavado));
        totalDescarteEncerado[nombrePredio] = (totalDescarteEncerado[nombrePredio] || 0) + parseFloat(calcularTotalDescarte(lote.descarteEncerado));
        totalKilos[nombrePredio] = (totalKilos[nombrePredio] || 0) + parseFloat(lote.kilos);
        totalKilosVaciados[nombrePredio] = (totalKilosVaciados[nombrePredio] || 0) + parseFloat(lote.kilosVaciados);
        totalDeshidratacion[nombrePredio] = (totalDeshidratacion[nombrePredio] || 0) + obtenerTotalDeshidratacion(lote); // Nueva línea para deshidratación
      });

      const filteredData = selectedItemId
      ? filteredLoteData?.filter((lote) => lote._id === selectedItemId)
      : filteredLoteData;
    
      const data = {
        labels: Object.keys(totalExportacion),
        datasets: [
          {
            label: 'Total Exportación',
            data: Object.values(totalExportacion),
            backgroundColor: 'rgba(144, 238, 144, 0.2)',
            borderColor: 'rgba(144, 238, 144, 1)',
            borderWidth: 1,
          },
          {
            label: 'Total Descarte Lavado',
            data: Object.values(totalDescarteLavado),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Total Descarte Encerado',
            data: Object.values(totalDescarteEncerado),
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
          },
          {
            label: 'Total Kilos',
            data: Object.values(totalKilos),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Total Kilos Vaciados',
            data: Object.values(totalKilosVaciados),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      };
    
      const numBars = data.labels.length;
      const maxWidthPerBar = 100; // Ancho máximo por barra
      const minHeight = 200; // Altura mínima del contenedor
      
      const containerWidth = Math.max(1000, numBars * maxWidthPerBar); // Ajusta este valor según tus necesidades
      const containerHeight = Math.max(minHeight, containerWidth * 0.6); // Puedes ajustar el factor de proporción según tus necesidades
      
      const barWidth = Math.min(maxWidthPerBar, containerWidth / numBars);
      
      const options = {
        scales: {
          x: [
            {
              barThickness: barWidth, // Ancho de la barra
              maxBarThickness: maxWidthPerBar,
            },
          ],
        },
      };
      
      return (
        <div style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}>
          <Bar data={data} options={options} />
        </div>
      );
    };
    
    const obtenerTotalDeshidratacion = (lote) => {
      const totalDescarteLavado = parseFloat(calcularTotalDescarte(lote.descarteLavado));
      const totalDescarteEncerado = parseFloat(calcularTotalDescarte(lote.descarteEncerado));
      const totalDirectoNacional = parseFloat(lote.directoNacional) || 0;
      const totalExportacion = obtenerTotalExportacion(lote.exportacion);
    
      const totalDeshidratacion = totalDescarteLavado + totalDescarteEncerado + totalDirectoNacional + totalExportacion;
    
      const porcentajeDeshidratacion = (totalDeshidratacion / parseFloat(lote.kilos)) * 100;
    
      const complementoDeshidratacion = 100 - porcentajeDeshidratacion;
    
      return complementoDeshidratacion;
    };
    console.log(totalDeshidratacion)
    
    const renderDoughnutChart = () => {
      const totalExportacion = {};
      const totalDescarteLavado = {};
      const totalDescarteEncerado = {};
      const totalDeshidratacion = {};

      filteredLoteData?.forEach((lote) => {
        if (lote) {
          const nombrePredio = lote.nombrePredio;
    
          totalExportacion[nombrePredio] = (totalExportacion[nombrePredio] || 0) + obtenerTotalExportacion(lote.exportacion);
    
          if (lote.descarteLavado !== undefined) {
            totalDescarteLavado[nombrePredio] = (totalDescarteLavado[nombrePredio] || 0) + parseFloat(calcularTotalDescarte(lote.descarteLavado));
          }
    
          if (lote.descarteEncerado !== undefined) {
            totalDescarteEncerado[nombrePredio] = (totalDescarteEncerado[nombrePredio] || 0) + parseFloat(calcularTotalDescarte(lote.descarteEncerado));
          }
    
          totalDeshidratacion[nombrePredio] = (totalDeshidratacion[nombrePredio] || 0) + obtenerTotalDeshidratacion(lote);
        }
      });
    
      const filteredData = selectedItemId
        ? filteredLoteData?.filter((lote) => lote._id === selectedItemId)
        : filteredLoteData;
    
      
      const colorPalette = [
        '#44b4c4', // Celeste
        '#80c9c6', // Turquesa
        '#a3d5d1', // Verde agua
        '#e4f1ef', // Verde pálido
      ];
      
      const totalExportacionValues = Object.values(totalExportacion);
      const totalDescarteLavadoValues = Object.values(totalDescarteLavado);
      const totalDescarteEnceradoValues = Object.values(totalDescarteEncerado);
      const totalDeshidratacionValues = Object.values(totalDeshidratacion);
    
      const totalKilos = filteredData?.length > 0 ? parseFloat(filteredData[0].kilos) : 0;
    
      const porcentajes = [
        ((totalExportacionValues.reduce((a, b) => a + b, 0) / totalKilos) * 100).toFixed(2),
        ((totalDescarteLavadoValues.reduce((a, b) => a + b, 0) / totalKilos) * 100).toFixed(2),
        ((totalDescarteEnceradoValues.reduce((a, b) => a + b, 0) / totalKilos) * 100).toFixed(2),
        ((totalDeshidratacionValues.reduce((a, b) => a + b, 0) / totalKilos) * 100).toFixed(2),
      ];
    
      const totalPorcentaje = porcentajes.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
      const porcentajesAjustados = porcentajes.map(porcentaje => ((parseFloat(porcentaje) / totalPorcentaje) * 100).toFixed(2));
    
      const data = {
        labels: [
          `Total Exportación\n${porcentajesAjustados[0]}%`,
          `Total Descarte Lavado\n${porcentajesAjustados[1]}%`,
          `Total Descarte Encerado\n${porcentajesAjustados[2]}%`,
          `Total Deshidratación\n${porcentajesAjustados[3]}%`,
        ],
        datasets: [
          {
            data: [
              totalExportacionValues.reduce((a, b) => a + b, 0),
              totalDescarteLavadoValues.reduce((a, b) => a + b, 0),
              totalDescarteEnceradoValues.reduce((a, b) => a + b, 0),
              totalDeshidratacionValues.reduce((a, b) => a + b, 0),
            ],
            backgroundColor: colorPalette,
            borderColor: colorPalette,
            borderWidth: 1,
          },
        ],
      };
    
      const options = {
        cutout: '10%', // Ajusta el tamaño del agujero en el centro del gráfico
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      };
    
      return (
        <div style={{ width: '650px', height: '650px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '160px' }}>
          <Doughnut data={data} options={options} />
        </div>
      );
    };
    
const renderLineChart = () => {
  const totalExportacion = {};
  const totalDescarteLavado = {};
  const totalDescarteEncerado = {};
  const totalKilos = {};
  const totalKilosVaciados = {};
  const totalDeshidratacion = {};

  filteredLoteData?.forEach((lote) => {
    const nombrePredio = lote.nombrePredio;

    if (!totalExportacion[nombrePredio]) {
      totalExportacion[nombrePredio] = 0;
    }

    if (!totalDescarteLavado[nombrePredio]) {
      totalDescarteLavado[nombrePredio] = 0;
    }

    if (!totalDescarteEncerado[nombrePredio]) {
      totalDescarteEncerado[nombrePredio] = 0;
    }

    if (!totalKilos[nombrePredio]) {
      totalKilos[nombrePredio] = 0;
    }

    if (!totalKilosVaciados[nombrePredio]) {
      totalKilosVaciados[nombrePredio] = 0;
    }

    if (!totalDeshidratacion[nombrePredio]) {
      totalDeshidratacion[nombrePredio] = 0;
    }

    totalExportacion[nombrePredio] += obtenerTotalExportacion(lote.exportacion) || 0;
    totalDescarteLavado[nombrePredio] += parseFloat(calcularTotalDescarte(lote.descarteLavado)) || 0;
    totalDescarteEncerado[nombrePredio] += parseFloat(calcularTotalDescarte(lote.descarteEncerado)) || 0;
    totalKilos[nombrePredio] += parseFloat(lote.kilos) || 0;
    totalKilosVaciados[nombrePredio] += parseFloat(lote.kilosVaciados) || 0;
  });

  const filteredData = selectedItemId
    ? filteredLoteData?.filter((lote) => lote._id === selectedItemId)
    : filteredLoteData;

  const data = {
    labels: Object.keys(totalExportacion),
    datasets: [
      {
        label: 'Total Exportación',
        data: Object.values(totalExportacion),
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderColor: 'rgba(255, 0, 0, 1)',      
        borderWidth: 1,
      },
      {
        label: 'Total Descarte Lavado',
        data: Object.values(totalDescarteLavado),
        backgroundColor: 'rgba(144, 238, 144, 0.2)',
        borderColor: 'rgba(144, 238, 144, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Descarte Encerado',
        data: Object.values(totalDescarteEncerado),
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Kilos',
        data: Object.values(totalKilos),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  return <Line data={data} options={options} />;
};

const renderChart = () => {
  switch (selectedChartType) {
    case 'bar':
      return renderBarChart();
    case 'doughnut':
      return renderDoughnutChart();
    case 'line':
      return renderLineChart();
    default:
      return null;
  }
};

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
          // Calcular el porcentaje de deshidratación para cada lote
          const deshidratacionPredio =
            parseFloat(calcularTotalDescarte(lote.descarteLavado)) +
            parseFloat(calcularTotalDescarte(lote.descarteEncerado)) +
            lote.directoNacional +
            obtenerTotalExportacion(lote.exportacion);
    
          const porcentaje =
            lote.kilos !== 0 ? 100 - ((deshidratacionPredio / lote.kilos) * 100) : 0;
          const porcentajeAproximado = parseFloat(porcentaje.toFixed(2));
    
          console.log(`Deshidratación de ${lote.nombrePredio}: ${deshidratacionPredio} `);
    
          return porcentajeAproximado + '%';
        } else {
          return 0; // o cualquier otro valor que desees mostrar cuando la columna no está visible
        }
      });
    
      setPorcentajesDeshidratacion(porcentajesDeshidratacion);
    };
    
  
    // Llamada a calcularTotales dentro del bloque de useEffect
    calcularTotales();
  }, [filteredLoteData]);
  
  
  const calcularTotalDescarte = (descarte) => {
    const total = Object.values(descarte).reduce((total, cantidad) => {
      const numericValue = parseFloat(cantidad);
      return isNaN(numericValue) ? total : total + numericValue;
    }, 0);
    return typeof total === 'number' ? total.toFixed(2) : total;
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
  type="text"
  placeholder="EF1"
  value={filtros.id}
  onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
/>
        <div>  <label htmlFor="filtroRendimientoMin"><br></br>Rendimiento:</label></div>
          <FilterInput
    type="number"
    placeholder="Mínimo"
    value={filtroRendimientoMin !== null ? filtroRendimientoMin : ''}
    onChange={(e) => setFiltroRendimientoMin(e.target.value !== '' ? parseFloat(e.target.value) : null)}
  />
  <span> - </span>
  <FilterInput
    type="number"
    placeholder="Máximo"
    value={filtroRendimientoMax !== null ? filtroRendimientoMax : ''}
    onChange={(e) => setFiltroRendimientoMax(e.target.value !== '' ? parseFloat(e.target.value) : null)}
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
      </CardContainer>
      <FilterContainer>
      <div style={{ marginBottom: '16px', marginLeft: '100px' }}>
        <label>Tipo de Gráfico:</label>
        <select
          value={selectedChartType}
          onChange={(e) => setSelectedChartType(e.target.value)}
        >
          <option value="">Seleccionar</option>
          <option value="bar">Grafica De Barras</option>
          <option value="doughnut">Grafica Circular</option>
          <option value="line">Grafica Lineal</option>
        </select>
      </div>
      </FilterContainer>
      <ChartContainer>{renderChart()}</ChartContainer>
      {renderTable()}
    </Container>
  );
};
export default LoteTable;