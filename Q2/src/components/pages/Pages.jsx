import React from "react"
import Header from "../common/header/Header"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "../home/Home"


const Pages = () => {
  return (
    <>
      <Router>
        <Header />
        <Home />
        
        
      </Router>
    </>
  )
}

export default Pages
