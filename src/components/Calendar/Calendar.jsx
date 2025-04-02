import React, { useContext, useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

import { AppContext } from '../Context/Context';
import DeleteEventModal from './ModalCreateTask/DeleteEvent/DeleteEvent';
import MiniCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

dayjs.locale('es');

const locales = { es };
const localizer = dateFnsLocalizer({
  format: (date, formatStr, options) => format(date, formatStr, { locale: locales['es'], ...options }),
  parse: (str, formatStr, options) => parse(str, formatStr, new Date(), { locale: locales['es'], ...options }),
  startOfWeek: (date, options) => startOfWeek(date, { locale: locales['es'], ...options }),
  getDay: (date, options) => getDay(date, { locale: locales['es'], ...options }),
  locales,
});

const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  return (
    <div className="toolbar">
      <div className="toolbar-navigation">
        <button onClick={() => onNavigate('TODAY')} className="button primary">Hoy</button>
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
};

export const Calendar = () => {
  const { events,  setDeleteEventModal, setEventToDelete } = useContext(AppContext);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
      setView('day');
    }
  }, [selectedDate]);


  const handleSelectEvent = (event) => {
    setEventToDelete(event);
    setDeleteEventModal(true);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <h3>Mis calendarios</h3>
        {/* <button onClick={() => setIsModalOpenCale(true)} className="button create-event">Crear Evento</button> */}
      </header>
      <div className="calendar-content">
        <aside className="calendar-sidebar">
          <MiniCalendar onChange={handleDayClick} value={date} className="mini-calendar" />
          <div className="agenda">
            <h4>Agenda</h4>
            <ul>
              {events.map((event, index) => (
                <li key={index}>
                  <span>{dayjs(event.start).format('DD/MM/YYYY')}</span>: {event.title}
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <main className="calendar-main">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            onSelectEvent={handleSelectEvent}
            messages={{ next: 'Sig.', previous: 'Ant.', today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día', agenda: 'Agenda', date: 'Fecha', time: 'Hora', event: 'Evento', noEventsInRange: 'No hay eventos en este rango.', showMore: (total) => `+ Ver más (${total})` }}
            components={{ toolbar: CustomToolbar }}
            className="calendar"
          />
          <DeleteEventModal />
        </main>
      </div>
    </div>
  );
};

