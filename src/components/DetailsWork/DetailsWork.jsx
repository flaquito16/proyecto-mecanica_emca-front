import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Nav } from '../Nav/Nav';
import { asCleanDays } from '@fullcalendar/core/internal';

export const DetailsWork = () => {
    const { id } = useParams();
    const [formDetails, setFormDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModals, setShowModals] = useState(false);
    const [stock, setStock] = useState([]);
    const [edite, setEdite] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/work-order/${id}`);
                if (response.status === 200) {
                    console.log('Obtener los detalles de la orden de trabajo');
                    setFormDetails(Array.isArray(response.data) ? response.data : [response.data]);                    
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fechtStock = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/stock`)
                if (response === 200) {
                    console.log('se obtuvieron todos los datos del stock');
                    setStock(response.data ? response.data : [response.data])
                }
            } catch (error) {
                console.error(error);
            }
        } ;
        fechtStock()
    }, [])

    // Abrir modal de edición y precargar datos
    const handleCLick = () => {
        if(formDetails && formDetails[0]){
            setEdite(formDetails[0]); // precargar el primer registro
            setShowModal(true);
        }
    };

    const handleCLose = () => {
        setShowModal(false);
    };

    // Abrir modal de eliminación
    const handleCLicks = () => {
        setShowModals(true);
    };

    const handleCLoses = () => {
        setShowModals(false);
    };

    // Actualizar el estado de edite conforme el usuario cambia los inputs
    const handleInputSave = (e) => {
        const { name, value } = e.target;
        setEdite((prevDetails) => ({ 
            ...prevDetails, 
            [name]: value || '' // Asegura que no haya valores undefined
        }));
    };
    
    // Enviar cambios al backend
    const handleSave = async () => {
        console.log("Datos a enviar:", edite);
        
        // Crear una copia del objeto sin los campos no permitidos
        const { id_workOrder, deletedAt, truck, ...filteredEdite } = edite;
    
        // Asegurar que `numeroOrden` sea un número
        if (filteredEdite.numeroOrden) {
            filteredEdite.numeroOrden = Number(filteredEdite.numeroOrden);
        }
    
        console.log("Datos filtrados a enviar:", filteredEdite);
    
        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_BACKEND_URL}/work-order/${id}`, 
                filteredEdite, // Enviar solo los datos permitidos
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            if (response.status === 200) {
                setFormDetails((prevDetails) =>
                    prevDetails.map((order) => (order.id === id ? { ...order, ...filteredEdite } : order))
                );
                setShowModal(false);
            }
            setTimeout(() => {
                window.location.reload();
              }, 10);
        } catch (error) {
            console.error("Error al guardar los cambios:", error.response?.data || error.message);
            alert("Error al guardar los cambios: " + (error.response?.data?.message || error.message));
        }
    };

    // Eliminar orden de trabajo
    const handleDelete = async () => {
        try {
            const responses = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/work-order/${id}`);
            if (responses.status === 200) {
                setShowModals(false);
                navigate('/work');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='stock'>
            <div className='div-nav'>
                <Nav />
            </div>
            <div className='div-general'>
                <strong>
                    <p>Orden de trabajo</p>
                </strong>
                {formDetails && Array.isArray(formDetails) ? (
                    formDetails.map((work) => (
                        <div className='details-general' key={work.id_workOrder}>
                            <p>
                                <strong>Operario: </strong> {work.operario}
                            </p>
                            <p>
                                <strong>Encargado: </strong> {work.encargado}
                            </p>
                            <p>
                                <strong>Responsable: </strong> {work.responsable}
                            </p>
                            <p>
                                <strong>Prioridad: </strong> {work.prioridad}
                            </p>
                            <p>
                                <strong>Tipo de mantenimiento: </strong> {work.tipoMantenimiento}
                            </p>
                            <p>
                                <strong>Fecha de solicitud: </strong> {work.fechaSolicitud}
                            </p>
                            <p>
                                <strong>Fecha de inicio: </strong> {work.fechaInicio}
                            </p>
                            <p>
                                <strong>Fecha de cierre: </strong> {work.fechaCierre}
                            </p>
                            <p>
                                <strong>Numero de orden: </strong> {work.numeroOrden}
                            </p>
                            <p>
                                <strong>Descripción: </strong> {work.descripcion}
                            </p>
                            <p>
                                <strong>Precio interno: </strong> ${work.precioInterno}
                            </p>
                            <p>
                                <strong>Precio externo: </strong> ${work.precioExterno}
                            </p>
                            <p>
                                <strong>Precio total: </strong> ${work.precioTotal}
                            </p>
                            <div className='div-buttons'>
                                <button className='new-btn' onClick={handleCLick}>Editar</button>
                                <button className='delete-btn' onClick={handleCLicks}>Eliminar</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Cargando Ordenes de Trabajo...</p>
                )}

                {/* Modal de eliminación */}
                {showModals && (
                    <div className='modal-overlay-details'>
                        <div className='model-content-details'>
                            <div className='content-form-truck'>
                                <div className='modal-header'>
                                    <p className='p-alert'>¿Estás seguro de que quieres eliminar este orden de trabajo?</p>
                                    <div className='modal-buttons'>
                                        <button className='delete-btn' onClick={handleDelete}>Eliminar</button>
                                        <button className='modal-btn cancel' onClick={handleCLoses}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de edición */}
                {showModal && (
                    <div className='modal-overlay-details'>
                        <div className='model-content-details'>
                            <div className='content-form-truck'>
                                <div className='modal-header'>
                                    <p className='p-alert'>Editar Orden de Trabajo</p>
                                </div>
                                <div className='modal-body'>
                                    <div className='form-group'>
                                        <label>Operario:</label>
                                        <input 
                                            type="text" 
                                            name="operario" 
                                            value={edite.operario || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Encargado:</label>
                                        <input 
                                            type="text" 
                                            name="encargado" 
                                            value={edite.encargado || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Responsable:</label>
                                        <input 
                                            type="text" 
                                            name="responsable" 
                                            value={edite.responsable || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Prioridad:</label>
                                        <input 
                                            type="text" 
                                            name="prioridad" 
                                            value={edite.prioridad || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Tipo de mantenimiento:</label>
                                        <input 
                                            type="text" 
                                            name="tipoMantenimiento" 
                                            value={edite.tipoMantenimiento || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Fecha de cierre:</label>
                                        <input 
                                            type="date" 
                                            name="fechaCierre" 
                                            value={edite.fechaCierre || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Descripción:</label>
                                        <textarea 
                                            name="descripcion" 
                                            value={edite.descripcion || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Precio interno:</label>
                                        <input 
                                            type="text" 
                                            name="precioInterno" 
                                            value={edite.precioInterno || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Precio externo:</label>
                                        <input 
                                            type="text" 
                                            name="precioExterno" 
                                            value={edite.precioExterno || ''} 
                                            onChange={handleInputSave} 
                                        />
                                    </div>
                                </div>
                                <div className='modal-buttons'>
                                    <button className='new-btn' onClick={handleSave}>Guardar</button>
                                    <button className='modal-btn cancel' onClick={handleCLose}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
