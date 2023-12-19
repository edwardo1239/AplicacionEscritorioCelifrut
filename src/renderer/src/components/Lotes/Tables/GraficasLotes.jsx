// ChartsComponent.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartsComponent = ({ data }) => {
  const chartRefBar = useRef(null);
  const chartRefLine = useRef(null);
  const chartRefPie = useRef(null);

  seEffect(() => {
    if (data) {
      // Destruir gráficos existentes antes de crear uno nuevo
      if (chartRefBar.current) {
        chartRefBar.current.destroy();
      }
      if (chartRefLine.current) {
        chartRefLine.current.destroy();
      }
      if (chartRefPie.current) {
        chartRefPie.current.destroy();
      }
  
      // Log para verificar si los elementos canvas están presentes en el DOM
      console.log('Canvas elements:', document.querySelectorAll('canvas'));
  
      // Lógica para inicializar o actualizar los gráficos con los datos
      const ctxBar = document.getElementById('barChart').getContext('2d');
      chartRefBar.current = new Chart(ctxBar, {
        // ... configuración del gráfico de barras
      });
  
      const ctxLine = document.getElementById('lineChart').getContext('2d');
      chartRefLine.current = new Chart(ctxLine, {
        // ... configuración del gráfico de líneas
      });
  
      const ctxPie = document.getElementById('pieChart').getContext('2d');
      chartRefPie.current = new Chart(ctxPie, {
        // ... configuración del gráfico circular
      });
    }
  
    // Limpiar los gráficos cuando el componente se desmonta
    return () => {
      if (chartRefBar.current) {
        chartRefBar.current.destroy();
      }
      if (chartRefLine.current) {
        chartRefLine.current.destroy();
      }
      if (chartRefPie.current) {
        chartRefPie.current.destroy();
      }
    };
  }, [data]);

  return (
    <div>
      <canvas id="barChart"></canvas>
      <canvas id="lineChart"></canvas>
      <canvas id="pieChart"></canvas>
    </div>
  );
};

export default ChartsComponent;



