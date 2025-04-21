import React, { useState } from 'react'
import { Nav } from '../Nav/Nav'

export const DetailsStock = () => {
    const [details, setDetails] = useState([]);

    

  return (
    <div className='stock'>
         <div className='div-nav'>
            <Nav/>
        </div>
        <div className='div-general'>

        </div>
    </div>
  )
}
