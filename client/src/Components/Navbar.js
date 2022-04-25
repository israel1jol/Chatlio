import React, { useState } from "react";
import { FaFacebookMessenger, FaBell} from "react-icons/fa";
import {Link} from "react-router-dom";


const Navbar = () => {
    const [toggled, setToggled] = useState(false);

    const openNav = () => {
        const burger_menu = document.getElementById("hamburger-btn");
        const nav = document.getElementById("responsive-nav");
        if(!toggled){
            burger_menu.classList.add("open");
            nav.classList.add("open");
        }
        else{
            burger_menu.classList.remove("open");
            nav.classList.remove("open");
        }
        setToggled(prev => !prev);
    }

    console.log(toggled)
    return (
        <div className="navbar-container">
            <div className="navbar">
                <div className="navbar-brand">
                    <div><FaFacebookMessenger className="messenger-icon"/></div>
                    <h3>Chatify</h3>
                </div>

                <div className="responsive-nav-view">
                    <div className="hamburger-btn" id="hamburger-btn" onClick={openNav}></div>
                    <nav className="responsive-nav" id="responsive-nav">
                        <div className="notifier"><span>0</span></div>
                        <ul>
                            <li><Link to="/" className="nav-link">HOME</Link></li>
                            <li><Link to="/login" className="nav-link">LOGIN</Link></li>
                            <li><Link to="/register" className="nav-link">REGISTER</Link></li>
                        </ul>
                    </nav>
                </div>

                <nav className="standard-nav">
                    <ul>
                        <li><Link to="/" className="nav-link">HOME</Link></li>
                        <li><Link to="/login" className="nav-link">LOGIN</Link></li>
                        <li><Link to="/register" className="nav-link">REGISTER</Link></li>
                    </ul>
                    <div>
                        <FaBell size="20"/>
                    </div>
                </nav>
            </div>

        </div>
    )
}

export default Navbar;