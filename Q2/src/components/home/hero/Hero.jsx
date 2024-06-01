import React from "react"
import Heading from "../../common/Heading"
import "./hero.css"

const Hero = () => {
  return (
    <>
      <section className='hero'>
        <div className='container'>
          <Heading title='Explore the products' subtitle='Find new & featured products for yourself.' />

          <form className='flex'>
            <div className='box'>
              <span>Category</span>
              <input type='text' placeholder=' ' />
            </div>
            <div className='box'>
              <span>Product Type</span>
              <input type='text' placeholder=' ' />
            </div>
            <div className='box'>
              <span>Price Range</span>
              <input type='text' placeholder=' ' />
            </div>
            
            <button className='btn1'>
              Search
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

export default Hero
