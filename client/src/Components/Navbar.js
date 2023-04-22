import React, { useState } from "react";
import { FaFacebookMessenger, FaUserCircle} from "react-icons/fa";
import {Link} from "react-router-dom";
import { useSelector } from "react-redux";
import { useLtp, useLogout } from "../Hooks/Hooks";

const Navbar = ({addr}) => {
    const ltp = useLtp();
    const logout = useLogout();
    const [toggled, setToggled] = useState(false);
    const user = useSelector(store => store.auth);

    const menuBtnHandler = () => {
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

    return (
        <div className="navbar-container">
            <div className="navbar">
                <div className="navbar-brand">
                    <div><FaFacebookMessenger className="messenger-icon"/></div>
                    <h3>Chatlio</h3>
                </div>

                {!user.authenticated ?
                <>
                 <div className="responsive-nav-view">
                 <div className="hamburger-btn" id="hamburger-btn" onClick={menuBtnHandler}></div>
                 <nav className="responsive-nav" id="responsive-nav">
                     <ul>
                         <li><Link to="/" className="nav-link" onClick={menuBtnHandler}>Home</Link></li>
                         <li><Link to="/login" className="nav-link" onClick={menuBtnHandler}>Login</Link></li>
                         <li><Link to="/register" className="nav-link" onClick={menuBtnHandler}>Sign Up</Link></li>
                     </ul>
                 </nav>
             </div>

             <nav className="standard-nav">
                 <ul>
                     <li><Link to="/" className="nav-link">Home</Link></li>
                     <li><Link to="/login" className="nav-link">Login</Link></li>
                     <li><Link to="/register" className="nav-link">Sign Up</Link></li>
                 </ul>
             </nav></> : 
             <>
             <div className="responsive-nav-view">
                 <div className="user-profile-details">
                    { user.user.profileImage !== "" ? <img src={`${addr}/api/v1/uploads/`+ltp(user.user.profileImage)} /> : <FaUserCircle className="user-icon"/> }
                    <Link to="/profile" className="link">{user.user.username}</Link>
                 </div>
                 <div className="hamburger-btn" id="hamburger-btn" onClick={menuBtnHandler}></div>
                 <nav className="responsive-nav" id="responsive-nav">
                     <ul>
                         <li><Link to="/" className="nav-link" onClick={menuBtnHandler}>Home</Link></li>
                         <li><Link to="/explore" className="nav-link" onClick={menuBtnHandler}>Explore</Link></li>
                         <li><p className="logout-btn nav-link" onClick={(e) => logout()}>Logout</p></li>
                     </ul>
                 </nav>
             </div>

             <nav className="standard-nav">
                 <ul>
                     <li><Link to="/" className="nav-link">Home</Link></li>
                     <li><Link to="/explore" className="nav-link">Explore</Link></li>
                     <li><Link to="/profile" className="simple-btn simple-btn-primary">{user.user.username}</Link></li>
                     <li><p className="logout-btn nav-link" onClick={(e) => logout()}>Logout</p></li>
                 </ul>
             </nav>
             </>                
                 }

            </div>

        </div>
    )
}

export default Navbar;