import React, { useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { useDispatch } from "react-redux";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Chat from "./Pages/Chat";
import { SuspenseLoader } from "./Components/Loaders";


const ChatRoom = React.lazy(() => import("./Components/ChatRoom"));
const Navbar = React.lazy(() => import("./Components/Navbar"));

export default function Views(){
    const dispatch = useDispatch();

    const SERVER_ADDR = "https://chatlio-backend-server.onrender.com";

    useEffect(() => {
        const token = localStorage.getItem("refToken");
        dispatch({type:"invalidate_error"});
        if(token){
            fetch(`${SERVER_ADDR}/api/v1/auth/accessToken`, {
                method:"GET",
                headers:{
                    authorization:"Bearer "+token
                }
            }).then(res => res.json())
            .then(data => {
                if (data.error){
                    localStorage.removeItem("refToken");
                    dispatch({type:"cancelEm"})
                    return dispatch({type:"cancel_session_with_error", error:{err:true, type:"general-error", message:data.error}})
                }
                getData(data)
            }).catch(e => dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:"Can't connect to server"}}))

            function getData(data){
                fetch(`${SERVER_ADDR}/api/v1/auth/info`, {
                    method:"POST", 
                    headers:{
                        "content-type":"application/json"
                    },
                    body:JSON.stringify({
                        token:data.accessToken
                    })
                }).then(res => res.json()).then(user => {
                    if(user.error){
                        localStorage.removeItem("refToken");
                        dispatch({type:"cancelEm"})
                        return dispatch({type:"cancel_session_with_error", error:{err:true, type:"general-error", message:data.error}})
                    }
                    dispatch({type:"active_session", payload:{token:data.accessToken, username:user.username, email:user.email, firstname:user.firstname, lastname:user.lastname, profileImage:user.profileImage, id:user._id} })
                }).catch(e => dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:"Can't connect to server"}}))
            }
        }

    }, [])


    return (
        <>
            <Suspense fallback={<SuspenseLoader />}>
                <Router>
                    <Navbar addr={SERVER_ADDR}/>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register addr={SERVER_ADDR}/>}/>
                        <Route path="/explore" element={<Chat addr={SERVER_ADDR}/>}/>
                        <Route path="/chat" element={<ChatRoom addr={SERVER_ADDR}/>}/>
                    </Routes>
                </Router>
            </Suspense>
        </>
    )
}

