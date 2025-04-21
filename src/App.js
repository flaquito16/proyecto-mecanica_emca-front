import {Nav} from './components/Nav/Nav.jsx'
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Sesion } from './components/Sesion/Sesion.jsx';
import { CreationAccont } from './components/Creation_accont/Creation_accont.jsx';
import { Home } from './components/Pages/Home/Home.jsx';
import { Truck } from './components/Truck/Truck.jsx';
import { Stock } from './components/Stock/Stock.jsx';
import { WorkOrder } from './components/WorkOrder/WorkOrder.jsx';
import { Section } from './components/Section/Section.jsx';
import { Details } from './components/Details/Details.jsx';
import { DetailsWork } from './components/DetailsWork/DetailsWork.jsx';
import { Operator } from './components/Operator/Operator.jsx';
import { Cale } from './components/Calendar/Calendar.jsx';
import { Information } from './components/Information/Information.jsx';


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
      <Route path='/calendar' element={<Cale/>}></Route>
      <Route path='/work' element={<WorkOrder/>}></Route>
      <Route path='/section' element={<Section/>}></Route>
      <Route path='/details/:id' element={<Details/>}></Route>
      <Route path='/detailsWork/:id' element={<DetailsWork/>}></Route>
      <Route path='/operator' element={<Operator/>}></Route>
      <Route path='/information' element={<Information/>}></Route>
    </Routes>
 </HashRouter>
  );
}

export default App;
