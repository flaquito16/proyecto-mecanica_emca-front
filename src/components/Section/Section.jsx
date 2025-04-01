import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Nav } from '../Nav/Nav';

export const Section = () => {
  const [nombre, setNombre] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [formDetails, setFormDetails] = useState([]);
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
        console.log("Datos recibidos:", response.data); // Verifica si los datos están llegando

        if (response.status === 200) {   
          setFormDetails(response.data);
          console.log(response.data);
        }
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




//reciclo mucho los classname para dar el mismo diseño 
  return (
    <div className='stock'>
    <div className='div-nav'>
        <Nav/>
    </div>
    <div className='div-general'>
        <strong>
        <p className='name-meca'>Secciones</p>
        </strong>
        <div className='filter-truck'>
      <strong>
        <p className='p-num'>8</p>
      </strong>
      <div className='div-search'>
        <button className='new-btn' onClick={handleClick}>Nuevo</button>
      </div>
    </div> 
    <div className='main-truck'>
      {loading ? ( 
      <p>Cargando...</p> ) : (
        <>
      <table className='details-table'>
        <thead>
          <tr>
            <th>Nombre de sección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
  {formDetails?.map((from) => (
    <tr key={from.id_section}>
<td>{from.nombre_seccion}</td>
<td>
        <button className='new-btn'>Ver más</button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
        </>
        )
       }
    </div>
    </div>
    
  {showModal && (
    <div className='modal-overlay'>
      <form action="" onSubmit={handleSubmit}>
      <div className='modal-content'>
        <h1>Agregar Una Nueva Sección</h1>
          <h3>Detalles</h3>
        <div className='content-form-truck'>
        <p className='p-new-truck'>Nombre de la sección: </p>
        <input type='text' placeholder='Nombre del equipo' className='modal-input' value={nombre} onChange={(e) => setNombre(e.target.value)}/>
        </div>
        <div className='modal-buttons'>
          <button className='modal-btn save'>Guardar</button>
          <button className='modal-btn cancel' onClick={handleClose}>Cancelar</button>
        </div>
      </div>
    <p>{message}</p> 
      </form>
    </div>
  )}
</div>
  )
}
