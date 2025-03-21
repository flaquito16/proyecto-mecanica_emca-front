import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Nav } from '../Nav/Nav';

export const Section = () => {
  const [nombre, setNombre] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [formDetails, setFormDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/section`,
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
        setFormDetails(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false)
      }
    };
    fetchSection();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre) {
      setMessage('Llene todos los campos');
      return;
    }

    const formData = new FormData();
    formData.append('nombre_seccion', nombre);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/section`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (response.status === 201) {
        setMessage('Registro exitoso');
        navigate('/section');
      }
      setTimeout(() => {
        window.location.reload();
      }, 10);
    } catch (error) {
      console.error(error);
    }
  };

 const handleClick = () => { 
    setShowModal(true);
  };

const handleClose = () => {
  setShowModal(false);
};

  return (
    <div className='stock'>
        <div className='div-nav'>
          <Nav/>
        </div>
        <div className='div-general'>
          <strong>
            <p className='name-meca'>Sección</p>
          </strong>
          <div className=''>
            <button className='new-btn' onClick={handleClick}>
              Agregar Sección
            </button>
          </div>
          <div className='main-truck'>
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <>
              <table className='details-table'>
                <thead>
                  <tr>Nombre de la sección</tr>
                  <tr>Acciones</tr>
                </thead>
                <tbody>
                  {formDetails.map((formDetails, index) =>(
                    <tr key={index}>
                      <td>{formDetails.nombre_seccion}</td>
                      <td>
                        <button className='new-btn'>Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>   
              </>
            )}
          </div>

          {showModal && (
            <div className='modal-ovrlay'>
                <form onSubmit={handleSubmit}>
              <div className='modal-content'>
                <span className='close'>
                  <p>Secciones</p>
                </span>
                <div className='content-form-truck'>

                  <label>Nombre</label>
                  <input
                    type='text'
                     className='modal-input'
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                  <div className='modal-buttons'>
                  <button className='modal-btn save'>Guardar</button>
                    <button className='modal-btn cancel' type='button' onClick={handleClose}>
                      Cancelar
                    </button>
                  </div>
                <p>{message}</p>
              </div>
                </form>
            </div>
          )}
        </div>
    </div>
  )
}
