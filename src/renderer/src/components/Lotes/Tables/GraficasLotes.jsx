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
const colorPalette = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6", "#34495e", "#1abc9c", "#d35400"];
const getRandomColor = () => colorPalette[Math.floor(Math.random() * colorPalette.length)];

const GraficasLotes = ({ lotes, selectedLote }) => {
  const [tipoGrafico, setTipoGrafico] = useState("barras");
  const [descarteData, setDescarteData] = useState(null);
  const [barChartMaximized, setBarChartMaximized] = useState(true);
  const [lineChartMaximized, setLineChartMaximized] = useState(true);
  const [originalTipoGrafico, setOriginalTipoGrafico] = useState("barras");

  if (!lotes) {
    return <p>No hay datos de lotes disponibles.</p>;
  }

  const data = lotes.find((lote) => lote.nombrePredio === selectedLote);

  if (!selectedLote || !data) {
    return <p></p>;
  }

  const totalKilos = data.kilos;

  let grafico;

  const tooltipFormatter = (value, name, props) => {
    return `${value}`;
  };

  const handleDescarteLavadoClick = (entry) => {
    if (entry && entry.payload) {
      const descarteLavado = entry.payload.descarteLavado;
      const descarteData = [{ name: "Descarte Lavado", ...descarteLavado }];
      setDescarteData(descarteData);
      setOriginalTipoGrafico(tipoGrafico);
      setTipoGrafico("barras");
    }
  };

  const handleDescarteEnceradoClick = (entry) => {
    if (entry && entry.payload) {
      const descarteEncerado = entry.payload.descarteEncerado;
      const descarteData = [{ name: "Descarte Encerado", ...descarteEncerado }];
      setDescarteData(descarteData);
      setOriginalTipoGrafico(tipoGrafico);
      setTipoGrafico("barras");
    }
  };

  const handleExportacionClick = () => {
    if (data.exportacion && typeof data.exportacion === 'object') {
      const loteExportacionData = Object.keys(data.exportacion).map((key, index) => {
        const exportacionItem = data.exportacion[key];
        return {
          name: `Contenedor ${key}`, // Modificación aquí
          calidad1: exportacionItem.calidad1,
          calidad1_5: exportacionItem.calidad1_5,
          calidad2: exportacionItem.calidad2,
        };
      });
  
      setDescarteData(loteExportacionData);
      setOriginalTipoGrafico(tipoGrafico);
      setTipoGrafico("barras");
    }
  };

  const toggleBarChartSize = () => {
    setBarChartMaximized(!barChartMaximized);
  };

  const toggleLineChartSize = () => {
    setLineChartMaximized(!lineChartMaximized);
  };

  const handleBarClick = (entry) => {
    if (entry && entry.payload) {
      const descarteLavado = entry.payload.descarteLavado;
      const descarteEncerado = entry.payload.descarteEncerado;
  
      let selectedDescarteData = null;
      if (tipoGrafico === "barras") {
        selectedDescarteData = [
          descarteLavado ? { name: "Descarte Lavado", ...descarteLavado } : null,
          descarteEncerado ? { name: "Descarte Encerado", ...descarteEncerado } : null,
        ].filter(Boolean);
      } else if (tipoGrafico === "circular" || tipoGrafico === "linea") {
        selectedDescarteData = [
          { name: "Descarte Lavado", value: descarteLavado?.descarteGeneral },
          { name: "Descarte Encerado", value: descarteEncerado?.descarteGeneral },
        ].filter((item) => item.value !== undefined);
      }
  
      setDescarteData(selectedDescarteData);
      setOriginalTipoGrafico(tipoGrafico);
      setTipoGrafico("barras");
      setBarChartMaximized(true);
      setBarChartDescarteSize("10%"); // Ajusta el tamaño según tus necesidades
    }
  };
  

  const handleLineItemClick = (entry) => {
    if (entry && entry.payload) {
      const descarteLavado = entry.payload.descarteLavado;
      const descarteEncerado = entry.payload.descarteEncerado;
  
      let selectedDescarteData = null;
      if (tipoGrafico === "linea") {
        selectedDescarteData = [
          descarteLavado ? { name: "Descarte Lavado", ...descarteLavado } : null,
          descarteEncerado ? { name: "Descarte Encerado", ...descarteEncerado } : null,
        ].filter(Boolean);
      }
  
      setDescarteData(selectedDescarteData);
      setOriginalTipoGrafico(tipoGrafico);
      setTipoGrafico("linea");
      setLineChartMaximized(true); // Ajusta el tamaño según tus necesidades
    }
  };

  const exportacionValue = data.exportacion
    ? Object.values(data.exportacion).reduce((total, value) => total + value, 0)
    : 0;


    const getExportacionData = () => {
      if (data.exportacion && Array.isArray(data.exportacion)) {
        return data.exportacion.map((item, index) => ({
          name: `Ítem ${index + 1}`,
          value: item.value, // Reemplaza con el nombre real de la propiedad en tu objeto
        }));
      }
      return [];
    };

    const totalExportacion = data.exportacion
    ? Object.values(data.exportacion).reduce(
        (total, exportacionItem) =>
          total + exportacionItem.calidad1 + exportacionItem.calidad1_5 + exportacionItem.calidad2,
        0
      )
    : 0;
  
    const exportacionData = getExportacionData();

    const deshidratacionValue = data.descarteLavado?.descarteGeneral +
  data.descarteEncerado?.descarteGeneral +
  (data.exportacion ? totalExportacion : 0) +
  data.directoNacional;

  const deshidratacionPercentage = (deshidratacionValue / totalKilos) * 100;

  
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
        {
          name: "Deshidratación",
          value: deshidratacionValue,
          percentage: deshidratacionPercentage,
        },
        { name: "Fruta Exportación", value: totalExportacion, percentage: (totalExportacion / totalKilos) * 100 },
        // ... (Otros datos del gráfico de barras)
        ...exportacionData,
      ];
  
    
      grafico = (
        <div>
          <br></br>
          {barChartMaximized ? (
            <ResponsiveContainer width="180%" height={400}>
              <BarChart
                data={descarteData || barChartData}
                margin={{ top: 20, right: 80, left: 30, bottom: 0 }}
                style={{ filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1))" }}
                animation={{ duration: 500, easing: 'ease-out' }}
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
                  name={key} // Agrega esta línea para mostrar los nombres
                  fill={colorPalette[index % colorPalette.length]}
                  onClick={handleBarClick}
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={500}
                  style={{
                    filter: "drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2))",
                  }}
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
      { name: "Directo Nacional", value: data.directoNacional, percentage: (data.directoNacional / totalKilos) * 100 },
      { name: "Fruta Nacional", value: data.frutaNacional, percentage: (data.frutaNacional / totalKilos) * 100 },
      { name: "Fruta Desverdizado", value: data.desverdizado, percentage: (data.desverdizado / totalKilos) * 100 },
    ];

    grafico = (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150} // Ajusta el radio exterior para hacer el círculo más grande
            fill="#3498db"
            label={({ name, value }) => `${name}: ${value}`}
            style={{
              background: "#f5f5f5", // Fondo del gráfico
              filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2))", // Sombra
            }}
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={colorPalette[index % colorPalette.length]} />
            ))}
          </Pie>
          <Tooltip formatter={tooltipFormatter} />
          <Legend verticalAlign="top" height={100} />
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
      <ResponsiveContainer width={lineChartMaximized ? "200%" : "100%"} height={400}>
        <LineChart
          data={lineChartData}
          style={{ filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1))" }}
          onClick={handleLineItemClick}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" /> {/* Asegúrate de que esté configurado correctamente */}
          <YAxis />
          <Tooltip formatter={tooltipFormatter} />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#e74c3c"
            strokeWidth={2}
            dot={{ fill: "#e74c3c", r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  const handleVolverClick = () => {
    setDescarteData(null);
    setTipoGrafico(originalTipoGrafico);
  };

  return (
    <div>
      <br />
      <h3 style={headingStyle}>Seleccionar Tipo de Gráfico</h3>
      <select
        onChange={(e) => setTipoGrafico(e.target.value)}
        value={tipoGrafico}
        style={selectStyle}
      >
        <option value="barras">Gráfico de Barras</option>
        <option value="circular">Gráfico Circular</option>
        <option value="linea">Gráfico de Línea</option>
      </select>

      <button onClick={handleExportacionClick} style={toggleButtonStyle}>
  Graficar Exportación
</button>  

      {tipoGrafico === 'barras' ? (
  <button onClick={toggleBarChartSize} style={toggleButtonStyle}>
    {barChartMaximized ? 'Minimizar Barras' : 'Maximizar Barras'}
  </button>
) : null}

{tipoGrafico === 'linea' ? (
  <button onClick={toggleLineChartSize} style={toggleButtonStyle}>
    {lineChartMaximized ? 'Minimizar Línea' : 'Maximizar Línea'}
  </button>
) : null}

      {descarteData && (
        <button onClick={handleVolverClick} style={buttonStyle}>
          Volver
        </button>
      )}
      {grafico}
    </div>
  );
};

// Estilos en línea (CSS directo en el código)
const headingStyle = {
  fontSize: '18px',
  color: '#333',
};

const selectStyle = {
  padding: '8px',
  fontSize: '16px',
  margin: '8px',
  borderRadius: '4px',
};

const toggleButtonStyle = {
  padding: '10px',
  fontSize: '16px',
  margin: '8px',
  borderRadius: '4px',
  backgroundColor: '#007BFF', // Color de fondo
  color: 'white', // Color del texto
  cursor: 'pointer',
  border: 'none',
};

const buttonStyle = {
  padding: '10px',
  fontSize: '16px',
  margin: '8px',
  borderRadius: '4px',
  backgroundColor: '#4CAF50', // Color de fondo
  color: 'white', // Color del texto
  cursor: 'pointer',
  border: 'none',
};


export default GraficasLotes;