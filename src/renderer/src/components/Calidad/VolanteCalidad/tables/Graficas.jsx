import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Graficas = ({ filteredData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const getChartData = () => {
      if (!filteredData || !Array.isArray(filteredData) || filteredData.length === 0) {
        return { labels: [], dataValues: [] };
      }

      const defectosPorOperarioSemana = filteredData.reduce((acc, item) => {
        const defectos = parseFloat(item.defecto);
        const unidades = parseFloat(item.unidades);
        if (!isNaN(defectos) && !isNaN(unidades) && unidades !== 0) {
          const defectosPorUnidad = (defectos / unidades) * 100;
          if (!acc[item.operario]) {
            acc[item.operario] = [];
          }
          acc[item.operario].push(defectosPorUnidad);
        }
        return acc;
      }, {});

      const promediosPorOperario = Object.entries(defectosPorOperarioSemana).reduce((acc, [operario, defectos]) => {
        const promedio = defectos.reduce((total, current) => total + current, 0) / defectos.length;
        acc[operario] = promedio;
        return acc;
      }, {});

      const labels = Object.keys(promediosPorOperario);
      const dataValues = Object.values(promediosPorOperario);

      return { labels, dataValues };
    };

    const { labels, dataValues } = getChartData();

    if (chartRef.current) {
      chartRef.current.data.labels = labels;
      chartRef.current.data.datasets[0].data = dataValues;
      chartRef.current.update();
    } else {
      const ctx = document.getElementById('myChart').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Promedio de defectos por operario',
              data: dataValues,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Porcentaje de defectos',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Operarios',
              },
            },
          },
        },
      });
    }
  }, [filteredData]);

  return (
    <div>
      <h2>Gráfico de Porcentaje de Defectos por Operario</h2>
      <canvas id="myChart" width="400" height="400"></canvas>
    </div>
  );
};

export default Graficas;
