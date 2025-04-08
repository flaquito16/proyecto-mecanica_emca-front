import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom';
import './Truck.css';
import axios from 'axios';
import { Nav } from '../Nav/Nav';
import filtro from '../../assets/filtrar.png';
//tenga en cuenta que algunas clases las llamo igual en algunos componentes ya que, como ya tienen diseño solo pongo el nombre del classname
//reciclado para que ya se le de el diseño ya establecido
export const Truck = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [codigoMaquina, setCodigoMaquina] = useState('');
  const [nombreMaquina, setNombreMaquina] = useState('');
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
        if (response.status === 200) {
          setFormDetails(response.data);
          console.log(response.data);  
        }
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
  
    if (!codigoMaquina || !nombreMaquina || !marca || !añoFabricacion || !comprado || !modelo || !capacidadProduccion || !paisOrigen || !fabricado || !fechaInstalacion || !numeroSerie) {
      setMessage('Por favor llenar todos los campos y subir un archivo');
      return;
    }
  
    const formData = new FormData();
    formData.append("codigo_maquina", codigoMaquina);
    formData.append("nombre_maquina", nombreMaquina);
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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filterTruck = (formDetails || []).filter((form) =>
    form.codigo_maquina.toLowerCase().includes(searchTerm.toLowerCase())
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
                <th>Sección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filterTruck?.map((truck) => (
                <tr key={truck.id_truck}>
                  <td>{truck.codigo_maquina}</td>
                  <td>{truck.nombre_maquina}</td>
                    {truck.sections && truck.sections.length > 0 ? (
                      <td>
                        {truck.sections.map((section) => (
                          <ul key={section.id_section}>
                             {section.nombre}
                          </ul>
                        ))}
                      </td>
                    ) : (
                      <td>
                        <p>No hay secciones asignadas.</p>
                      </td>
                    )}
                  <td>
                    <Link to={`/details/${truck.id_truck}`}>
                    <button className='new-btn'>Ver mas</button>
                    </Link>
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
            <input type='text' placeholder='Codigo de la maquina' className='modal-input' value={codigoMaquina} onChange={(e) => setCodigoMaquina(e.target.value)}/>
            <p className='p-new-truck'>Nombre: </p>
            <input type='text' placeholder='Nombre de la maquina' className='modal-input' value={nombreMaquina} onChange={(e) => setNombreMaquina(e.target.value)}/>
            </div>
              <h3>Descripcion de la maquina</h3>
            <div className='content-form-truck'>
            <p className='p-new-truck'>Marca: </p>
            <input type='text' placeholder='Marca de la maquina' className='modal-input' value={marca} onChange={(e) => setMarca(e.target.value)}/>
            <p className='p-new-truck'>Linea: </p>
            <input type='text' placeholder='Linea de la maquina' className='modal-input' value={linea} onChange={(e) => setLinea(e.target.value)}/>
            <p className='p-new-truck'>Año de fabricacion: </p>
            <input type='text' placeholder='Año de fabricación' className='modal-input' value={añoFabricacion} onChange={(e) => setAñoFabricacion(e.target.value)}/>
            <p className='p-new-truck'>Comprado a: </p>
            <input type='text' placeholder='A quien se le compro' className='modal-input' value={comprado} onChange={(e) => setComprado(e.target.value)}/>
            <p className='p-new-truck'>Modelo: </p>
            <input type='text' placeholder='Modelo de la maquina' className='modal-input' value={modelo} onChange={(e) => setModelo(e.target.value)}/>
            <p className='p-new-truck'>Capacidad de produccion: </p>
            <input type='text' placeholder='Capacidad de la maquina' className='modal-input' value={capacidadProduccion} onChange={(e) => setCapacidadProduccion(e.target.value)}/>
            <p className='p-new-truck'>Pais de origen: </p>
            <input type='text' placeholder='Pais de origen' className='modal-input' value={paisOrigen} onChange={(e) => setPaisOrigen(e.target.value)}/>
            <p className='p-new-truck'>Fabricado por: </p>
            <input type='text' placeholder='Fabricado por' className='modal-input' value={fabricado} onChange={(e) => setFabricado(e.target.value)}/>
            <p className='p-new-truck'>Fecha de instalacion: </p>
            <input type='date' placeholder='Fecha de instalacion' className='modal-input' value={fechaInstalacion} onChange={(e) => setFechaInstalacion(e.target.value)}/>
            <p className='p-new-truck'>N° de serie: </p>
            <input type='text' placeholder='Numero de serie' className='modal-input' value={numeroSerie} onChange={(e) => setNumeroSerie(e.target.value)}/>
            </div>
            <div className='modal-buttons'>
              <button className='modal-btn save' type='submit'>Guardar</button>
              <button className='modal-btn cancel' onClick={handleCloseModal}>Cancelar</button>
            </div>
          {message && <p className="message">{message}</p>}
          </div>
          </form>
        </div>
      )}
    </div>
  );
};
