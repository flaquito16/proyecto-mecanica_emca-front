import React, { useEffect, useState } from 'react'
import './Details.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { Nav } from '../Nav/Nav';

export const Details = () => {
    const {id} = useParams();
    const [details, setDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModals, setShowModals] = useState(false);
    const [edite, setEdite] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/truck/${id}`);
                if (response.status === 200) {
                    console.log('Obtener los detalles del camión');
                    if (response.data) {
                        setDetails(Array.isArray(response.data) ? response.data : [response.data]);
                    } else {
                        setDetails([]);
                    }
                                    };
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();

    }, [id]);

    const handleClickEdite = () => {
        if (details && details[0]) {
            setEdite(details[0])
            setShowModals(true)
        };
    };

    const handleCloseEdite = () => {
        setShowModals(false)
    }

    const handleClickDelete = () => {
        setShowModal(true);
    }

    const handleCancel = () => {
        setShowModal(false);
    }

    const handleInputSave = (e) => {
        const { name, value } = e.target;
        setEdite((prevDetails) => ({ 
            ...prevDetails, 
            [name]: value || '' // Asegura que no haya valores undefined
        }));
    }

    const handleSave = async () => {
        console.log("Datos a enviar: ", edite);
        
        const { id_truck, workOrders, truck, deletedAt, ...filterEdite } = edite;

        
        console.log("Datos filtrados a enviar: ", filterEdite);
        
        try {
          const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/truck/${id}`, 
                filterEdite, // Enviar solo los datos permitidos
                { headers: { 'Content-Type': 'application/json' } 
            });

            if (response.status === 200) {
                setDetails((prevDetails) => 
                    prevDetails.map((detail) => (detail.id_truck === id_truck ? {...detail, ...filterEdite} : detail))
                );                
                setShowModals(false)
            };
            setTimeout(() => {
                window.location.reload();
              }, 10);
        } catch (error) {
            console.error("Error al guardar los cambios:", error.response?.data || error.message);
            alert("Error al guardar los cambios: " + (error.response?.data?.message || error.message));

        }
    }

    const handleDelete = async () => { 
        try {
        const response =  await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/truck/${id}`);
            if (response.status === 200) {
                setShowModal(false);
                navigate('/truck');
            }
        } catch (error) {
            console.error(error);
    };
    }

  return (
     <div className='details'>
        <div className='div-nav'>
            <Nav/>
        </div>
        <div className='div-general'>
            <strong>
                <p className='title-details'>
                    Historial del camión
                </p>
            </strong>
            {details && Array.isArray(details) ? (
    details.map((detail) => (
        <div className='details-general' key={detail.id_truck}>
            <p>
                <strong>Codigo máquina: </strong> {detail.codigo_maquina}
            </p>
            <p>
                <strong>Nombre máquina: </strong> {detail.nombre_maquina}
            </p>
            <p>
                <strong>Codigo sección: </strong> {detail.codigo_seccion}
            </p>
            <p>
                <strong>Nombre sección: </strong> {detail.nombre_seccion}
            </p>
            <p>
                <strong>Marca: </strong> {detail.marca}
            </p>
            <p>
                <strong>Linea: </strong> {detail.linea}
            </p>
            <p>
                <strong>Fecha de fabricación: </strong> {detail.fecha_fabricacion}
            </p>
            <p>
                <strong>Comprado: </strong> {detail.comprado}
            </p>
            <p>
                <strong>Modelo: </strong> {detail.modelo}
            </p>
            <p>
                <strong>Capacidad de producción: </strong> {detail.capacidad_produccion}
            </p>
            <p>
                <strong>Pais de origen: </strong> {detail.pais_origen}
            </p>
            <p>
                <strong>Fabricado: </strong> {detail.fabricado}
            </p>
            <p>
                <strong>Fecha de instalación: </strong> {detail.fecha_instalacion}
            </p>
            <p>
                <strong>Numero de serie: </strong> {detail.numero_serie}
            </p>

            <p><strong>Historial de órdenes de trabajo:</strong></p>
            {detail.workOrders && detail.workOrders.length > 0 ? (
                <ul>
                    {detail.workOrders.map((order) => (
                        <li key={order.id_workOrder}>
                            {order.descripcion} - {order.fechaInicio}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay órdenes de trabajo registradas.</p>
            )}

            <div className='div-buttons'>
                <button className='new-btn' onClick={handleClickEdite}>Editar</button>
                <button className='delete-btn' onClick={handleClickDelete}>Eliminar</button>
            </div>
        </div>
    ))
        ) : (
    <p>Cargando detalles...</p>
        )}  
        </div>
        
            {showModal && (
                <div className='modal-overlay-details'>
                    <div className='model-content-details'>
                        <div className='content-form-truck'>
                            <div className='modal-header'>
                        <p className='p-alert'>¿Estás seguro de que quieres eliminar este camión?</p>
                        <div className='modal-buttons'>
                            <button className='delete-btn' onClick={handleDelete}>Eliminar</button>
                            <button className='modal-btn cancel' onClick={handleCancel}>Cancelar</button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            )}

                            {/* Modal de edición */}
                            {showModals && (
                    <div className='modal-overlay-details'>
                        <div className='model-content-details'>
                            <div className='content-form-truck'>
                                <div className='modal-header'>
                                    <p className='p-alert'>Editar Camión</p>
                                </div>
                                <div className='modal-body'>
                                    <div className='form-group'>
                                        <label>Codigo máquina: </label>
                                        <input 
                                            type="text" 
                                            name="codigo_maquina" 
                                            value={edite.codigo_maquina || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Nombre máquina: </label>
                                        <input 
                                            type="text" 
                                            name="nombre_maquina" 
                                            value={edite.nombre_maquina || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Codigo sección: </label>
                                        <input 
                                            type="text" 
                                            name="codigo_seccion" 
                                            value={edite.codigo_seccion || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Nombre sección: </label>
                                        <input 
                                            type="text" 
                                            name="nombre_sección:" 
                                            value={edite.nombre_seccion || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Marca: </label>
                                        <input 
                                            type="text" 
                                            name="marca" 
                                            value={edite.marca || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Linea:</label>
                                        <input 
                                            type="text" 
                                            name="linea" 
                                            value={edite.linea || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Fecha de fabricación: </label>
                                        <input
                                            name="fecha_fabricacion" 
                                            value={edite.fecha_fabricacion || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Comprado: </label>
                                        <input 
                                            type="text" 
                                            name="comprado" 
                                            value={edite.comprado || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Modelo: </label>
                                        <input 
                                            type="text" 
                                            name="modelo" 
                                            value={edite.modelo || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Capacidad de producción: </label>
                                        <input 
                                            type="text" 
                                            name="capacidad_produccion" 
                                            value={edite.capacidad_produccion || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Pais de origen: </label>
                                        <input 
                                            type="text" 
                                            name="pais_origen" 
                                            value={edite.pais_origen || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Fabricado: </label>
                                        <input 
                                            type="text" 
                                            name="fabricado" 
                                            value={edite.fabricado || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Fecha de instalación: </label>
                                        <input 
                                            type="date" 
                                            name="fecha_instalacion" 
                                            value={edite.fecha_instalacion || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Numero de serie: </label>
                                        <input 
                                            type="text" 
                                            name="numero_serie" 
                                            value={edite.numero_serie || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                </div>
                                <div className='modal-buttons'>
                                    <button className='new-btn' onClick={handleSave}>Guardar</button>
                                    <button className='modal-btn cancel' onClick={handleCloseEdite}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
    </div>
  )
}
