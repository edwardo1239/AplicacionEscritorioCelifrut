import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Modal, TextField } from '@mui/material';
import Api from '../../../../../preload/types';

interface DatosTabla {
  _id: number;
  PREDIO: string;
  ICA: string | number;
  "CODIGO INTERNO": string;
  GGN: string;
  "FECHA VENCIMIENTO GGN": string;
  N: string;
  L: string;
  M: string;
  PROVEEDORES: string;
  DEPARTAMENTO: string;
  documentos: string[];
}

export default function Proveedores() {
  const [datos, setDatos] = useState<DatosTabla[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filtroBusqueda, setFiltroBusqueda] = useState<string>('');
  const [editedIndex, setEditedIndex] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Partial<DatosTabla>>({
    PREDIO: '',
    ICA: '',
    "CODIGO INTERNO": '',
    GGN: '',
    "FECHA VENCIMIENTO GGN": '',
    N: '',
    L: '',
    M: '',
    PROVEEDORES: '',
    DEPARTAMENTO: '',
    documentos: [],
  });
  const [filtroActual, setFiltroActual] = useState<string>('');
  const [archivosSubidos, setArchivosSubidos] = useState([false, false, false]);
  const [errorArchivo, setErrorArchivo] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [reloadTable, setReloadTable] = useState(false); // Nuevo estado para recargar la tabla

  useEffect(() => {
    const obtenerDatosDelServidor = async () => {
      try {
        const request = { action: 'obtenerProveedores' };
        const proveedores = await window.api.proveedores(request);

        const datosFormateados = proveedores.data.map((item) => {
          const newItem: DatosTabla = { _id: item._id };
          for (const key in item) {
            newItem[reemplazarCaracteresEspeciales(key)] = item[key];
          }
          return newItem;
        });

        setDatos(datosFormateados);
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
      }
    };

    obtenerDatosDelServidor();
  }, [reloadTable]); // Escuchar cambios en reloadTable

  useEffect(() => {
    // Actualizar filtroActual de manera asíncrona después de eliminar un predio
    setFiltroActual('');
  }, [datos]);

  const reemplazarCaracteresEspeciales = (str: string) => {
    return str.replace(/├¡/g, 'í').replace(/├▒/g, 'ó');
  };

  const columnasOrdenadas = [
    "CODIGO INTERNO",
    "PREDIO",
    "ICA",
    "N",
    "L",
    "M",
    "DEPARTAMENTO",
    "PROVEEDORES",
    "GGN",
    "FECHA VENCIMIENTO GGN",
  ];

  const handleEliminar = async (index: number) => {
    const predioAEliminar = datos[index].PREDIO;
    const idAEliminar = datos[index]._id; // Mantenido como _id

    if (window.confirm(`¿Seguro que quieres eliminar el predio "${predioAEliminar}"?`)) {
      try {
        const request = {
          action: 'eliminarProveedor',
          id: idAEliminar,
        };

        await window.api.proveedores(request);

        // Actualizar el estado local datos eliminando el predio
        const nuevosDatos = datos.filter((dato) => dato._id !== idAEliminar); // Mantenido como _id
        setDatos(nuevosDatos);

        // Limpiar el filtro de búsqueda
        setFiltroActual('');

        setSuccessMessage('El predio se eliminó correctamente');

      } catch (error) {
        console.error('Error al eliminar predio en el servidor:', error);
      } finally {
        // Forzar la recarga de la tabla después de eliminar
        setReloadTable((prev) => !prev);
      }
    }
  };

  const handleAgregar = () => {
    setEditedIndex(null);
    setEditedData({
      PREDIO: '',
      ICA: '',
      "CODIGO INTERNO": '',
      GGN: '',
      "FECHA VENCIMIENTO GGN": '',
      N: '',
      L: '',
      M: '',
      PROVEEDORES: '',
      DEPARTAMENTO: '',
      documentos: [],
    });
    setArchivosSubidos([false, false, false]);
    setErrorArchivo('');
    setModalOpen(true);

    setFiltroActual('');
  };

  const handleEditar = (index: number) => {
    setEditedIndex(index);
    const dataToEdit = datos[index];
    if (dataToEdit) {
      setEditedData({
        ...dataToEdit,
        documentos: dataToEdit.documentos ? dataToEdit.documentos.slice() : [],
      });
      setModalOpen(true);
      setArchivosSubidos([true, true, true]); // Considera cómo manejar el estado de archivos subidos en el caso de edición.
      setErrorArchivo('');
    }
  };

  const handleGuardarCambios = async () => {
    try {
      const serializedData = JSON.stringify(editedData);

      // Validar que los tres archivos sean subidos
      if (editedIndex === null && !archivosSubidos.every((subido) => subido)) {
        setErrorArchivo('Debes subir los tres archivos obligatorios.');
        return;
      }

      setErrorArchivo('');

      if (editedIndex !== null) {
        const request = {
          action: 'editarProveedor',
          id: editedData._id,
          nuevosDatos: editedData,
        };

        await window.api.proveedores(request);

        const nuevosDatos = datos.map((dato, index) => (index === editedIndex ? { ...dato, ...editedData } : dato));
        setDatos(nuevosDatos);

        setSuccessMessage('Los cambios se guardaron correctamente.');
      } else {
        const request = {
          action: 'agregarProveedor',
          nuevosDatos: {
            ...JSON.parse(serializedData),
          },
        };

        const response = await window.api.proveedores(request);

        setDatos([...datos, { _id: response.id, ...editedData }]);
        setSuccessMessage('El nuevo predio se agregó correctamente.');
      }

      setModalOpen(false);

      // Forzar la recarga de la tabla después de agregar o editar
      setReloadTable((prev) => !prev);

    } catch (error) {
      console.error('Error al guardar cambios en el servidor:', error);
    }
  };

  const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroActual(e.target.value);
  };

  const handleFileChange = (e, documentoKey) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setEditedData((prevData) => ({
        ...prevData,
        documentos: Array.isArray(prevData.documentos) ? [...prevData.documentos, reader.result] : [reader.result],
      }));

      if (documentoKey === 'documento1') {
        setArchivosSubidos((prev) => [true, prev[1], prev[2]]);
      } else if (documentoKey === 'documento2') {
        setArchivosSubidos((prev) => [prev[0], true, prev[2]]);
      } else if (documentoKey === 'documento3') {
        setArchivosSubidos((prev) => [prev[0], prev[1], true]);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const datosFiltrados = datos.filter((dato) => {
    const valores = Object.values(dato).join(' ').toLowerCase();
    return valores.includes(filtroActual.toLowerCase());
  });

  return (
    <div style={{ padding: '20px' }}>
      <style>
        {`
          .app-bar {
            background-color: #7d9f3a;
          }

          .toolbar {
            justify-content: space-between;
          }

          .app-title {
            color: white;
            margin: 0;
          }

          .tabla {
            margin-top: 20px;
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: hidden;
          }

          .table-header {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
            background-color: #f2f2f2;
          }

          .table-cell {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }

          .loading-message {
            margin-top: 20px;
          }

          .button-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }

          .button {
            background-color: #7D9F3A;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-top: 5px;
            margin-bottom: 5px;
          }

          .button:hover {
            background-color: #ff8000;
          }

          .modal-container {
            padding: 20px;
            background: white;
            border-radius: 8px;
            overflow-y: auto;
            max-height: 80vh;
            transition: transform 0.3s;
          }

          .modal-container h2 {
            margin-bottom: 20px;
          }

          .modal-container form {
            display: flex;
            flex-direction: column;
          }

          .modal-container label {
            margin-bottom: 5px;
          }

          .modal-container input[type="file"] {
            margin-bottom: 10px;
          }

          .modal-container .document-inputs {
            display: flex;
            flex-direction: column;
          }
        `}
      </style>

      <AppBar position="static" className="app-bar">
        <Toolbar className="toolbar">
          <h2 className="app-title">Proveedores</h2>
        </Toolbar>
      </AppBar>

      <div className="button-container">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button className="button" onClick={handleAgregar}>Agregar</Button>
          <TextField
            label="Buscar"
            value={filtroActual} 
            onChange={handleBuscar}
            margin="normal"
            variant="outlined"
            style={{ marginLeft: '30px', width: '380px' }}
          />
        </div>
      </div>

      {successMessage && (
        <div style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>
      )}

      {datos.length ? (
        <div className="tabla">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {columnasOrdenadas.map((header, index) => {
                  if (header.toLowerCase() !== 'id') {
                    return (
                      <th key={index} className="table-header">{reemplazarCaracteresEspeciales(header)}</th>
                    );
                  }
                  return null;
                })}
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((fila, index) => {
                const valores = columnasOrdenadas.map(key => fila[key]).join(' ').toLowerCase();
                if (valores.includes(filtroActual.toLowerCase())) {
                  return (
                    <tr key={index}>
                      {columnasOrdenadas.map(key => {
                        if (key.toLowerCase() !== 'id') {
                          return (
                            <td key={key} className="table-cell">{fila[key]}</td>
                          );
                        }
                        return null;
                      })}
                      <td className="table-cell">
                        <Button className="button" style={{ width: '90px' }} onClick={() => handleEditar(index)}>Editar</Button>
                        <Button className="button" onClick={() => handleEliminar(index)}>Eliminar</Button>
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="loading-message">Cargando datos...</div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="modal-container">
          <h2>{editedIndex !== null ? 'Editar Datos' : 'Agregar Nuevo Predio'}</h2>
          <form>
            {columnasOrdenadas.map(key => (
              <TextField
                key={key}
                label={reemplazarCaracteresEspeciales(key)}
                value={editedData[key] || ''}
                onChange={(e) => setEditedData({ ...editedData, [key]: e.target.value })}
                margin="normal"
                fullWidth
              />
            ))}

            {editedIndex === null && (
              <div style={{ marginTop: '20px' }} className="document-inputs">
                <label>Documentos (PDF):</label>
                <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'documento1')} />
                <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'documento2')} />
                <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'documento3')} />
              </div>
            )}

            {errorArchivo && editedIndex === null && (
              <div style={{ color: 'red', marginTop: '10px' }}>{errorArchivo}</div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleGuardarCambios} className="button" style={{ marginRight: '10px' }}>Guardar</Button>
              <Button onClick={() => setModalOpen(false)} className="button" style={{ backgroundColor: '#e74c3c' }}>Cancelar</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}