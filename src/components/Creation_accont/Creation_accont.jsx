import React, { useState } from 'react'
import fondo from '../../assets/fondo-emca.jpg'
import './Creation_accont.css'
import previous from '../../assets/previous.png'
import {Link, useNavigate} from 'react-router-dom'
import { useFromContext } from '../../Context/FromContext';

export const CreationAccont = () => {
      const [visible, setVisible] = useState(false);
      const [message, setMessage] = useState('');
      const [nombre, setNombre] = useState('');
      const [apellido, setApellido] = useState('');
      const [correo, setCorreo] = useState('');
      const [contraseña, setContraseña] = useState('');
      const navigate = useNavigate();
      const {register} = useFromContext();
    
    
      const handleSubmit = async (e) =>{
      e.preventDefault()

      if (!nombre || !apellido || !correo || !contraseña) {
        setMessage('Por favor, completa todos los campos requeridos')
        return
      }

      if (!correo.includes('@gmail.com')) {
        setMessage('Por favor ingrese bien el correo ')
        return
      }

      const result = await register(nombre, apellido, correo, contraseña);

      if (result.success) {
        setMessage(result.message)
        navigate('/')
      } else {
        setMessage(result.message)
      }
    }

  return (
    <div className='sesion'>
      <div className='fondo'>
      <img className='img-fondo' src={fondo} alt="" />
      </div>
      <div className='creation-form'>
        <div className='pre-cre'>
        <Link to='/'>
        <img className='pre-creation' src={previous} alt="" />
        </Link>
        <p className='p-vol'>Volver</p>
        </div>
          <form action="" onSubmit={handleSubmit}>
            <div className='f-creation'>
            <div className='sesion-form'>
               <p className='p-sesion'>Nombre</p>
               <input className='input-creation' type="text" placeholder='nombre de la persona' value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <p className='p-sesion'>Apellido</p>
               <input className='input-creation' type="text" placeholder='apellido de la persona' value={apellido} onChange={(e) => setApellido(e.target.value)} />
                <p className='p-sesion'>Correo</p>
                <input className='input-creation' type="text" placeholder='correo@gmail.com' value={correo} onChange={(e) => setCorreo(e.target.value)} />
                <div className="password-container">
                <p className='p-sesion'>Contraseña</p>
                <input className='input-creation'  type={visible ? "text" : "password"} placeholder='***********' value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
                <button
        type="button"
        className="toggle-password-1"
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
                <div>
                  <button className='btn-creation' type='submit'>Crear Cuenta</button>
                </div>
            </div>
            {message && <p className="message">{'Error al crear un equipo'}</p>}
          </form>
      </div>
    </div>
  )
}
