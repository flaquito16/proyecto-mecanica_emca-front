import React from 'react'
import { useFromContext } from '../../Context/FromContext';
import './User.css'
import { Link } from 'react-router-dom';

export const User = () => {
    const {currentUser, logout} = useFromContext();
  return (
    <div>
        <h3>Usuario</h3>
        {currentUser ? (
            <div className='user'>
            <strong className='user-name'>
                {currentUser.nombre} {currentUser.apellido}
            </strong>
            <button className='new-btn' onClick={logout}>Cerrar sesión</button>
            </div>
        ) : (
            <Link to={'/'}>
           < button className='new-btn'>Iniciar sesión</button>
            </Link>
        )}
    </div>
  )
}
