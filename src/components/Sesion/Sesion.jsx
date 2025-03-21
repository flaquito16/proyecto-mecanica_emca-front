import React, { useState } from 'react'
import './Sesion.css'
import fondo from '../../assets/fondo-emca.jpg'
import {Link, useNavigate} from 'react-router-dom'
import { useFromContext } from '../../Context/FromContext';

export const Sesion = () => {
    const [correo, setCorreo] = useState('')
    const [contraseña, setContraseña] = useState('')
    const [message, setMessage] = useState('')
    const [visible, setVisible] = useState(false);
    const { login } = useFromContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !contraseña) {
        setMessage('Por favor llenar todos los datos')
        return
    }
    if (!correo.includes('@gmail.com')) {
        setMessage('Tiene que colocar el @gmail.com')
        return
    }

    const result = await login(correo, contraseña);

    if (result.success) {
      setMessage('Sesion iniciada exitosamente')
      navigate('/home')
    } else {
      setMessage(result.message)
    }
}

  return (
    <div className='sesion'>
        <div className='fondo'>
            <img className='img-fondo' src={fondo} alt="" />
        </div>
        <div className='se-form'>
            <form className='form-sesion
            ' onSubmit={handleSubmit}>
                <div className='f-se'>
            <div className='sesion-form'>
                <p className='p-sesion'>Correo</p>
                <input className='input-sesion' type="text" placeholder='correo@gmail.com' value={correo} onChange={(e) => setCorreo(e.target.value)}/>
                <div className="password-container">
                <p className='p-sesion'>Contraseña</p>
                <input className='input-sesion'  type={visible ? "text" : "password"} placeholder='***********' value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
                <button
        type="button"
        className="toggle-password"
        onClick={() => setVisible(!visible)}
      >
        {visible ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.98 8.226a10.473 10.473 0 0116.04 0m-1.516 9.217A10.474 10.474 0 013.98 8.226m4.89 4.887a3 3 0 014.24-4.24m-4.24 4.24a3 3 0 004.24 4.24m-4.24-4.24L12 12m0 0l.707-.707m-.707.707L11.293 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5c5.523 0 10 6 10 6s-4.477 6-10 6-10-6-10-6 4.477-6 10-6zm0 0a3 3 0 110 6 3 3 0 010-6z"
            />
          </svg>
        )}
      </button>

                </div>
                </div>
            <div className='sesion-button'>
                <div className='sesion-btn'>
                    <button className='btn-sesion' type='submit'>Iniciar Sesión</button>
                </div>
                <p>
                    O
                </p>
                <div className='creation-btn'>
                    <Link to='/register'>
                    <button className='btn-sesion' type='submit'>Crear Cuenta</button>
                    </Link>
                </div>
                {message && <p className="message">{message}</p>}
            </div>
                </div>
            </form>
        </div>
    </div>
  )
}
