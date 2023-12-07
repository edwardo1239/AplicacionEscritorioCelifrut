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
    const isSelected = selectedPermissions.some((p) => p.name === permission.name);
    if (isSelected) {
      setSelectedPermissions(selectedPermissions.filter((p) => p.name !== permission.name));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  const handleSave = async () => {
    const permissionsWithActions = selectedPermissions.map((permission) => {
      // Agregar la letra "w" al permiso seleccionado
      return permission.name === "Ingreso de fruta" ? { ...permission, name: `${permission.name}w` } : permission;
    });
  
    const request = {
      action: 'cuenta',
      data: { username, password, permissions: permissionsWithActions },
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
    const isSelected = selectedPermissions.some((p) => p.name === permission.name);
    return (
      <div key={permission.name} style={styles.checkboxContainer}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handlePermissionChange(permission)}
            style={styles.checkbox}
          />
          <label style={styles.checkboxLabel}>
            {permission.description}
          </label>
        </div>
        <div style={{ marginLeft: '20px' }}>
          <input
            type="checkbox"
            checked={isSelected && permission.editable}
            onChange={() => handleEditPermissionChange(permission)}
            style={styles.checkbox}
          />
          <label style={styles.checkboxLabel}>
            Editar
          </label>
        </div>
      </div>
    );
  };

  const handleEditPermissionChange = (permission) => {
    // Toggle the edit permission selection
    const updatedPermissions = selectedPermissions.map((p) => {
      return p.name === permission.name ? { ...p, editable: !p.editable } : p;
    });

    setSelectedPermissions(updatedPermissions);
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
    },
    title: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '20px',
      transition: 'color 0.3s ease, transform 0.3s ease',
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
    },
    button: {
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
    },
    checkbox: {
      marginRight: '8px',
      opacity: 1,  // Ajuste para hacer visible el checkbox
      transform: 'scale(1)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    },
    checkboxLabel: {
      fontSize: '14px',
      color: '#555',
      marginBottom: '0px',
    },
    checkboxChecked: {
      color: '#4CAF50',
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
        {permissions.map(renderPermissionCheckbox)}
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