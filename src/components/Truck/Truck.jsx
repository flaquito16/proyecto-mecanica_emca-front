import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import './Truck.css';
import axios from 'axios';
import { Nav } from '../Nav/Nav';
import filtro from '../../assets/filtrar.png';

export const Truck = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [showModal, setShowModal] = useState(false);
  const [showModals, setShowModals] = useState(false);
  const [message, setMessage] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [codigoMaquina, setCodigoMaquina] = useState('');
  const [nombreMaquina, setNombreMaquina] = useState('');
  const [codigoSeccion, setCodigoSeccion] = useState('');
  const [nombreSeccion, setNombreSeccion] = useState('');
  const [marca, setMarca] = useState('');
  const [añoFabricacion, setAñoFabricacion] = useState('');
  const [comprado, setComprado] = useState('');
  const [modelo, setModelo] = useState('');
  const [capacidadProduccion, setCapacidadProduccion] = useState('');
  const [paisOrigen, setPaisOrigen] = useState('');
  const [fabricado, setFabricado] = useState('');
  const [fechaInstalacion, setFechaInstalacion] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [linea, setLinea] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTruck = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/truck`,
          {
            headers: { 'Content-Type': 'application/json' } 
          }
        );
        setFormDetails(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTruck();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!nombreSeccion || !codigoSeccion || !codigoMaquina || !nombreMaquina || !marca || !añoFabricacion || !comprado || !modelo || !capacidadProduccion || !paisOrigen || !fabricado || !fechaInstalacion || !numeroSerie) {
      setMessage('Por favor llenar todos los campos y subir un archivo');
      return;
    }
  
    const formData = new FormData();
    formData.append("codigo_maquina", codigoMaquina);
    formData.append("nombre_maquina", nombreMaquina);
    formData.append("codigo_seccion", codigoSeccion);
    formData.append("nombre_seccion", nombreSeccion);
    formData.append("marca", marca);
    formData.append("linea", linea);
    formData.append("fecha_fabricacion", añoFabricacion);
    formData.append("comprado", comprado);
    formData.append("modelo", modelo);
    formData.append("capacidad_produccion", capacidadProduccion);
    formData.append("pais_origen", paisOrigen);
    formData.append("fabricado", fabricado);
    formData.append("fecha_instalacion", fechaInstalacion);
    formData.append("numero_serie", numeroSerie);
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/truck`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 201) {
        setMessage("Registro exitoso");
        navigate("/truck");
      }
      setTimeout(() => {
        window.location.reload();
      }, 10);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error al registrar");
    }
  };
  const handleNewClick = () => {
    setShowModal(true);
  };

  const handleClick = () => {
    setShowModals(true);
  };

  const handleCloseModals = () => {
    setShowModals(false);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filterTruck = (formDetails || []).filter((form) =>
    form.nombre_maquina.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='truck'>
      <div className='div-nav'>
        <Nav />
      </div>
      <div className='div-general'>
        <strong>
          <p className='name-meca'>Maquina</p>
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
            <p className='p-num'>15</p>
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
            <p>Cargando...</p>
          ) : (
            <>
            
          <table className='details-table'>
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Equipo</th>
                <th>Tareas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filterTruck?.map((formDetail, index) => (
                <tr key={index}>
                  <td>{formDetail.codigo_maquina}</td>
                  <td>{formDetail.nombre_maquina}</td>
                  <td>{formDetail.tareas}</td>
                  <td>
                    <button className='new-btn' onClick={handleClick}>Ver mas</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </>
          )}
        </div>
        
      </div>

      {showModal && (
        <div className='modal-overlay'>
          <form action="" onSubmit={handleSubmit}>
          <div className='modal-content'>
            <h1>Agregar Nueva Maquina</h1>
              <h3>Maquina</h3>
            <div className='content-form-truck'>
            <p className='p-new-truck'>Codigo: </p>
            <input type='text' placeholder='Nombre del equipo' className='modal-input' value={codigoMaquina} onChange={(e) => setCodigoMaquina(e.target.value)}/>
            <p className='p-new-truck'>Nombre: </p>
            <input type='text' placeholder='Descripción' className='modal-input' value={nombreMaquina} onChange={(e) => setNombreMaquina(e.target.value)}/>
            </div>
              <h3>Seccion</h3>
            <div className='content-form-truck'>
            <p className='p-new-truck'>Codigo: </p>
            <input type='text' placeholder='Nombre del equipo' className='modal-input' value={codigoSeccion} onChange={(e) => setCodigoSeccion(e.target.value)}/>
            <p className='p-new-truck'>Nombre de la seccion: </p>
            <input type='text' placeholder='Descripción' className='modal-input' value={nombreSeccion} onChange={(e) => setNombreSeccion(e.target.value)}/>
            </div>
              <h3>Descripcion de la maquina</h3>
            <div className='content-form-truck'>
            <p className='p-new-truck'>Marca: </p>
            <input type='text' placeholder='Nombre del equipo' className='modal-input' value={marca} onChange={(e) => setMarca(e.target.value)}/>
            <p className='p-new-truck'>Linea: </p>
            <input type='text' placeholder='Nombre del equipo' className='modal-input' value={linea} onChange={(e) => setLinea(e.target.value)}/>
            <p className='p-new-truck'>Año de fabricacion: </p>
            <input type='text' placeholder='Descripción' className='modal-input' value={añoFabricacion} onChange={(e) => setAñoFabricacion(e.target.value)}/>
            <p className='p-new-truck'>Comprado a: </p>
            <input type='text' placeholder='Descripción' className='modal-input' value={comprado} onChange={(e) => setComprado(e.target.value)}/>
            <p className='p-new-truck'>Modelo: </p>
            <input type='text' placeholder='Nombre del equipo' className='modal-input' value={modelo} onChange={(e) => setModelo(e.target.value)}/>
            <p className='p-new-truck'>Capacidad de produccion: </p>
            <input type='text' placeholder='Nombre del equipo' className='modal-input' value={capacidadProduccion} onChange={(e) => setCapacidadProduccion(e.target.value)}/>
            <p className='p-new-truck'>Pais de origen: </p>
            <input type='text' placeholder='Nombre del equipo' className='modal-input' value={paisOrigen} onChange={(e) => setPaisOrigen(e.target.value)}/>
            <p className='p-new-truck'>Fabricado por: </p>
            <input type='text' placeholder='Nombre del equipo' className='modal-input' value={fabricado} onChange={(e) => setFabricado(e.target.value)}/>
            <p className='p-new-truck'>Fecha de instalacion: </p>
            <input type='text' placeholder='Nombre del equipo' className='modal-input' value={fechaInstalacion} onChange={(e) => setFechaInstalacion(e.target.value)}/>
            <p className='p-new-truck'>N° de serie: </p>
            <input type='text' placeholder='Nombre del equipo' className='modal-input' value={numeroSerie} onChange={(e) => setNumeroSerie(e.target.value)}/>
            </div>
            <div className='modal-buttons'>
              <button className='modal-btn save' type='submit'>Guardar</button>
              <button className='modal-btn cancel' onClick={handleCloseModal}>Cancelar</button>
            </div>
          </div>
          {message && <p className="message">{message}</p>}
          </form>
        </div>
      )}

{showModals && formDetails && (
  <div className="modal-new-historial">
    <div className="modal-content-historial">
      <div className="content-form-truck">
        <p className="p-new-truck">Código Máquina:</p>
        <p>{formDetails?.codigo_maquina}</p>

        <p className="p-new-truck">Nombre Máquina:</p>
        <p>{formDetails.nombre_maquina}</p>

        <p className="p-new-truck">Código Sección:</p>
        <p>{formDetails.codigo_seccion}</p>

        <p className="p-new-truck">Nombre Sección:</p>
        <p>{formDetails.nombre_seccion}</p>

        <p className="p-new-truck">Marca:</p>
        <p>{formDetails.marca}</p>

        <p className="p-new-truck">Año de fabricación:</p>
        <p>{formDetails.fecha_fabricacion}</p>

        <p className="p-new-truck">Comprado a:</p>
        <p>{formDetails.comprado}</p>

        <p className="p-new-truck">Modelo:</p>
        <p>{formDetails.modelo}</p>

        <p className="p-new-truck">Capacidad de producción:</p>
        <p>{formDetails.capacidad_produccion}</p>

        <p className="p-new-truck">País de origen:</p>
        <p>{formDetails.pais_origen}</p>

        <p className="p-new-truck">Fabricado por:</p>
        <p>{formDetails.fabricado}</p>

        <p className="p-new-truck">Fecha de instalación:</p>
        <p>{formDetails.fecha_instalacion}</p>

        <p className="p-new-truck">N° de serie:</p>
        <p>{formDetails.numero_serie}</p>
      </div>
      <div className="modal-buttons">
        <button className="modal-btn save" type="submit">
          Editar
        </button>
        <button className="modal-btn cancel" onClick={handleCloseModals}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};
