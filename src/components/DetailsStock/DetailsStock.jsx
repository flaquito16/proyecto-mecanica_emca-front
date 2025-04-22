import React, { useEffect, useState } from 'react'
import { Nav } from '../Nav/Nav'
import { useFromContext } from '../../Context/FromContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export const DetailsStock = () => {
    const {currentUser} = useFromContext();
    const {id} = useParams();
    const [details, setDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const [edite, setEdite] = useState([]);
    const navigate = useNavigate();


  useEffect(() => {
      const fetchDetails = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/stock/${id}`);
          if (response.status === 200) {
            console.log('Obtener los detalles del camión');
            if (response.data) {
                setDetails(Array.isArray(response.data) ? response.data : [response.data]);
            } else {
                setDetails([]);
            }
          }  
        } catch (error) {
          console.error(error);
        }
      };
      fetchDetails();
  }, [id])  

  const handleClickEdite = () => {
    if (details && details[0]) {
        setEdite(details[0])
        setShowModal(true)
    };
};


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
      [name]: value || '' 
  }));
}

  return (
    
    <div className='stock'>
      {currentUser && (
        <>
         <div className='div-nav'>
            <Nav/>
        </div>
        <div className='div-general'>
        <strong>
                <p className='title-details'>
                    stock
                </p>
            </strong>
        </div>
        </>
      )}
    </div>
  )
}
