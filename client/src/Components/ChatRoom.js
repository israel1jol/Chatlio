import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {useLtp } from "../Hooks/Hooks";
import { SuspenseLoader } from "./Loaders";
import { FaUserCircle } from "react-icons/fa";

let socket;

const ChatRoom = ({addr}) => {
    const location = useLocation();
    const nav = useNavigate();
    const dispatch  = useDispatch();
    const auth = useSelector(store => store.auth);
    const chat = useSelector(store => store.chat);
    const ltp = useLtp();

    const [roomId, setRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState("");
    const [userId, setUserId] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("The user token is", auth.user.token);
        if(!localStorage.getItem("refToken")){
            return nav("/login");
        }

        const receiverId = location.search.split("&")[0].substring(10);
        fetch(`${addr}/api/v1/auth/profile/`+receiverId).then(res => res.json())
        .then(data => {
            if(data.error){
                dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:data.error}});
                return nav("/explore");
            }
            dispatch({type:"gotEm", payload:data.receiver})
        }).catch(e => dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:"Can't connect to server"}}))

        fetch(`${addr}/api/v1/chat/roomData/`+receiverId, {
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                token:auth.user.token
            })
        }).then(res => res.json()).then(data => {
            if(data.error){
                console.log("There was an error", data.msg)
                return;
            }
            dispatch({type:"invalidate_error"})
            setRoomId(data.room._id);
            setUserId(data.userId);
        }).catch(e => dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:"Can't connect to server"}}))
    }, [auth.user.token])

    useEffect(() => {
        socket = io(`${addr}`);

        socket.emit("join", {room:roomId}, (err, res) => {
            if(err){
                dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:data.error}});
                return;
            }
            dispatch({type:"invalidate_error"})
            setMessages(res);
            setIsLoading(false);
        })
    }, [roomId])

    useEffect(() => {
        socket.on("message", (data) => {
            setMessages((msgs) => [...msgs, data]);
        })

        return (() => {
            socket.off("message");
        })
    }, [socket])

    useEffect(() => {
        return () => {
            socket.emit("leaving", roomId, (err) => {
                if(err){
                    console.log("Something went wrong on the server")
                }
            });
        }
    }, [])

    const sendMessage = (e) => {
        e.preventDefault();

        dispatch({type:"invalidate_error"})

        const data = {
            token:auth.user.token,
            message:{
                text:msg,
                roomId:roomId,
                userId:userId
            }
        }

        socket.emit("sendMessage", data, (err, data) => {
            if(err){
                dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:data.error}});
            }
        })
        setMsg("");
    }

    return (
        <div>
                {
                isLoading ?
                <SuspenseLoader />:
                <div className="chatroom-container">
                     {auth.error.type==="general-error" && auth.error.err ? <div className={auth.error.type}>{auth.error.message}</div> : <></>}
                    <div className="chat-panel">
                        <section className="receiver-profile">
                            {
                                chat.receiver.profileImage !== "" ? <img src={`${addr}/api/v1/uploads/`+ltp(chat.receiver.profileImage)} alt="profile pic" /> : <FaUserCircle className="no-user-profile"/>
                            }
                
                            <div><h3>{chat.receiver.username}</h3><p></p></div>
                        </section>
                        <main>
                            <div className="chat-bg">
                                <div className="chat-setting">
                                    <div className="chat-stage-layout">
                                        <ul>
                                            {
                                                messages.map(message => (
                                                    <li key={message._id } className={ message.userId === userId ? "user-message" : "receiver-message" }>
                                                        <div><p>{message.text}</p><span>{message.createdAt.substring(5, 10).split("-").join("/") + "  "+ message.createdAt.substring(11, 16)}</span></div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                    <form onSubmit={(e) => msg !== "" ? sendMessage(e) : null}>
                                            <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} required/>
                                            <input type="submit" value="Send" className="simple-btn simple-btn-primary"/>
                                    </form>
                                </div>
                            </div>
                        </main>
                    </div>        
                </div>
                }
        </div>
    )
}

export default ChatRoom;