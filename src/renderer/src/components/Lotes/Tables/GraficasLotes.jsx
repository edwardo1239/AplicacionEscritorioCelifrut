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

  if (!lotes) {
    return <p>No hay datos de lotes disponibles.</p>;
  }

  const data = lotes.filter((lote) => lote.nombrePredio === selectedLote);

  if (!selectedLote || data.length === 0) {
    return <p>Seleccione un lote válido para ver las gráficas.</p>;
  }

  const totalKilos = data[0].kilos;

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
      { name: "Canastillas", value: data[0].canastillas, percentage: (data[0].canastillas / totalKilos) * 100 },
      { name: "Kilos", value: data[0].kilos, percentage: (data[0].kilos / totalKilos) * 100 },
      { name: "Kilos Vaciados", value: data[0].kilosVaciados, percentage: (data[0].kilosVaciados / totalKilos) * 100 },
      { name: "Promedio", value: data[0].promedio, percentage: (data[0].promedio / totalKilos) * 100 },
      { name: "Rendimiento", value: data[0].rendimiento, percentage: data[0].rendimiento },
      { name: "Descarte Lavado", value: data[0].descarteLavado?.descarteGeneral, percentage: (data[0].descarteLavado?.descarteGeneral / totalKilos) * 100, descarteLavado: data[0].descarteLavado },
      { name: "Descarte Encerado", value: data[0].descarteEncerado?.descarteGeneral, percentage: (data[0].descarteEncerado?.descarteGeneral / totalKilos) * 100, descarteEncerado: data[0].descarteEncerado },
      { name: "Directo Nacional", value: data[0].directoNacional, percentage: (data[0].directoNacional / totalKilos) * 100 },
      { name: "Fruta Nacional", value: data[0].frutaNacional, percentage: (data[0].frutaNacional / totalKilos) * 100 },
      { name: "Fruta Desverdizado", value: data[0].frutaDesverdizado, percentage: (data[0].frutaDesverdizado / totalKilos) * 100 },
      { name: "Fruta Exportación", value: data[0].frutaExportacion, percentage: (data[0].frutaExportacion / totalKilos) * 100 },
    ];

    grafico = (
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
            .filter((key) => key !== "name") // Excluir "name" del gráfico de barras
            .map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colorPalette[index % colorPalette.length]}
                style={{ filter: "drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2))" }}
                onClick={key === "descarteLavado" ? handleDescarteLavadoClick : (key === "descarteEncerado" ? handleDescarteEnceradoClick : handleBarClick)} // Asignar la función de clic
              />
            ))}
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (tipoGrafico === "circular") {
    const pieChartData = [
      { name: "Canastillas", value: data[0].canastillas, percentage: (data[0].canastillas / totalKilos) * 100 },
      { name: "Kilos", value: data[0].kilos, percentage: (data[0].kilos / totalKilos) * 100 },
      { name: "Kilos Vaciados", value: data[0].kilosVaciados, percentage: (data[0].kilosVaciados / totalKilos) * 100 },
      { name: "Promedio", value: data[0].promedio, percentage: (data[0].promedio / totalKilos) * 100 },
      { name: "Rendimiento", value: data[0].rendimiento, percentage: data[0].rendimiento },
      { name: "Descarte Lavado", value: data[0].descarteLavado?.descarteGeneral, percentage: (data[0].descarteLavado?.descarteGeneral / totalKilos) * 100 },
      { name: "Descarte Encerado", value: data[0].descarteEncerado?.descarteGeneral, percentage: (data[0].descarteEncerado?.descarteGeneral / totalKilos) * 100 },
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
      { name: "Canastillas", value: data[0].canastillas },
      { name: "Kilos", value: data[0].kilos },
      { name: "Kilos Vaciados", value: data[0].kilosVaciados },
      { name: "Promedio", value: data[0].promedio },
      { name: "Rendimiento", value: data[0].rendimiento },
      { name: "Descarte Lavado", value: data[0].descarteLavado?.descarteGeneral },
      { name: "Descarte Encerado", value: data[0].descarteEncerado?.descarteGeneral },
      { name: "Directo Nacional", value: data[0].directoNacional },
      { name: "Fruta Nacional", value: data[0].frutaNacional },
      { name: "Fruta Desverdizado", value: data[0].frutaDesverdizado },
      { name: "Fruta Exportación", value: data[0].frutaExportacion },
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