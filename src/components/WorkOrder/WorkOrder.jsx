import React, { useEffect, useState } from 'react';
import { Nav } from '../Nav/Nav';
import filtro from '../../assets/filtrar.png';
import { Link } from 'react-router-dom';
import './WorkOrder.css'
import { useNavigate} from 'react-router-dom'
import axios from 'axios';

export const WorkOrder = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
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
  const navigate = useNavigate();
  const [camiones, setCamiones] = useState([]); // Estado para los camiones
  const [operators, setOperators] = useState([]); // Estado para los operarios
  const [message, setMessage] = useState('');
  const [selectedTruckId, setSelectedTruckId] = useState(""); // Guarda el ID del camión
  const [selectedOperarioId, setSelectedOperarioId] = useState(""); // Guarda el ID del operario

  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/operator`) // Ajusta la URL según tu backend
    .then(response => {
      setOperators(response.data);
      if (response.data.length > 0) {
        setFormDetails(prevData => ({ ...prevData, operatorId: response.data[0].id }));
      }
    })
  }, [])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/truck`) // Ajusta la URL según tu backend
    .then(response => {
      setCamiones(response.data);
      if (response.data.length > 0) {
        setFormDetails(prevData => ({ ...prevData, truckId: response.data[0].id }));
      }
    })
    .catch(error => console.error("Error al obtener los camiones:", error));
  }, []);


  useEffect(() => {
    const fetchWorkOrder = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/work-order`, {
          headers: { 'Content-Type': 'application/json' } 
        });
        setFormDetails(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkOrder()
  }, [])


    const handleSubmit = async (e) => {
      e.preventDefault()
      
      if ( !prioridad || !descripcion || !tipoMantenimiento || !fechaInicio || !fechaSolicitud || !responsable || !encargado ) { 
        setMessage('Llene todos los campos')
        return;
      }
      
      const payload = {
        encargado,
        responsable,
        tipoMantenimiento,
        fechaSolicitud: new Date(fechaSolicitud),  // Enviando como objeto Date
        fechaInicio: new Date(fechaInicio),  // Enviando como objeto Date
        prioridad,
        descripcion,
        truckId: parseInt(selectedTruckId),
        operatorId: parseInt(selectedOperarioId), // Asegúrate de que este ID sea el correcto
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/work-order`,
          payload,
          {
            headers: { 'Content-Type': 'application/json' } 
          }
        );
        if (response.status === 201) {
          setMessage('Registro exitoso');
          navigate('/work');

        } else {
          console.error("La respuesta de la API no es un array:", response.data);
          setFormDetails([]); // Evita que el error se propague
        }
        setTimeout(() => {
          window.location.reload();
        }, 10);
        } catch (error) {
        setMessage(error.response?.data?.message || 'Error al registrar');
      }
  
    };

    const handleNewClick = () => {
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
    };

    const filteredForms = Array.isArray(formDetails) 
    ? formDetails.filter(form => form.encargado?.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
  
  return (
    <div className='work'>
        <div className='div-nav'>
          <Nav/>
        </div>
        <div className='div-general'>
        <strong>
          <p className='name-meca'>Orden De Trabajo</p>
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
            <p className='p-num'>55</p>
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
              <th>Maquina</th>
                <th>Persona Asignada</th>
                <th>Prioridad</th>
                <th>Responsable</th>  
                <th>Acciones</th>            
              </tr>
            </thead>
    <tbody>
          {filteredForms?.map((work) => (
        <tr key={work.id_workOrder}> 
        {work.truck ? (  // Verifica que `work.truck` exista
          <td>
          <ul>
            {work.truck.codigo_maquina}
          </ul>
        </td>
        ) : (
          <td>No hay camiones creados.</td>
        )} 
        <td>{work.encargado}</td>
        <td>{work.prioridad}</td>
        <td>{work.responsable}</td>
        <td>
        <Link to={`/detailsWork/${work.id_workOrder}`}>
        <button className='new-btn'>Ver más</button>
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
          <form onSubmit={handleSubmit}>
          <div className='modal-content'>
            <h1>Agregar orden de </h1>
            <div className='content-form-truck'>
            <p className='p-new-truck'>Nombre: </p>
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
          <p className='p-new-truck'>Operario: </p>
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
            <p className='p-new-truck'>Encargado: </p>
            <input type='text' placeholder='Encargado' className='modal-input' value={encargado} onChange={(e) => setEncargado(e.target.value)}/>
            <p className='p-new-truck'>Responsable: </p>
            {/* Se tiene que agregar el apartado que si se elije que es externo
             mostrar los contratos con los que tiene 
            */}
              <select name="" id="" value={responsable} onChange={(e) => setResponsable(e.target.value)}> 
                <option value="">Seleccionar</option>
                <option value="Interno">Interno</option>
                <option value="Externo">Externo</option>
              </select>
            <p className='p-new-truck'>Prioridad: </p>
             <select name="" id="" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
              <option value="">seleccionar</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
             </select>
            <p className='p-new-truck'>Tipo de mantenimiento: </p>
            <select name="" id="" value={tipoMantenimiento} onChange={(e) => setTipoMantenimiento(e.target.value)}>
                <option value="">Seleccionar</option>
                <option value="Preventivo">Preventivo</option>
                <option value="Correctivo">Correctivo</option>
                <option value="Mejora">Mejora</option>
                <option value="Consumible">Consumible</option>
              </select>
              <p className='p-new-truck'>Fecha de solicitud: </p>   
            <input type='date' placeholder='fecha de solicitud' className='modal-input' value={fechaSolicitud} onChange={(e) => setFechaSolicitud(e.target.value)}/>
            <p className='p-new-truck'>Fecha de inicio: </p>   
            <input type="date" placeholder='Fecha de inicio' className='modal-input' value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)}/>
            <p className='p-new-truck'>Descripcion: </p>
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
  )
}