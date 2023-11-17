import React, { useState, useEffect } from 'react';
import Graficas from './Graficas';
import { format, getMonth, getYear, getISOWeek } from 'date-fns';
import { parseISO } from 'date-fns';

const tableContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const tableStyles = {
  width: "80%",
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
  overflow: "hidden",
  margin: "20px auto",
};

const thStyles = {
  backgroundColor: "#7D9F3A",
  color: "#fff",
  fontWeight: "bold",
  padding: "12px",
  textAlign: "left",
};

const tdStyles = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

function VolanteCalidad() {
  const [data, setData] = useState([{
      feacha: "2023-10-10T21:55:03.053Z",
      defecto: "5",
      operario: "Lina Saldaño Walteros",
      fruta: "limon",
      unidades: "12"
    
  }]);

  useEffect(() => {
    const funcionAsyncrona = async () =>{
      const request = { action: 'obtenerVolanteCalidad' }
      const data = await window.api.calidad(request)
      setData(data.data)
    }
    funcionAsyncrona()
  }, [])

  useEffect(() =>{
  console.log(data)    
  },[data])

  const dataArray = Object.entries(data).map(([fecha, item]) => ({ fecha, ...item }));
  const formattedData = dataArray.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
  const days = Array.from(new Set(formattedData.map(item => new Date(item.fecha).getDate())));
  const months = Array.from(new Set(formattedData.map(item => new Date(item.fecha).toLocaleDateString('es-ES', { month: '2-digit' }))));
  const years = Array.from(new Set(formattedData.map(item => new Date(item.fecha).toLocaleDateString('es-ES', { year: 'numeric' }))));
  
  const [filters, setFilters] = useState({
    selectedMonth: null,
    selectedYear: null,
    selectedWeek: null,
    selectedFruit: null,
    filterText: '',
  });
  
  
  
  const [filteredData, setFilteredData] = useState([]);
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const [filteredDayData, setFilteredDayData] = useState([]);
  const [filteredMonthData, setFilteredMonthData] = useState([]);
  const [filteredYearData, setFilteredYearData] = useState([]);
  const [filteredWeekData, setFilteredWeekData] = useState([]);
  
  const [defectosPromedioGeneral, setDefectosPromedioGeneral] = useState(0);
  const [promediosPorOperario, setPromediosPorOperario] = useState({});
  
  const calculatePromediosPorOperario = data => {
    if (!data || !Array.isArray(data)) {
      return {};
    }
  
    const defectosPorOperarioSemana = data.reduce((acc, curr) => {
      if (curr && curr.defecto && curr.unidades) {
        const defectos = parseFloat(curr.defecto);
        const unidades = parseFloat(curr.unidades);
        if (!isNaN(defectos) && !isNaN(unidades) && unidades !== 0) {
          const defectosPorUnidad = (defectos / unidades) * 100;
          if (!acc[curr.operario]) {
            acc[curr.operario] = [];
          }
          acc[curr.operario].push(defectosPorUnidad);
        }
      }
      return acc;
    }, {});
  
    return Object.entries(defectosPorOperarioSemana).reduce((acc, [operario, defectos]) => {
      if (defectos.length > 0) {
        const promedio = defectos.reduce((total, current) => total + current, 0) / defectos.length;
        acc[operario] = promedio;
      } else {
        acc[operario] = 0;
      }
      return acc;
    }, {});
  };
  
  const filterData = (data, filters) => {
    return data.filter(item => {
      const itemMonth = getMonth(new Date(item.fecha)) + 1;
      const itemYear = getYear(new Date(item.fecha));
      const itemWeek = getISOWeek(new Date(item.fecha));
  
      const monthFilter = filters.selectedMonth !== null ? itemMonth === filters.selectedMonth : true;
      const yearFilter = filters.selectedYear !== null ? itemYear === filters.selectedYear : true;
      const weekFilter = filters.selectedWeek !== null ? itemWeek === filters.selectedWeek : true;
  
      const fruitFilter =
        filters.selectedFruit !== null &&
        item &&
        item.fruta &&
        typeof item.fruta.toLowerCase === 'function' &&
        filters.selectedFruit &&
        typeof filters.selectedFruit.toLowerCase === 'function'
          ? item.fruta.toLowerCase() === filters.selectedFruit.toLowerCase()
          : true;
  
      const textFilter =
        filters.filterText !== undefined && filters.filterText.trim() !== ''
          ? format(parseISO(item.fecha), "dd/MM/yyyy").toLowerCase().includes(filters.filterText.toLowerCase())
          : true;
  
      return monthFilter && yearFilter && weekFilter && fruitFilter && textFilter;
    });
  };
  
  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => {
     
  
      // Verifica si se está restableciendo los filtros
      const isResettingFilters =
        Object.values(newFilters).every((value) => value === null || value === "") &&
        Object.values(prevFilters).some((value) => value !== null && value !== "");
  
      // Si se está restableciendo los filtros, vuelve al estado inicial sin recargar todos los datos
      if (isResettingFilters) {
        newFilters = {
          selectedMonth: null,
          selectedYear: null,
          selectedWeek: null,
          selectedFruit: null,
          filterText: "",
        };
  
        // Actualiza el estado solo con los nuevos filtros
        setFilteredData(filterData(formattedData, newFilters));
        setFilteredDayData([]);
        setFilteredMonthData([]);
        setFilteredYearData([]);
        setFilteredWeekData([]);
  
        return newFilters;
      }
  
      // Asegúrate de que selectedYear sea un número antes de actualizar el estado
      if (newFilters.selectedYear !== null) {
        newFilters.selectedYear = parseInt(newFilters.selectedYear);
        if (isNaN(newFilters.selectedYear)) {
          newFilters.selectedYear = null;
        }
      }
  
      // Restablece los estados según los nuevos filtros
      const updatedFilters = { ...prevFilters, ...newFilters };
      const newFilteredData = filterData(formattedData, updatedFilters);
  
      // Restablece específicamente los estados para los filtros que lo necesiten
      setFilteredData(newFilteredData);
      setFilteredDayData(filterData(newFilteredData, { /* filtros adicionales para el día */ }));
      setFilteredMonthData(filterData(newFilteredData, { /* filtros adicionales para el mes */ }));
      setFilteredYearData(filterData(newFilteredData, { /* filtros adicionales para el año */ }));
      setFilteredWeekData(newFilteredData);
  
      return updatedFilters;
    });
  };
  
  useEffect(() => {
    const weeks = new Set();
    formattedData.forEach(item => {
      const week = getISOWeek(new Date(item.fecha));
      weeks.add(week);
    });
  
    const newAvailableWeeks = Array.from(weeks);
    if (JSON.stringify(newAvailableWeeks) !== JSON.stringify(availableWeeks)) {
      setAvailableWeeks(newAvailableWeeks);
    }
  }, [formattedData, availableWeeks]);
  
  useEffect(() => {
    if (filteredData.length > 0) {
      setFilteredWeekData(filteredData);
  
      const defectosPorUnidadSemana = filteredData.map(item => {
        const defectos = parseFloat(item.defecto);
        const unidades = parseFloat(item.unidades);
        if (!isNaN(defectos) && !isNaN(unidades) && unidades !== 0) {
          return (defectos / unidades) * 100;
        }
        return 0;
      });
  
      const defectosPromedioSemana =
        defectosPorUnidadSemana.reduce((acc, curr) => acc + curr, 0) / defectosPorUnidadSemana.length;
  
      setDefectosPromedioGeneral(defectosPromedioSemana);
  
      const promediosPorOperarioSemana = calculatePromediosPorOperario(filteredData);
  
      setPromediosPorOperario(promediosPorOperarioSemana);
    } else {
      setDefectosPromedioGeneral(0);
      setPromediosPorOperario({});
      setFilteredWeekData([]);
      setFilteredDayData([]);
      setFilteredMonthData([]);
      setFilteredYearData([]);
    }
  }, [filteredData]);
  
  return (
    <div style={tableContainer}>
      <h2>Tabla de Datos de Calidad</h2>
      <button
  onClick={() => updateFilters({
    selectedMonth: null,
    selectedYear: null,
    selectedWeek: null,
    selectedFruit: null,
    filterText: '',
  })}
  style={{
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease', // Transición suave en el cambio de color
  }}
  onMouseEnter={(e) => { e.target.style.backgroundColor = '#2980b9'; }} // Cambio de color en hover
  onMouseLeave={(e) => { e.target.style.backgroundColor = '#3498db'; }} // Restaura el color original al dejar de hacer hover
>
  Restablecer Filtros
</button>
      <div>
        <h3>Filtrar por tipo de fruta:</h3>
        <select
          value={filters.selectedFruit || ''}
          onChange={(e) => updateFilters({ selectedFruit: e.target.value })}
          style={{
            padding: '7px',
            fontSize: '16px',
            border: '2px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            width: '350px',
            margin: '3px 0',
            outline: 'none',
          }}
        >
          <option value="">Seleccione una fruta</option>
          <option value="naranja">Naranja</option>
          <option value="limon">Limón</option>
        </select>
      </div>
      <div>
        <h3>Filtrar por fecha:</h3>
        <input
          type="text"
          placeholder="Escribe una fecha (DD/MM/AAAA)"
          value={filters.filterText}
          onChange={(e) => updateFilters({ filterText: e.target.value })}
          style={{
            padding: '8px',
            fontSize: '16px',
            border: '2px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            width: '350px',
            margin: '3px 0',
            outline: 'none',
          }}
        />
      </div>
      <div>
        <h3>Filtrar por semana:</h3>
        <select
          value={filters.selectedWeek || ''}
          onChange={(e) => updateFilters({ selectedWeek: parseInt(e.target.value) })}
          style={{
            padding: '7px',
            fontSize: '16px',
            border: '2px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            width: '350px',
            margin: '3px 0',
            outline: 'none',
          }}
        >
          <option value="">Seleccione una semana</option>
          {availableWeeks.map((week) => (
            <option key={week} value={week}>
              Semana {week}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h3>Filtrar por mes:</h3>
        <select
        value={filters.selectedMonth || ''}
          onChange={(e) => updateFilters({ selectedMonth: parseInt(e.target.value) })}
          style={{
            padding: '8px',
            fontSize: '16px',
            border: '2px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            width: '350px',
            margin: '3px 0',
            outline: 'none',
          }}
        >
          <option value="">Seleccione un mes</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h3>Filtrar por año:</h3>
        <select
        value={filters.selectedYear || ''}
          onChange={(e) => updateFilters({ selectedYear: parseInt(e.target.value) })}
          style={{
            padding: '8px',
            fontSize: '16px',
            border: '2px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            width: '350px',
            margin: '3px 0',
            outline: 'none',
          }}
        >
          <option value="">Seleccione un año</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={thStyles}>Fecha</th>
            <th style={thStyles}>Tipo de fruta</th>
            <th style={thStyles}>Operario</th>
            <th style={thStyles}>Unidades Revisadas</th>
            <th style={thStyles}>Número de defecto</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td style={tdStyles}>{format(parseISO(item.fecha), "dd/MM/yyyy HH:mm:ss")}</td>
              <td style={tdStyles}>{item.fruta}</td>
              <td style={tdStyles}>{item.operario}</td>
              <td style={tdStyles}>{item.unidades}</td>
              <td style={tdStyles}>{item.defecto}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" style={tdStyles}>Promedio general de porcentaje de defectos sobre unidades revisadas:</td>
            <td style={tdStyles}>{defectosPromedioGeneral.toFixed(2)}%</td>
          </tr>
          <tr>
            <td colSpan="4" style={tdStyles}>Promedios por operario:</td>
            <td style={tdStyles}></td>
          </tr>
          {Object.entries(promediosPorOperario).map(([operario, promedio], index) => (
            <tr key={index}>
              <td colSpan="4" style={tdStyles}>{operario}</td>
              <td style={tdStyles}>{promedio.toFixed(2)}%</td>
            </tr>
          ))}
        </tfoot>
      </table>
      <Graficas
        filteredData={
          filteredWeekData.length > 0 ? filteredWeekData : (
            filteredDayData.length > 0 ? filteredDayData : (
              filteredMonthData.length > 0 ? filteredMonthData : filteredYearData
            )
          )
        }
      />
    </div>
  );
  };
  export default VolanteCalidad;
  