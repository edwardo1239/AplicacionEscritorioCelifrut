import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheckSquare } from '@fortawesome/free-solid-svg-icons';


const App = () => {
  const initialState = {
    username: '',
    password: '',
    selectedPermissions: [],
    showSuccessMessage: false,
  };

  const [state, setState] = useState(initialState);
  const [showConfetti, setShowConfetti] = useState(false);


  useEffect(() => {
    const obtenerPermisos = async () => {
      try {
        const request = {
          action: 'obtenerPermisos', // Ajusta según la acción requerida en tu servidor
        };

        // Realiza la petición al servidor para obtener los permisos
        const datosPermisos = await window.api.obtenerPermisos(request);

        // Actualiza el estado con los permisos obtenidos del servidor
        setState((prevState) => ({ ...prevState, selectedPermissions: datosPermisos }));
      } catch (error) {
        console.error('Error al obtener permisos:', error);
      }
    };

    obtenerPermisos();
  }, []);
  const { username, password, selectedPermissions, showSuccessMessage } = state;

  const handleUsernameChange = (event) => {
    const updatedUsername = event.target.value;
    // Asegurar que el usuario contenga solo letras y números
    const sanitizedUsername = updatedUsername.replace(/[^a-zA-Z0-9]/g, '');
    setState((prevState) => ({ ...prevState, username: sanitizedUsername }));
  };

  const handlePasswordChange = (event) => {
    const updatedPassword = event.target.value;
    setState((prevState) => ({ ...prevState, password: updatedPassword }));
  };

  const handlePermissionChange = (permission) => {
    const isSelected = selectedPermissions.some((p) => p.name === permission.name);
    const updatedPermissions = isSelected
      ? selectedPermissions.filter((p) => p.name !== permission.name)
      : [...selectedPermissions, permission];

    setState((prevState) => ({ ...prevState, selectedPermissions: updatedPermissions }));
  };

  const handleSave = async () => {
    try {
      setShowConfetti(true);

      // Limpia los campos antes de enviar los datos al servidor.
      setState(initialState);

      // Simulación de la llamada al servidor
      const response = await window.api.ingresoFruta({
        action: 'crearCuenta',
        data: { username, password, permissions: selectedPermissions.map((permission) => ({ ...permission })) },
      });

      // Muestra el mensaje de éxito solo si la respuesta es satisfactoria.
      setState((prevState) => ({ ...prevState, showSuccessMessage: true }));

      // Oculta el confeti y el mensaje de éxito después de 2000 milisegundos (2 segundos).
      setTimeout(() => {
        setShowConfetti(false);
        setState(initialState);
      }, 2000);
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);
    }
  };

  const renderPermissionCheckbox = (permission) => {
    const isSelected = selectedPermissions.some((p) => p.name === permission.name);
    const isEditable = isSelected && permission.editable;

    return (
      <div key={permission.name} style={styles.checkboxContainer}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handlePermissionChange(permission)}
            style={styles.checkbox}
          />
          <label style={styles.checkboxLabel}>{permission.description}</label>
        </div>
        <div style={{ marginLeft: '20px' }}>
          <input
            type="checkbox"
            checked={isEditable}
            onChange={() => handleEditPermissionChange(permission)}
            style={styles.checkbox}
          />
          <label style={styles.checkboxLabel}>Editar</label>
        </div>
      </div>
    );
  };

  const handleEditPermissionChange = (permission) => {
    const updatedPermissions = selectedPermissions.map((p) =>
      p.name === permission.name ? { ...p, editable: !p.editable } : p
    );

    setState({ ...state, selectedPermissions: updatedPermissions });
  };

  const styles = {
    card: {
      boxShadow: '0 20px 20px rgba(0, 0, 0, 0.2)',
      borderRadius: '12px',
      padding: '40px',
      width: '550px',
      margin: 'auto',
      marginTop: '50px',
      marginBottom: '50px',
      transition: 'transform 0.3s ease, opacity 0.5s ease',
      position: 'relative',
    },
    cardHover: {
      transform: 'scale(1.05)',
    },
    title: {
      fontSize: '32px',
      color: '#333',
      marginBottom: '20px',
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: '18px',
      color: '#555',
      marginBottom: '20px',
    },
    inputContainer: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#333',
      fontSize: '16px',
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      transition: 'border-color 0.3s ease, transform 0.3s ease',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    icon: {
      marginRight: '8px',
    },
    successMessage: {
      marginTop: '20px',
      color: '#4CAF50',
      fontWeight: 'bold',
    },
    permissionContainer: {
      marginBottom: '20px',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
    },
    checkbox: {
      marginRight: '10px',
    },
    checkboxLabel: {
      fontSize: '14px',
      color: '#555',
      marginBottom: '2px',
    },
    checkboxTick: {
      color: 'green',
    },
  };

  const permissions = [
    { name: "Ingreso de fruta", description: "Ingreso de fruta" },
    { name: "Inventario", description: "Inventario" },
    { name: "Contenedores", description: "Contenedores" },
    { name: "Calidad", description: "Calidad" },
    { name: "Proveedores", description: "Proveedores" },
    { name: "Lotes", description: "Lotes" },
    { name: "Cuenta", description: "Cuenta" },
  ];

  return (
    <div
      style={{ ...styles.card, ...(showConfetti && styles.cardHover) }}
      onMouseEnter={() => setShowConfetti(false)}
    >
      <h1 style={styles.title}>Formulario de Creación de Cuentas</h1>
      <p style={styles.subtitle}>Complete la información a continuación para crear una nueva cuenta.</p>

      <div style={styles.inputContainer}>
        <label style={styles.label}>Usuario:</label>
        <input
          type="text"
          value={state.username}
          onChange={handleUsernameChange}
          style={styles.input}
        />
      </div>

      <div style={styles.inputContainer}>
        <label style={styles.label}>Contraseña:</label>
        <input
          type="password"
          value={state.password}
          onChange={handlePasswordChange}
          style={styles.input}
        />
      </div>

      <div style={styles.permissionContainer}>
        <label style={styles.label}>Permisos:</label>
        {permissions.map(renderPermissionCheckbox)}
      </div>

      <button onClick={handleSave} style={styles.button}>
        <FontAwesomeIcon icon={faArrowRight} style={styles.icon} />
        Guardar
      </button>

      {showSuccessMessage && (
        <>
          <div style={styles.successMessage}>
            ¡Usuario {state.username} guardado con éxito!
          </div>
          {showConfetti && <Confetti />}
        </>
      )}
    </div>
  );
};

export default App;