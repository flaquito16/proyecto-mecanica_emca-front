import React, {  useEffect, useState } from 'react'
import { Nav } from '../Nav/Nav'
import filtro from '../../assets/filtrar.png';
import './Stock.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Stock = () => {
      const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
      const [formDetails, setFormDetails] = useState([]);
      const [showModal, setShowModal] = useState(false);
      const [message, setMessage] = useState('');
      const [nombre, setNombre] = useState('');
      const [cantidad, setCantidad] = useState('');
      const [precio, setPrecio] = useState(''); 
      const [loading, setLoading] = useState(true);
      const navigate = useNavigate();

    useEffect(() => {
        const fetchStock = async () => {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/stock`,
              {
                headers: { 'Content-Type': 'application/json' } 
              }
            );
            if (response.status === 200) {
              setFormDetails(Array.isArray(response.data) ? response.data : []);
              console.log(response.data); 
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };
        fetchStock();
      }, []);

      const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!nombre || !cantidad || !precio) { 
          setMessage('Llene todos los campos')
          return;
        }
        
        const payload = {
          nombre,
          cantidad,
          precio
        }
  
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/stock`,
            payload,
            {
              headers: { 'Content-Type': 'application/json' } 
            }
          );
          if (response.status === 201) {
            setMessage('Registro exitoso');
            navigate('/stock');
  
          }
          setTimeout(() => {
            window.location.reload();
          }, 10);
          } catch (error) {
          setMessage(error.response?.data?.message || 'Error al registrar');
        }
      }

      const handleNewClick = () => {
        setShowModal(true);
      };
    
      const handleCloseModal = () => {
        setShowModal(false);
      };

      const filteredForms = (formDetails || []).filter(form => 
        form.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

  return (
    <div className='stock'>
        <div className='div-nav'>
            <Nav/>
        </div>
        <div className='div-general'>
            <strong>
            <p className='name-meca'>Inventario</p>
            </strong>
            <div className='filter-truck'>
          <img className='filter-img' src={filtro} alt='' />
          <select className='select-filter'>
            <option value=''>Seleccionar</option>
            <option value='Todo'>Todo</option>
            <option value='Activo'>Activo</option>
            <option value='Inactivo'>Inactivo</option>
            <option value='Pendiente'>Pendiente</option>
            <option value='Orden_trabajo'>Orden de trabajo</option>
            <option value='Eliminado'>Eliminado</option>
          </select>
          <strong>
            <p className='p-num'>8</p>
          </strong>
          <div className='div-search'>
            <div className='search-box'>
              🔍
              <input type='text' className='search-input' placeholder='Buscar...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
            </div>
            <button className='new-btn' onClick={handleNewClick}>Nuevo</button>
          </div>
        </div> 
        <div className='main-truck'>
          {loading ? ( 
          <p>Cargando...</p> ) : (
            <>

          <table className='details-table'>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Costo</th>
                <th>Acciones</th>
              </tr>
            </thead>
       <tbody>
              {filteredForms?.map((formDetail, index) => (
                <tr key={index}>
                  <td>{formDetail.nombre}</td>
                  <td>{formDetail.cantidad}</td>
                  <td>${formDetail.precio}</td>
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
            <h1>Agregar Un Nuevo Producto</h1>
              <h3>Detalles</h3>
            <div className='content-form-truck'>
            <p className='p-new-truck'>Nombre: </p>
            <input type='text' placeholder='Nombre del producto' className='modal-input' value={nombre} onChange={(e) => setNombre(e.target.value)}/>
            <p className='p-new-truck'>Cantidad: </p>
            <input type='text' placeholder='Cantidad del producto' className='modal-input' value={cantidad} onChange={(e) => setCantidad(e.target.value)}/>
            <p className='p-new-truck'>Costo: </p>
            <input type='text' placeholder='Costo del producto' className='modal-input' value={precio} onChange={(e) => setPrecio(e.target.value)}/>
            </div>
            <div className='modal-buttons'>
              <button className='modal-btn save'>Guardar</button>
              <button className='modal-btn cancel' onClick={handleCloseModal}>Cancelar</button>
            </div>
          </div>
        <p>{message}</p> 
          </form>
        </div>
      )}
    </div>
  )
}
