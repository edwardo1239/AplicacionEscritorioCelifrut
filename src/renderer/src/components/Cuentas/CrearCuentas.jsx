import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePermissionChange = (permission) => {
    // Toggle the permission selection
    const isSelected = selectedPermissions.includes(permission);
    if (isSelected) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permission));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  const handleSave = async () => {
    const request = {
      action: 'cuenta',
      data: { username, password, permissions: selectedPermissions },
    };
  
    try {
      // Simulación de la llamada al servidor
      const response = await window.api.ingresoFruta(request);
  
      // Verifica la respuesta del servidor y realiza acciones adicionales si es necesario.
  
      // Muestra el mensaje de éxito solo si la respuesta es satisfactoria.
      setShowSuccessMessage(true);
  
      // Resetear los campos después de enviar los datos al servidor.
      setUsername('');
      setPassword('');
      setSelectedPermissions([]);
  
      // Utilizar la función de setState con un callback para asegurar la actualización síncrona de los estados.
      setShowSuccessMessage(false);
    } catch (error) {
      // Maneja errores de la llamada al servidor aquí.
      console.error('Error al enviar datos al servidor:', error);
    }
  };

  const renderPermissionCheckbox = (permission) => {
    const isSelected = selectedPermissions.includes(permission);
    return (
      <div key={permission} style={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => handlePermissionChange(permission)}
          style={styles.checkbox}
        />
        <label style={{ ...styles.checkboxLabel, ...(isSelected && styles.checkboxChecked) }}>
          {permission}
        </label>
      </div>
    );
  };

  const styles = {
    card: {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      borderRadius: '12px',
      padding: '40px',
      width: '550px',
      margin: 'auto',
      marginTop: '100px',
      marginBottom: '100px',
      transition: 'transform 0.3s ease, opacity 0.5s ease',
      ':hover': {
        transform: 'scale(1.05)',
      },
    },
    title: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '20px',
      transition: 'color 0.3s ease, transform 0.3s ease',
      ':hover': {
        color: '#4CAF50',
        transform: 'scale(1.1)',
      },
    },
    inputContainer: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '20px',
    },
    label: {
      marginBottom: '8px',
      color: '#333',
      fontSize: '16px',
    },
    input: {
      padding: '12px',
      fontSize: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      transition: 'border-color 0.3s ease, transform 0.3s ease',
      ':hover': {
        borderColor: '#555',
      },
      ':focus': {
        borderColor: '#4CAF50',
        transform: 'scale(1.02)',
      },
    },
    button: {
      padding: '12px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      ':hover': {
        backgroundColor: '#45a049',
      },
      ':active': {
        transform: 'translateY(2px)',
      },
    },
    icon: {
      marginRight: '8px',
    },
    successMessage: {
      marginTop: '20px',
      color: '#4CAF50',
      fontWeight: 'bold',
      animation: 'fade-in 1s ease-in-out',
    },
    '@keyframes fade-in': {
      '0%': {
        opacity: 0,
      },
      '100%': {
        opacity: 1,
      },
    },
    permissionContainer: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '20px',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      transition: 'transform 0.2s ease-in-out',
      ':hover': {
        transform: 'scale(1.1)',
      },
    },
    checkbox: {
      marginRight: '8px',
      opacity: 0,
      transform: 'scale(0.8)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    },
    checkboxLabel: {
      fontSize: '14px',
      color: '#555',
      marginBottom: '100px'
    },
    checkboxChecked: {
      color: '#4CAF50',
    },
  };

  const permissions = ["Ingreso de fruta", "Inventario", "Contenedores", "Calidad", "Proveedores", "Lotes", "Cuenta"];

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Crear Cuenta</h1>

      <div style={styles.inputContainer}>
        <label style={styles.label}>Usuario:</label>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          style={styles.input}
        />
      </div>

      <div style={styles.inputContainer}>
        <label style={styles.label}>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          style={styles.input}
        />
      </div>

      <div style={styles.permissionContainer}>
        <label style={styles.label}>Permisos:</label>
        {permissions.map((permission) => {
          return (
            <div key={permission}>
              <input
                type="checkbox"
                checked={selectedPermissions.includes(permission)}
                onChange={() => handlePermissionChange(permission)}
              />
              <label>{permission}</label>
            </div>
          );
        })}
      </div>

      <button onClick={handleSave} style={styles.button}>
        <FontAwesomeIcon icon={faArrowRight} style={styles.icon} />
        Guardar
      </button>

      {showSuccessMessage && (
        <div style={styles.successMessage}>
          ¡Usuario {username} guardado con éxito!
        </div>
      )}
    </div>
  );
};

export default App;