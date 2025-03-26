import React, { useEffect, useState } from 'react'
import './Details.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { Nav } from '../Nav/Nav';

export const Details = () => {
    const {id} = useParams();
    const [details, setDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/truck/${id}`);
                if (response.status === 200) {
                    console.log('Obtener los detalles del camión');
                    setDetails(Array.isArray(response.data) ? response.data : [response.data]);                    
                };
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();

    }, [id]);

    const handleClickDelete = () => {
        setShowModal(true);
    }

    const handleCancel = () => {
        setShowModal(false);
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
                        <li key={order.id_work_order}>
                            {order.descripcion} - {order.fechaInicio}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay órdenes de trabajo registradas.</p>
            )}

            <div className='div-buttons'>
                <button className='new-btn'>Editar</button>
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
    
    </div>
  )
}
