import React from 'react'
import Navbar from "../components/Navbar/page"
import Hero from "../components/Hero/page"
import Category from "../components/Category/page"
import Products from "../components/Products/page"

const page = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Category/>
      <Products/>
      
    </div>
  )
}

export default page
