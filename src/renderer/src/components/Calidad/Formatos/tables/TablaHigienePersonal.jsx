import React, { Component } from 'react'
import { format } from 'date-fns'

const tableStyle = {
  width: '100%',
  border: '1px solid #ddd',
  borderCollapse: 'collapse',
  textAlign: 'center' // Para centrar la tabla
}

const thStyle = {
  backgroundColor: '#f2f2f2',
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'left',
  marginBottom: '8px'
}
const thStylef = {
  backgroundColor: '#f2f2f2',
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'left',
  with: '100%'
}

const tdStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'left'
}

const inputStyle = {
  padding: '8px',
  marginBottom: '10px',
  width: '100%'
}

const filterContainer = {
  width: '48%',
  padding: '10px',
  marginTop: '10px'
}

class TablaHigienePersonal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [], // Vaciar el arreglo para reemplazarlo con los nuevos datos
      nombreFiltro: '', // Agregar el estado para el filtro de nombre
      fechaFiltro: '' // Agregar el estado para el filtro de fecha
    }
  }

  componentDidMount() {
    const request = { action: 'obtenerRegistroHigiene' }
    window.api.calidad(request).then((newData) => {
      console.log(newData.data)

      this.setState({ data: newData.data })
    })
  }

  formatText = (key, value) => {
    // Convierte el nombre de la propiedad a un texto más legible y el valor booleano a "Cumple" o "No Cumple"
    switch (key) {
      case 'unasCortas':
        return 'Uñas Cortas'
      case 'estadoSalud':
        return 'estado de Salud'
      default:
        return key
    }
  }

  handleFechaChange = (event) => {
    this.setState({ fechaFiltro: event.target.value })
    const filteredData = this.applyFilters(event.target.value, this.state.nombreFiltro)
    this.setState({ filteredData: filteredData })
  }

  handleNombreChange = (event) => {
    this.setState({ nombreFiltro: event.target.value })
    const filteredData = this.applyFilters(this.state.fechaFiltro, event.target.value)
    this.setState({ filteredData: filteredData })
  }

  applyFilters = (fechaFiltro, nombreFiltro) => {
    const { data } = this.state
    if (fechaFiltro || nombreFiltro) {
      return data.filter((item) => {
        const fechaIncluida = fechaFiltro ? item.fecha.includes(fechaFiltro) : true
        const nombreIncluido = nombreFiltro
          ? item.colaborador.toLowerCase().includes(nombreFiltro.toLowerCase())
          : true
        return fechaIncluida && nombreIncluido
      })
    }
    return data
  }

  render() {
    const filteredData = this.applyFilters(this.state.fechaFiltro, this.state.nombreFiltro)
    console.log(filteredData)
    return (
      <div>
        <div style={filterContainer}>
          <label htmlFor="fechaFiltro" style={thStylef}>
            Filtrar por fecha:
          </label>
          <input
            type="text"
            id="fechaFiltro"
            value={this.state.fechaFiltro}
            onChange={this.handleFechaChange}
            style={inputStyle}
          />
          <label htmlFor="nombreFiltro" style={thStylef}>
            Filtrar por nombre de colaborador:
          </label>
          <input
            type="text"
            id="nombreFiltro"
            value={this.state.nombreFiltro}
            onChange={this.handleNombreChange}
            style={inputStyle}
          />
        </div>
        <h2 style={thStyle}>HIGIENE PERSONAL</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Responsable</th>
              <th style={thStyle}>Colaborador</th>
              <th style={thStyle}>Elementos</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{format(new Date(item.fecha), 'dd/MM/yyyy HH:mm:ss')}</td>
                <td style={tdStyle}>{item.responsable}</td>
                <td style={tdStyle}>{item.colaborador}</td>
                <td style={tdStyle}>
                  Elementos de Higiene Personal:
                  {Object.entries(item.elementosHigiene).map(([key, value]) => {
                    if (key !== '_id') {
                      return (
                        <p key={key} style={tdStyle}>
                          {this.formatText(key, value)}: {value ? 'Cumple' : 'No Cumple'}
                        </p>
                      )
                    }
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default TablaHigienePersonal
