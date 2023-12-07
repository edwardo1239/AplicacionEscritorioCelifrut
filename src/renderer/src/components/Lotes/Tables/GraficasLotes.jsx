import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

// Paleta de colores predefinida
const colorPalette = ["#8884d8", "#82ca9d", "#ffc658", "#f44242", "#a55eea", "#61dafb", "#fd7e14", "#20c997"];

const getRandomColor = () => colorPalette[Math.floor(Math.random() * colorPalette.length)];

const GraficasLotes = ({ lotes, selectedLote }) => {
  const [tipoGrafico, setTipoGrafico] = useState("barras");
  const [descarteData, setDescarteData] = useState(null);
  const [barChartMaximized, setBarChartMaximized] = useState(true);
  const [lineChartMaximized, setLineChartMaximized] = useState(true);


  if (!lotes) {
    return <p>No hay datos de lotes disponibles.</p>;
  }

  const data = lotes.find((lote) => lote.nombrePredio === selectedLote);

  if (!selectedLote || !data) {
    return <p>Seleccione un lote válido para ver las gráficas.</p>;
  }

  const totalKilos = data.kilos;

  let grafico;

  const tooltipFormatter = (value, name, props) => {
    return `${value}`;
  };

  // Nueva función para manejar clic en la barra de Descarte Lavado
  const handleDescarteLavadoClick = (entry) => {
    if (entry && entry.payload) {
      const descarteLavado = entry.payload.descarteLavado;
      const descarteData = [{ name: "Descarte Lavado", ...descarteLavado }];
      setDescarteData(descarteData);
    }
    // Otras acciones al hacer clic en una barra de Descarte Lavado
  };

  // Nueva función para manejar clic en la barra de Descarte Encerado
  const handleDescarteEnceradoClick = (entry) => {
    if (entry && entry.payload) {
      const descarteEncerado = entry.payload.descarteEncerado;
      const descarteData = [{ name: "Descarte Encerado", ...descarteEncerado }];
      setDescarteData(descarteData);
    }
    // Otras acciones al hacer clic en una barra de Descarte Encerado
  };

  const handleExportacionClick = () => {
    if (data.exportacion && typeof data.exportacion === 'object') {
      console.log(data.exportacion); // Agrega esta línea para imprimir en la consola
      const exportacionData = Object.entries(data.exportacion).map(([key, value]) => ({
        name: key,
        calidad1: Number(value.calidad1),
        calidad1_5: Number(value.calidad1_5),
        calidad2: Number(value.calidad2),
        total: Number(value.calidad1) + Number(value.calidad1_5) + Number(value.calidad2),
      }));
  
      setDescarteData(exportacionData);
    }
  };

  const toggleBarChartSize = () => {
    setBarChartMaximized(!barChartMaximized);
  };

  const toggleLineChartSize = () => {
    setLineChartMaximized(!lineChartMaximized);
  };

  // Nueva función para manejar clic en la barra
  const handleBarClick = (entry) => {
    if (entry && entry.payload) {
      const descarteLavado = entry.payload.descarteLavado;
      const descarteEncerado = entry.payload.descarteEncerado;
  
      // Determinar qué tipo de descarte se seleccionó
      let selectedDescarteData = null;
      if (tipoGrafico === "barras") {
        selectedDescarteData = [
          descarteLavado ? { name: "Descarte Lavado", ...descarteLavado } : null,
          descarteEncerado ? { name: "Descarte Encerado", ...descarteEncerado } : null,
        ].filter(Boolean); // Filtrar los elementos nulos
      } else if (tipoGrafico === "circular" || tipoGrafico === "linea") {
        selectedDescarteData = [
          { name: "Descarte Lavado", value: descarteLavado?.descarteGeneral },
          { name: "Descarte Encerado", value: descarteEncerado?.descarteGeneral },
        ].filter((item) => item.value !== undefined); // Filtrar los elementos indefinidos
      }
  
      setDescarteData(selectedDescarteData);
    }
    // Otras acciones al hacer clic en una barra
  };

  if (tipoGrafico === "barras") {
    const barChartData = [
      { name: "Canastillas", value: data.canastillas, percentage: (data.canastillas / totalKilos) * 100 },
      { name: "Kilos", value: data.kilos, percentage: (data.kilos / totalKilos) * 100 },
      { name: "Kilos Vaciados", value: data.kilosVaciados, percentage: (data.kilosVaciados / totalKilos) * 100 },
      { name: "Promedio", value: data.promedio, percentage: (data.promedio / totalKilos) * 100 },
      { name: "Rendimiento", value: data.rendimiento, percentage: data.rendimiento },
      { name: "Descarte Lavado", value: data.descarteLavado?.descarteGeneral, percentage: (data.descarteLavado?.descarteGeneral / totalKilos) * 100, descarteLavado: data.descarteLavado },
      { name: "Descarte Encerado", value: data.descarteEncerado?.descarteGeneral, percentage: (data.descarteEncerado?.descarteGeneral / totalKilos) * 100, descarteEncerado: data.descarteEncerado },
      { name: "Directo Nacional", value: data.directoNacional, percentage: (data.directoNacional / totalKilos) * 100 },
      { name: "Fruta Nacional", value: data.frutaNacional, percentage: (data.frutaNacional / totalKilos) * 100 },
      { name: "Fruta Desverdizado", value: data.desverdizado, percentage: (data.desverdizado / totalKilos) * 100 },
      { name: "Fruta Exportación", value: data.exportacion, percentage: totalKilos !== 0 ? (data.exportacion / totalKilos) * 100 : 0 },
    ];

    grafico = (
      <div>
        <button onClick={toggleBarChartSize}>
          {barChartMaximized ? 'Minimizar Gráfico de Barras' : 'Maximizar Gráfico de Barras'}
        </button>
        {barChartMaximized ? (
          <ResponsiveContainer width="180%" height={350}>
            <BarChart
              data={descarteData || barChartData}
              margin={{ top: 20, right: 80, left: 30, bottom: 0 }}
              style={{ filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1))" }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={tooltipFormatter} />
              <Legend verticalAlign="top" height={36} />
              {Object.keys(descarteData ? descarteData[0] : barChartData[0])
                .filter((key) => key !== "name")
                .map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colorPalette[index % colorPalette.length]}
                    style={{ filter: "drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2))" }}
                    onClick={handleBarClick}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    );
  } else if (tipoGrafico === "circular") {
    const pieChartData = [
      { name: "Canastillas", value: data.canastillas, percentage: (data.canastillas / totalKilos) * 100 },
      { name: "Kilos", value: data.kilos, percentage: (data.kilos / totalKilos) * 100 },
      { name: "Kilos Vaciados", value: data.kilosVaciados, percentage: (data.kilosVaciados / totalKilos) * 100 },
      { name: "Promedio", value: data.promedio, percentage: (data.promedio / totalKilos) * 100 },
      { name: "Rendimiento", value: data.rendimiento, percentage: data.rendimiento },
      { name: "Descarte Lavado", value: data.descarteLavado?.descarteGeneral, percentage: (data.descarteLavado?.descarteGeneral / totalKilos) * 100 },
      { name: "Descarte Encerado", value: data.descarteEncerado?.descarteGeneral, percentage: (data.descarteEncerado?.descarteGeneral / totalKilos) * 100 },
    ];

    grafico = (
      <ResponsiveContainer width="100%" height={400}>
         <PieChart>
          <Pie
            data={descarteData || pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, percentage }) => `${name}: ${percentage.toFixed(2)}%`}
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={colorPalette[index % colorPalette.length]} />
            ))}
          </Pie>
          <Tooltip formatter={tooltipFormatter} />
          <Legend verticalAlign="top" height={36} />
        </PieChart>
      </ResponsiveContainer>
    );
  } else if (tipoGrafico === "linea") {
    const lineChartData = [
      { name: "Canastillas", value: data.canastillas },
      { name: "Kilos", value: data.kilos },
      { name: "Kilos Vaciados", value: data.kilosVaciados },
      { name: "Promedio", value: data.promedio },
      { name: "Rendimiento", value: data.rendimiento },
      { name: "Descarte Lavado", value: data.descarteLavado?.descarteGeneral },
      { name: "Descarte Encerado", value: data.descarteEncerado?.descarteGeneral },
      { name: "Directo Nacional", value: data.directoNacional },
      { name: "Fruta Nacional", value: data.frutaNacional },
      { name: "Fruta Desverdizado", value: data.desverdizado },
      { name: "Fruta Exportación", value: data.exportacion },
    ];

    grafico = (
      <ResponsiveContainer width="150%" height={400} maxHeight={500}>
        <LineChart
          data={descarteData || lineChartData}
          style={{ filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1))" }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={tooltipFormatter} />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  return (
    <div>
      <h3>Seleccionar Tipo de Gráfico</h3>
      <select onChange={(e) => setTipoGrafico(e.target.value)} value={tipoGrafico}>
        <option value="barras">Gráfico de Barras</option>
        <option value="circular">Gráfico Circular</option>
        <option value="linea">Gráfico de Línea</option>
      </select>

      {grafico}
    </div>
  );
};
export default GraficasLotes;