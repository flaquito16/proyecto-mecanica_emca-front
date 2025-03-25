import React, { useState} from 'react'
import './Calendar.css'
import { Nav } from '../Nav/Nav'

export const Calendar = () => {
  const [date, setDate] = useState(new Date()); 

  return (
    <div className='calendar'>
      <div className='div-nav'>
        <Nav/>
      </div>
      <div className='div-calendar'>
        <div className='container-calendar'>
        <h2>Selecciona una fecha</h2>
      <Calendar onChange={setDate} value={date} />
      <p>Fecha seleccionada: {date.toDateString()}</p>
        </div>
      </div>
    </div>
  )
}
