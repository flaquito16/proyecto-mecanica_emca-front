import React from 'react'
import './Information.css'
import { Nav } from '../Nav/Nav'
import axios from 'axios';

export const Information = () => {
    const handleDownloadPdf = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/pdf/1`, {
           
          });
      
          if (!response.ok) {
            throw new Error('Error al generar el PDF');
          }
      
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'orden-trabajo.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error('Error al descargar el PDF:', error);
        }
      };
      

  return (
    <div className='div-general'>
      <div className='div-nav'>
        <Nav />
      </div>
      <div className='div-general'>
        <h3>Reportes</h3>
        <button type='submit' onClick={handleDownloadPdf}>Descargar Orden de Trabajo</button>
      </div>
    </div>
  );
};
