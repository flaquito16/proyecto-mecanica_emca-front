import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Nav } from '../Nav/Nav';
import { useNavigate } from 'react-router-dom';

export const Operator = () => {
    const [nombre, setNombre] = useState('')
    const [message, setMessage] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [formDeatils, setFormDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchOperator = async () => {
             try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/operator`,
                    {
                      headers: { 'Content-Type': 'application/json' } 
                    })
                if (response.status === 200) {
                    console.log(response.data);  
                    setFormDetails(response.data)
                }     
             } catch (error) {
                console.error(error);           
              } finally {
                setLoading(false)
             }
        }
        fetchOperator();
    }, [])

    
    const handleCLick = () => {
        setShowModal(true)
    }

    const handleClose = () => {
        setShowModal(false)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre) {
        console.log("llena todos los campos");
        };
    
    
        const formData = new FormData();
        formData.append('nombre', nombre)

    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/operator`, 
            formData,
            {
                headers: { 'Content-Type': 'application/json' } 
              }
        )
        if (response.status === 201) {
            console.log("se creo correctamente");  
            setMessage('Registro exitoso')
            navigate('/operator')
        }
        setTimeout(() => {
            window.location.reload();
          }, 10);
    } catch (error) {
        setMessage(error.response?.data?.message || "Error al registrar");
    }
 };

  return (
    <div className='truck'>
        <div className='div-nav'>
            <Nav/>
        </div>
        <div className='div-general'>
        <strong>
        <p className='name-meca'>Operadores</p>
        </strong>
        <div className='filter-truck'>
      <strong>
        <p className='p-num'>8</p>
      </strong>
      <div className='div-search'>
        <button className='new-btn' onClick={handleCLick}>Nuevo</button>
      </div>
    </div> 
    <div className='main-truck'>
      {loading ? ( 
      <p>Cargando...</p> ) : (
        <>
      <table className='details-table'>
        <thead>
          <tr>
            <th>Nombre de los operadores</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
     {formDeatils?.map((opera) => (
         <tr key={opera.id_operator}>
        <td>{opera.nombre}</td>
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
        <h1>Agregar Un Nuevo Operario</h1>
          <h3>Detalles</h3>
        <div className='content-form-truck'>
        <p className='p-new-truck'>Nombre del operario: </p>
        <input type='text' placeholder='Nombre del operario' className='modal-input' value={nombre} onChange={(e) => setNombre(e.target.value)}/>
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
