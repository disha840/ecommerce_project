import React from 'react'
import Hero from "../components/Hero/page"
import Category from "../components/Category/page"
import Product from "../components/Product/page"
import Products from './products/page'


const page = () => {
  return (
    <div>
      
      <Hero/>
      <Category/>
      <Product/>
      {/* <Products/> */}
  
      
    </div>
  )
}

export default page
