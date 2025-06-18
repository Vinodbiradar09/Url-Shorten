import { useState } from 'react'

import './App.css'
import Homepage from './pages/Homepage'
import AuthPage from './pages/AuthPage'
import Navbar from "./components/NavBar"
import {Outlet} from "@tanstack/react-router"

function App() {
 

  return (
 
     <>
     <Navbar />
     <Outlet />
     </>

  )
}

export default App
