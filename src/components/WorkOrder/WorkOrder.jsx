import React, { useEffect, useState } from 'react';
import { Nav } from '../Nav/Nav';
import filtro from '../../assets/filtrar.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WorkOrder.css';
import { useFromContext } from '../../Context/FromContext';
import { User } from '../User/User';

export const WorkOrder = () => {
  const {currentUser} = useFromContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formDetails, setFormDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [encargado, setEncargado] = useState('');
  const [responsable, setResponsable] = useState('');
  const [tipoMantenimiento, setTipoMantenimiento] = useState('');
  const [fechaSolicitud, setFechaSolicitud] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [camiones, setCamiones] = useState([]);
  const [operators, setOperators] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedTruckId, setSelectedTruckId] = useState('');
  const [selectedOperarioId, setSelectedOperarioId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/operator`)
      .then(response => {
        setOperators(response.data);
      }).catch(error => console.error('Error al obtener operarios:', error));
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/truck`)
      .then(response => {
        setCamiones(response.data);
      }).catch(error => console.error('Error al obtener camiones:', error));
  }, []);

  const handleNewClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchWorkOrder = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/work-order`);
        if (response.status === 200) {
          setFormDetails(response.data);
        }
      } catch (error) {
        console.error('Error al obtener órdenes de trabajo:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkOrder();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prioridad || !descripcion || !tipoMantenimiento || !fechaInicio || !fechaSolicitud || !responsable || !encargado || !selectedTruckId || !selectedOperarioId) {
      setMessage('Llene todos los campos');
      return;
    }

    const payload = {
      encargado,
      responsable,
      tipoMantenimiento,
      fechaSolicitud: new Date(fechaSolicitud),
      fechaInicio: new Date(fechaInicio),
      prioridad,
      descripcion,
      truckId: parseInt(selectedTruckId),
      operatorId: parseInt(selectedOperarioId),
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/work-order`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        setMessage('Registro exitoso');
        navigate('/work');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error al registrar');
    } finally {
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const filteredForms = Array.isArray(formDetails)
    ? formDetails.filter(form => form.encargado?.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className='work'>
      <div className='div-nav'>
        <Nav />
      </div>
      <div className='div-general'>
        <strong><p className='name-meca'>Orden De Trabajo</p></strong>

        <div className='filter-truck'>
          <div className='div-search'>
            <img className='filter-img' src={filtro} alt='filtrar' />
            <select className='select-filter'>
              <option value=''>Seleccionar</option>
              <option value='Todo'>Todo</option>
              <option value='Activo'>Activo</option>
              <option value='Inactivo'>Inactivo</option>
              <option value='Pendiente'>Pendiente</option>
              <option value='Orden_trabajo'>Orden de trabajo</option>
              <option value='Eliminado'>Eliminado</option>
            </select>
            <strong><p className='p-num'>{formDetails.length}</p></strong>
          </div>

          <div className='div-search'>
            <div className='search-box'>
              🔍
              <input
                type='text'
                className='search-input'
                placeholder='Buscar...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {currentUser && (
              <>
              <button className='new-btn' onClick={handleNewClick}>Nuevo</button>
              </>
            )}
          </div>
        </div>
            <User></User>
        <div className='main-truck'>
          {loading ? <p>Cargando...</p> : (
            <table className='details-table'>
              <thead>
                <tr>
                  <th>Máquina</th>
                  <th>Persona Asignada</th>
                  <th>Prioridad</th>
                  <th>Responsable</th>
                  {currentUser && (
                    <>
                  <th>Acciones</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredForms.map(work => (
                  <tr key={work.id_workOrder}>
                    <td>{work.truck?.codigo_maquina || 'No asignado'}</td>
                    <td>{work.encargado}</td>
                    <td>{work.prioridad}</td>
                    <td>{work.responsable}</td>
                    {currentUser && (
                      <>
                    <td>
                      <Link to={`/detailsWork/${work.id_workOrder}`}>
                        <button className='new-btn'>Ver más</button>
                      </Link>
                    </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className='modal-overlay2'>
          <form onSubmit={handleSubmit}>
          <div className='modal-content3'>
            <h1>Agregar orden de </h1>
            <div className='content-form-truck2'>
            <p className='p-new-truck2'>Nombre: </p>
            <select name="truckId" value={selectedTruckId}  onChange={(e) => setSelectedTruckId(e.target.value)}>
            <option value="">Seleccionar</option>
    {camiones.length === 0 ? (
        <option value="">No hay camiones disponibles</option>
    ) : (
        camiones.map(camion => (
            <option key={camion.id_truck} value={camion.id_truck}>
                {camion.codigo_maquina} {/* Muestra el nombre del camión */}
            </option>
        ))
    )}
        </select>
          <p className='p-new-truck2'>Operario: </p>
            <select name="operarioId" value={selectedOperarioId} onChange={(e) => setSelectedOperarioId(e.target.value)}>
            <option value="">Seleccionar</option>
            {operators.length === 0 ? (
                <option value="">No hay operarios disponibles</option>
            ) : (
                operators.map(operario => (
                    <option key={operario.id_operator} value={operario.id_operator}>
                        {operario.nombreO} {/* Muestra el nombre del operario */}
                    </option>
                ))
            )}
            </select>
            <p className='p-new-truck2'>Encargado: </p>
            <input type='text' placeholder='Encargado' className='modal-input' value={encargado} onChange={(e) => setEncargado(e.target.value)}/>
            <p className='p-new-truc2k'>Responsable: </p>
            {/* Se tiene que agregar el apartado que si se elije que es externo
             mostrar los contratos con los que tiene 
            */}
              <select name="" id="" value={responsable} onChange={(e) => setResponsable(e.target.value)}> 
                <option value="">Seleccionar</option>
                <option value="Interno">Interno</option>
                <option value="Externo">Externo</option>
              </select>
            <p className='p-new-truck2'>Prioridad: </p>
             <select name="" id="" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
              <option value="">seleccionar</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
             </select>
            <p className='p-new-truck2'>Tipo de mantenimiento: </p>
            <select name="" id="" value={tipoMantenimiento} onChange={(e) => setTipoMantenimiento(e.target.value)}>
                <option value="">Seleccionar</option>
                <option value="Preventivo">Preventivo</option>
                <option value="Correctivo">Correctivo</option>
                <option value="Mejora">Mejora</option>
                <option value="Consumible">Consumible</option>
              </select>
              <p className='p-new-truck2'>Fecha de solicitud: </p>   
            <input type='date' placeholder='fecha de solicitud' className='modal-input' value={fechaSolicitud} onChange={(e) => setFechaSolicitud(e.target.value)}/>
            <p className='p-new-truck2'>Fecha de inicio: </p>   
            <input type="date" placeholder='Fecha de inicio' className='modal-input' value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)}/>
            <p className='p-new-truck2'>Descripcion: </p>
            <textarea name="" id="" placeholder='Descripcion' value={descripcion} onChange={(e) => setDescripcion(e.target.value)}/>
            </div>
            <div className='modal-buttons'>
              <button className='modal-btn save' >Guardar</button>
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
