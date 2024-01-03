import React, { useState, useEffect, ChangeEvent } from 'react';
import { useSpring, animated } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faUser,
  faLock,
  faEnvelope,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

const Confetti = () => {
  return <div>Confetti</div>;
};

declare global {
  interface Window {
    api: any;
  }
}

const AnimatedInput = animated('input');

const App = () => {
  const initialState: {
    username: string;
    password: string;
    email: string;
    showPassword: boolean;
    selectedPermissions: { name: string; isSelected?: boolean; editable?: boolean }[];
    showSuccessMessage: boolean;
  } = {
    username: '',
    password: '',
    email: '',
    showPassword: false,
    selectedPermissions: [],
    showSuccessMessage: false,
  };

  const [state, setState] = useState(initialState);
  const [showConfetti, setShowConfetti] = useState(false);
  const [iconVisible, setIconVisible] = useState({ user: true, lock: true, email: true });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const obtenerPermisos = async () => {
    try {
      const request = {
        action: 'obtenerPermisos',
      };
      const response = await window.api.ingresoFruta(request);

      console.log('Datos de permisos obtenidos:', response);

      if (response.status === 200 && Array.isArray(response.data)) {
        const permissionsWithEditFlag = response.data.map((permission) => ({
          name: permission,
        }));

        setState((prevState) => ({
          ...prevState,
          selectedPermissions: permissionsWithEditFlag,
        }));
      } else {
        console.error('La respuesta del servidor no contiene un array de permisos:', response);
      }
    } catch (error) {
      console.error('Error al obtener permisos:', error);
    }
  };

  useEffect(() => {
    obtenerPermisos();
  }, []);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedUsername = event.target.value;
    const sanitizedUsername = updatedUsername.replace(/[^a-zA-Z0-9]/g, '');
    setState((prevState) => ({ ...prevState, username: sanitizedUsername }));
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedPassword = event.target.value;
    setState((prevState) => ({ ...prevState, password: updatedPassword }));
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedEmail = event.target.value;
    setState((prevState) => ({ ...prevState, email: updatedEmail }));

    // Validar campo de correo
    if (!updatedEmail) {
      setEmailError('Por favor, ingrese su correo electrónico.');
    } else {
      setEmailError(null);
    }
  };

  const toggleShowPassword = () => {
    setState((prevState) => ({ ...prevState, showPassword: !prevState.showPassword }));
  };

  const isEditable = (permissionName: string) => {
    return permissionName !== 'PermisoNoEditable';
  };

  const handlePermissionChange = (permissionName: string) => {
    setState((prevState) => {
      const updatedPermissions = prevState.selectedPermissions.map((permission) =>
        permission.name === permissionName
          ? {
              ...permission,
              isSelected: !permission.isSelected,
              // No cambies automáticamente el estado de editable aquí
            }
          : permission
      );

      return {
        ...prevState,
        selectedPermissions: updatedPermissions,
      };
    });
  };

  const handleEditPermissionChange = (permissionName: string) => {
    setState((prevState) => {
      const updatedPermissions = prevState.selectedPermissions.map((permission) =>
        permission.name === permissionName
          ? { ...permission, editable: !permission.editable }
          : permission
      );

      console.log('PermissionName:', permissionName);
      console.log('Prev State:', prevState);
      console.log('Updated Permissions:', updatedPermissions);

      return {
        ...prevState,
        selectedPermissions: updatedPermissions,
      };
    });
  };

  const handleSave = async () => {
    try {
      // Validar campos obligatorios
      if (!state.username || !state.password || !state.email) {
        setErrorMessage('Por favor, complete todos los campos obligatorios.');

        // Limpiar el mensaje de error después de 5 segundos
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);

        return;
      }

      // Validar al menos un permiso seleccionado
      const hasSelectedPermission = state.selectedPermissions.some(permission => permission.isSelected);
      if (!hasSelectedPermission) {
        setErrorMessage('Por favor, seleccione al menos un permiso.');

        // Limpiar el mensaje de error después de 5 segundos
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);

        return;
      }

      setShowConfetti(true);
      setState(initialState);

      await obtenerPermisos();

      const selectedPermissions = state.selectedPermissions
        .filter((permission) => permission.isSelected && isEditable(permission.name))
        .map((permission) => ({
          name: permission.name,
          editable: permission.editable,
        }));

      const response = await window.api.ingresoFruta({
        action: 'crearCuenta',
        data: {
          username: state.username,
          password: state.password,
          email: state.email,
          permissions: selectedPermissions,
        },
      });

      if (response.status === 200) {
        const responseData = response.data;
        console.log('Respuesta del servidor:', responseData);
        setState((prevState) => ({ ...prevState, showSuccessMessage: true }));
      } else {
        console.error('Error en la respuesta del servidor:', response);
      }

      setTimeout(() => {
        setShowConfetti(false);
        setState(initialState);
      }, 2000);
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);
    }
  };

  const renderPermissionCheckbox = (permission: any) => {
    const { name, isSelected } = permission;
    const isPermisoEditable = isEditable(name);

    return (
      <div key={name} className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => handlePermissionChange(name)}
          className="mr-2"
          disabled={!isPermisoEditable}
        />
        <label className="text-sm text-gray-500">{name}</label>
        {isPermisoEditable && isSelected && (
          <div className="ml-2">
            <input
              type="checkbox"
              checked={permission.editable}
              onChange={() => handleEditPermissionChange(name)}
              className="mr-2"
            />
            <label className="text-sm text-gray-500">Editar</label>
          </div>
        )}
        <FontAwesomeIcon icon={faArrowRight as import('@fortawesome/fontawesome-svg-core').IconProp} className="ml-2" />
      </div>
    );
  };

  const animatedUsernameInputProps = useSpring({
    border: state.username ? '2px solid #4CAF50' : '1px solid #ccc',
    transform: state.username ? 'scale(1.05)' : 'scale(1)',
  });

  const animatedPasswordInputProps = useSpring({
    border: state.password ? '2px solid #4CAF50' : '1px solid #ccc',
    transform: state.password ? 'scale(1.05)' : 'scale(1)',
  });

  const animatedEmailInputProps = useSpring({
    border: state.email ? '2px solid #4CAF50' : '1px solid #ccc',
    transform: state.email ? 'scale(1.05)' : 'scale(1)',
  });

  const buttonAnimationProps = useSpring({
    scale: state.showSuccessMessage ? 0.8 : 1,
  });

  const successMessageAnimationProps = useSpring({
    opacity: state.showSuccessMessage ? 1 : 0,
  });

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg" style={{ width: '600px', height: '780px', marginBottom: '20px', marginTop: '200px' }}>
        <h1 className="text-xl font-bold mb-4 text-center">Formulario de Creación de Cuentas</h1>
        {errorMessage && (
          <div className="mb-4 text-red-500">
            {errorMessage}
          </div>
        )}
        <p className="text-sm text-gray-600 mb-4">Complete la información a continuación para crear una nueva cuenta</p>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">
            <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
            Usuario:
          </label>
          <div className="relative">
            <AnimatedInput
              type="text"
              value={state.username}
              onChange={handleUsernameChange}
              onFocus={() => setIconVisible({ ...iconVisible, user: false })}
              onBlur={() => setIconVisible({ ...iconVisible, user: true })}
              className="w-full p-2 rounded text-sm transition-transform"
              style={animatedUsernameInputProps}
            />
            {iconVisible.user && (
              <FontAwesomeIcon icon={faUser} className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-400" />
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">
            <FontAwesomeIcon icon={faLock} className="mr-2 text-gray-500" />
            Contraseña:
          </label>
          <div className="relative">
            <AnimatedInput
              type={state.showPassword ? 'text' : 'password'}
              value={state.password}
              onChange={handlePasswordChange}
              className="w-full p-2 rounded text-sm transition-transform"
              style={animatedPasswordInputProps}
            />
            <FontAwesomeIcon icon={state.showPassword ? faEyeSlash : faEye} className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer text-gray-400" onClick={toggleShowPassword} />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-500" />
            Correo Electrónico:
          </label>
          <div className="relative">
            <AnimatedInput
              type="email"
              value={state.email}
              onChange={handleEmailChange}
              onFocus={() => setIconVisible({ ...iconVisible, email: false })}
              onBlur={() => setIconVisible({ ...iconVisible, email: true })}
              className="w-full p-2 rounded text-sm transition-transform"
              style={animatedEmailInputProps}
            />
            {iconVisible.email && (
              <FontAwesomeIcon icon={faEnvelope} className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-400" />
            )}
          </div>
          {emailError && <div className="text-red-500">{emailError}</div>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Permisos:</label>
          {state.selectedPermissions.map(renderPermissionCheckbox)}
        </div>

        <animated.button
          onClick={handleSave}
          className="w-full p-2 bg-green-500 text-white rounded cursor-pointer transition-bg"
          style={buttonAnimationProps}
        >
          Guardar
        </animated.button>

        {state.showSuccessMessage && (
          <>
            <animated.div className="mt-4 text-green-500 font-bold text-center" style={successMessageAnimationProps}>
              ¡Usuario {state.username} guardado con éxito!
            </animated.div>
            {showConfetti && <Confetti />}
          </>
        )}
      </div>
    </div>
  );
};


export default App;