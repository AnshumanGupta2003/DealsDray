import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Dashboard from './Dashboard'
import EmployeeList from './EmployeeList'
import AddEmployee from './AddEmployee'
import EditEmployee from './EditEmployee';
import NotFound from './NotFound'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    
    <Routes>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/dashboard' element={<Dashboard/>}></Route>
      <Route path='/EmployeeList' element={<EmployeeList/>}></Route>
      <Route path="/add-employee" element={<AddEmployee />} />
      <Route path="/edit-employee/:id" element={<EditEmployee />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    
    
    
    </BrowserRouter>

    
  )
}

export default App
