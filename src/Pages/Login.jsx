import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './UserContext';
import "./Login.css";

function Login({ isLoggedIn }) {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const enteredUsername = e.target.nombre.value;
    const enteredPassword = e.target.password.value;

    const simulatedUsername = 'admin';
    const simulatedPassword = 'admin123';

    if (enteredUsername === simulatedUsername && enteredPassword === simulatedPassword) {
      Swal.fire({
        text: `Bienvenido ${enteredUsername} a nuestro sitio.`,
        timer: 3000,
        icon: "success" 
      });
      handleLogin(enteredUsername);
      navigate('/women');
    } else {
      setError(true);
      Swal.fire({
        text: `<p>El <b>usuario</b> o la <b>contraseña</b> ingresados son incorrectos, por favor inténtelo de nuevo.</p> `,
        timer: 3000,
        icon: "error"
      });
    }

    e.target.reset();
  };

  return (
    <>
     <div className="barra-superior">
        <h2 className="titulo-section">Inicio de Sesión</h2>
      </div>
      <div className='formContainerInicio'>
        <form className= 'createFormInicio' onSubmit={handleSubmit}>
        <div className="input-container">         
          <label >Usuario</label>
          <input className='inputInicio'
           type="text"
           name="nombre" 
           placeholder="Introduzca su nombre" />           
          </div>
          <div className="input-container">   
          <label > Contraseña</label>
          <input className='inputInicio'
          type="password" 
          name="password" 
          placeholder="Introduzca su contraseña" />  
          </div>       
          <button className="btn" type="submit">Enviar</button>
        </form>
        {isLoggedIn && <p>Usuario autenticado</p>}
      </div>
    </>
     );
    }

export default Login;