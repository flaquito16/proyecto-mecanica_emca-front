import React, {useRef} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import './Calendar.css'
import { Nav } from '../Nav/Nav'

export default function Calendar() {
  const calendarRef = useRef(null)
  
  return (
    <div className='calendar'>
      <div className='div-nav'>
        <Nav/>
      </div>
      <div className='div-calendar'>
        <div className='container-calendar'>

      <FullCalendar ref={calendarRef} plugins={[ dayGridPlugin ]}/>      
        </div>
      </div>
    </div>
  )
}
