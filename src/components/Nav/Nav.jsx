import casa from '../../assets/casa.png'
import camion from '../../assets/camion.png'
import lista from '../../assets/lista.png'
import calendario from '../../assets/calendario.png'
import stock from '../../assets/inventario.png'
import empleados from '../../assets/contratacion.png'
import reporte from '../../assets/reporte.png'
import {Link} from 'react-router-dom'
import './Nav.css'

export const Nav = () => {


  return (
    <div className='Nav'>
       <div className='nav'>
       <strong>

       <p className='name'>TruckMonitor</p>
       </strong>
      <ul>
        <div className='div'>
          <Link to='/home'>
          <li>
            <img className='img-nav' src={casa} alt="" />
            <p className='p-li'>Hogar</p>
          </li>
          </Link>
        </div>
        <div className='div-li-nav'>
          <Link to='/truck'>
          <li>
          <img className='img-nav' src={camion} alt="" />
          <p className='p-li'>Equipos</p>
          </li>
          </Link>
        </div> 
        <div className='div-li-nav'>
          <Link to='/work'>
          <li>
          <img className='img-nav' src={lista} alt="" />
          <p className='p-li'>Ordenes de trabajo</p>
          </li>
          </Link>
        </div>  
        <div className='div-li-nav'>
          <Link to='/calendar'>
          <li>
          <img className='img-nav' src={calendario} alt="" />
          <p className='p-li'>Calendario</p>
          </li>
          </Link> 
        </div> 
        <div className='div-li-nav'>
          <Link to='/stock'>
          <li>
          <img className='img-nav' src={stock} alt="" />
          <p className='p-li'>Stock</p>
          </li>
          </Link>
        </div> 
        <div className='div-li-nav'>
          <Link to={'/section'}>
          <li>
          <img className='img-nav' src={empleados} alt="" />
          <p className='p-li'>Secciones</p>
          </li>
          </Link>
        </div> 
        <div className='div-li-nav'>
          <Link to={'/operator'}>
          <li>
          <img className='img-nav' src={reporte} alt="" />
          <p className='p-li'>Operadores</p>
          </li>
          </Link>
        </div> 
        <div className='div-li-nav'>
        <Link to={'/information'}>
          <li>
          <img className='img-nav' src={reporte} alt="" />
          <p className='p-li'>Informes</p>
          </li>
          </Link>
        </div> 
      </ul>
       </div>
    </div>
  )
}
