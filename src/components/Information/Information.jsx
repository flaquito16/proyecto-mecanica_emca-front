import React from 'react';
import './Information.css';
import { Nav } from '../Nav/Nav';
import axios from 'axios';

export const Information = () => {
  const handleDownloadPdf = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/pdf/all-users-report`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reporte-ordenTrabajo.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error('Error al descargar el PDF:', error);
    }
  };

  return (
    <div className="truck">
      <div className="div-nav">
        <Nav />
      </div>

      <div className="div-general">
        <h3>Reportes</h3>
        <button className='new-btn' type="button" onClick={handleDownloadPdf}>
          Descargar Reporte de Usuarios
        </button>
      </div>
    </div>
  );
};
