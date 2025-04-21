import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Nav } from '../Nav/Nav';
import { useFromContext } from '../../Context/FromContext';
import { User } from '../User/User';


export const Section = () => {
  const {currentUser} = useFromContext();
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [formDetails, setFormDetails] = useState([]);
  const [camiones, setCamiones] = useState([]);
  const [selectedTruckId, setSelectedTruckId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/truck`)
      .then((response) => {
        setCamiones(response.data);
        if (response.data.length > 0) {
          setSelectedTruckId(response.data[0].id_section);
        }        
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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

    const payload = {
      nombre,
      codigo, 
      truckId: parseInt(selectedTruckId),
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/section`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (response.status === 201) {
        setMessage('Registro exitoso');
        navigate('/section');
      } else {
        console.error("La respuesta de la API no es un array:", response.data);
        setFormDetails([]); // Evita que el error se propague
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
        <p className='p-num'>{formDetails.length}</p>
      </strong>
      {currentUser && (
        <>
      <div className='div-search'>
        <button className='new-btn' onClick={handleClick}>Nuevo</button>
      </div>
        </>
      )}
      <User></User>
    </div> 
    <div className='main-truck'>
      {loading ? ( 
      <p>Cargando...</p> ) : (
        <>
      <table className='details-table'>
        <thead>
          <tr>
            <th>Codigo sección</th>
            <th>Nombre de sección</th>
            {currentUser && (
              <>
            <th>Acciones</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
        {Array.isArray(formDetails) && formDetails.map((from) => (
  <tr key={from.id_section}>
    <td>{from.codigo}</td>
    <td>{from.nombre}</td>
          {currentUser && (
            <>
    <td>
      <button className='new-btn'>Ver más</button>
    </td>
            </>
                    )}
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
    <div className='modal-overlay2'>
      <form action="" onSubmit={handleSubmit}>
      <div className='modal-content3'>
        <h1>Agregar Una Nueva Sección</h1>
          <h3>Detalles</h3>
        <div className='content-form-truck2'>
        <p className='p-new-truck2'>Nombre de la sección: </p>
        <input type='text' placeholder='Nombre de la seccion' className='modal-input' value={nombre} onChange={(e) => setNombre(e.target.value)}/>
        </div>
        <div className='content-form-truck2'>
        <p className='p-new-truck2'>Codigo de la sección: </p>
        <input type='text' placeholder='Codigo de la seccion' className='modal-input' value={codigo} onChange={(e) => setCodigo(e.target.value)}/>
        </div>
        <div className='content-form-truck2'>
        <p className='p-new-truck2'>Camion: </p>
        <select name="truckId" id="" value={selectedTruckId} onChange={(e) => setSelectedTruckId(e.target.value)}>
          <option value="">Seleccionar</option>
          {camiones.length === 0 ? (
        <option value="">No hay camiones disponibles</option>
      ) : (
            camiones.map(camion => (
              <option key={camion.id_truck} value={camion.id_truck}>
                {camion.codigo_maquina}
              </option>
            ))
        )}
        </select>
        </div>
        <div className='modal-buttons'>
          <button className='modal-btn save'>Guardar</button>
          <button className='modal-btn cancel' onClick={handleClose}>Cancelar</button>
        </div>
    <p>{message}</p> 
      </div>
      </form>
    </div>
  )}
</div>
  )
}