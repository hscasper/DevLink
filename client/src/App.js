import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar.js";
import { Landing } from "./components/layout/Landing.js";
import { Login } from "./components/auth/Login.js";
import { Register } from "./components/auth/Register.js";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  </Router>
);

export default App;
