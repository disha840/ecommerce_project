import React, { useEffect } from 'react'
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

import Users from './page/UsersFolder/Users'
import ViewUser from './page/UsersFolder/ViewUser'

import Dashboard from './page/Dashboard/Dashboard'

import Category from './page/category/Category'
import ViewCategory from './page/category/ViewCategory'

import Role from './page/Role/Role'

import Brand from './page/Brand/Brand'


import Subcategory from './page/Subcategory/Subcategory'
import ViewSubcategory from './page/Subcategory/ViewSubCat'
import Product from './page/Products/Produtcts'
import ViewProduct from './page/Products/ViewProduct'
import ViewRole from './page/Role/ViewRole'
import ViewBrand from './page/Brand/ViewBrand'
import ProductVariant from './page/ProductVariant/ProductVariant'
import Store from './page/Store/Store'
import ProtectedRoute from './components/ProtectedRoute'



const App = () => {
  

  return (
    <div>
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<Login/>}/>
  



  {/* <Route element={<ProtectedRoute />}> */}

  <Route element={<Admin />}>

     <Route path='/admin/dashboard' element={<Dashboard/>}/>

      <Route path='/admin/brand' element={<Brand/>}/>
      
     <Route path='/admin/viewbrand/:id' element={<ViewBrand/>}/>

     <Route path='/admin/users' element={<Users/>}/>
      <Route path='/admin/view/:id' element={<ViewUser/>}/>

     <Route path='/admin/role' element={<Role/>}/>
     <Route path='/admin/viewrole/:id' element={<ViewRole/>}/>

     <Route path='/admin/category' element={<Category/>}/>
     <Route path='/admin/viewcategory/:id' element={<ViewCategory/>}/>
    
     <Route path='/admin/subcategory' element={<Subcategory/>}/>
     <Route path='/admin/viewsubcategory/:id' element={<ViewSubcategory/>}/>

     <Route path='/admin/products' element={<Product/>}/>
     <Route path='/admin/viewproduct/:id' element={<ViewProduct/>}/>

     <Route path='/admin/productvariant' element={<ProductVariant/>}/>
     <Route path='/admin/store' element={<Store/>}/>
     


  </Route>
    
    
    <Route path='/create' element={<CreateUser/>} />
    <Route path='/signup' element={<SignUp/>}/>
    {/* <Route path='/login' element={<Login/>}/> */}
    <Route path='/forgotpassw' element={<ForgotPassw/>}/>
    <Route path='/verifyotp' element={<VeryfyOtp/>}/>
    <Route path='/resetpassword' element={<ResetPass/>}/>
     <Route path='/admin' element={<Admin/>}>

     </Route>
    
   </Routes>

   </BrowserRouter>
      <ToastContainer />
    </div>
  )
}

export default App
