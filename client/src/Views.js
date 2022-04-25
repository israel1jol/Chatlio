import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Navbar from "./Components/Navbar";
import Register from "./Pages/Register";

export default function Views(){
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                </Routes>
            </Router>
        </>
    )
}