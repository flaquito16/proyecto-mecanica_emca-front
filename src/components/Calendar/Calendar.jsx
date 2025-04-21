import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import dayjs from 'dayjs';
import MiniCalendar from 'react-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-calendar/dist/Calendar.css';
import 'dayjs/locale/es';
import './Cale.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import atras from '../../assets/flecha-izquierda (1).png';
// import { Nav } from '../Nav/Nav';

dayjs.locale('es');

// ✅ Configuración correcta del localizador en español
const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// ✅ Barra de herramientas personalizada
const CustomToolbar = ({ label, onNavigate, onView, view }) => (
  <div className="toolbar">
    <div className="toolbar-navigation">
      <button onClick={() => onNavigate('TODAY')} className="button-primary">Hoy</button>
      <button onClick={() => onNavigate('PREV')} className="button">{'<'} Ant.</button>
      <button onClick={() => onNavigate('NEXT')} className="button">Sig. {'>'}</button>
    </div>
    <span className="toolbar-label">{label}</span>
    <div className="toolbar-view">
      <button onClick={() => onView('month')} className={`button ${view === 'month' ? 'active' : ''}`}>Mes</button>
      <button onClick={() => onView('week')} className={`button ${view === 'week' ? 'active' : ''}`}>Semana</button>
      <button onClick={() => onView('day')} className={`button ${view === 'day' ? 'active' : ''}`}>Día</button>
      <button onClick={() => onView('agenda')} className={`button ${view === 'agenda' ? 'active' : ''}`}>Agenda</button>
    </div>
  </div>
);

export const Cale = () => {
  const [details, setDetails] = useState([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);

  // ✅ Lista de eventos


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/work-order`);
  
        if (response.status === 200 && Array.isArray(response.data)) {
          const transformed = response.data.map((work) => {
            const start = new Date(work.fechaInicio);
            const end = work.fechaCierre ? new Date(work.fechaCierre) : new Date(work.fechaInicio);
  
            // Validar fechas
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
              console.warn('Fecha inválida:', work);
              return null;
            }
  
            return {
              ...work,
              title: work.tipoMantenimiento || 'Sin descripción',
              start,
              end,
            };
          }).filter(Boolean); // Elimina los nulls
  
          setDetails(transformed);
        }
      } catch (error) {
        console.error('Error al obtener detalles:', error);
      }
    };
  
    fetchDetails();
  }, []);
  
  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
      setView('day');
    }
  }, [selectedDate]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="calendar-container">
      <div>
        <Link to="/home">
        <img className='atras' src={atras} alt="" />
        </Link>
      </div>
      <header className="calendar-header">
        <h3 >Calendario</h3>
      </header>

      <div className="calendar-content">
        <aside className="calendar-sidebar">
          <MiniCalendar onChange={handleDayClick} value={date} className="mini-calendar" />

          <div className="agenda">
            <h4>Agenda</h4>
            <ul>
              {details.map((work) => (
                <p key={work.id_workOrder}>
                  <span>Fecha de inicio: {dayjs(work.fechaInicio).format('DD/MM/YYYY')}</span>: {work.tipoMantenimiento}
                </p>
              ))}
            </ul>
          </div>
        </aside>

        <main className="calendar-main">
          <Calendar
            localizer={localizer}
            events={details}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 900 }}
            view={view}
            date={date}
            onView={setView}
            onNavigate={setDate}
            messages={{
              next: 'Sig.',
              previous: 'Ant.',
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
              date: 'Fecha',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'No hay eventos en este rango.',
              showMore: (total) => `+ Ver más (${total})`,
            }}
            components={{
              toolbar: CustomToolbar,
            }}
            className="cale"
          />
        </main>
      </div>
    </div>
  );
};
