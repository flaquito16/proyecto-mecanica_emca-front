import {Nav} from './components/Nav/Nav.jsx'
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Sesion } from './components/Sesion/Sesion.jsx';
import { CreationAccont } from './components/Creation_accont/Creation_accont.jsx';
import { Home } from './components/Pages/Home/Home.jsx';
import { Truck } from './components/Truck/Truck.jsx';
import { Stock } from './components/Stock/Stock.jsx';
import { WorkOrder } from './components/WorkOrder/WorkOrder.jsx';
import Calendar from './components/Calendar/Calendar.jsx';
import { Section } from './components/Section/Section.jsx';


function App() {
  return (
      
    <HashRouter>
    <Routes>
      <Route index path='/' element={<Sesion/>}></Route>
      <Route path='/nav' element={<Nav/>}></Route>
      <Route path='/register' element={<CreationAccont/>}></Route>
      <Route index path='/home' element={<Home/>}></Route>
      <Route path='/truck' element={<Truck/>}></Route>
      <Route path='/stock' element={<Stock/>}></Route>
      <Route path='/calendar' element={<Calendar/>}></Route>
      <Route path='/work' element={<WorkOrder/>}></Route>
      <Route path='/section' element={<Section/>}></Route>
    </Routes>
</HashRouter>
  );
}

export default App;
