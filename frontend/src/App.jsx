import React from 'react'
import SignUp from './Pages/SignUp'
import Login from './Pages/Login'
import ForgotPassw from './Pages/ForgotPassw'
import VeryfyOtp from './Pages/VeryfyOtp'
import ResetPass from './Pages/ResetPass'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Main from './Pages/Main'
import CreateUser from './Pages/CreateUser'
import Admin from './AdminLayout/Admin'
import Users from './AdminLayout/Users'
import UserDetail from './AdminLayout/UserDetail'
import Dashboard from './AdminLayout/Dashboard'
import Category from './AdminLayout/Category'
import Role from './AdminLayout/Role'
import Brand from './AdminLayout/Brand'
import ViewUser from './AdminLayout/ViewUser'
import ViewCategory from './AdminLayout/ViewCategory'



const App = () => {
  return (
    <div>
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<Main/>}/>
  
    
    
    <Route path='/create' element={<CreateUser/>} />
    <Route path='/signup' element={<SignUp/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/forgotpassw' element={<ForgotPassw/>}/>
    <Route path='/verifyotp' element={<VeryfyOtp/>}/>
    <Route path='/resetpassword' element={<ResetPass/>}/>
     <Route path='/admin' element={<Admin/>}>
     <Route path='/admin/brand' element={<Brand/>}/>
     <Route path='dashboard' element={<Dashboard/>}/>
     <Route path='/admin/users' element={<Users/>}/>
     <Route path='/admin/role' element={<Role/>}/>
     <Route path='/admin/category' element={<Category/>}/>
     <Route path='/admin/userdetail' element={<UserDetail/>}/>
     <Route path='/admin/view/:id' element={<ViewUser/>}/>
     <Route path='/admin/viewcategory/:id' element={<ViewCategory/>}/>
  
     </Route>
    
   </Routes>

   </BrowserRouter>
      <ToastContainer />
    </div>
  )
}

export default App
