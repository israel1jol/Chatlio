import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLtp } from "../Hooks/Hooks";
import { FaUserCircle } from "react-icons/fa";


const Chat = ({addr}) => {
    const nav = useNavigate();
    const auth = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const ltp = useLtp();

    const [recents, setRecents] = useState([]);
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        if(!localStorage.getItem("refToken")){
            return nav("/login");
        }
        fetch(`${addr}/api/v1/chat/recentChats`, {
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                token:auth.user.token
            })
        }).then(res => res.json()).then(data => {
            if(data.error){
                return dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:data.error}})
            }
            dispatch({type:"invalidate_error"})
            setRecents(data)
        })
    }, [auth.user.token])

    useEffect(() => {
        fetch(`${addr}/api/v1/auth/profiles`, {
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                profiles:recents
            })
        }).then(res => res.json()).then(data => {
            if(data.error){
                return dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:data.error}})
            }
            dispatch({type:"invalidate_error"})
            setContacts(data)
            console.log("Hey mehn")
        })
    }, [recents])

    const [userFound, setUserFound] = useState(false);
    const [locateId, setLocateId]= useState("");

    const FindUser = (e) => {
        e.preventDefault();

        dispatch({type:"invalidate_error"})

        fetch(`${addr}/api/v1/auth/profile`+locateId).then(res => res.json())
        .then(data => {
            if(data.error){
                return dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:data.error}})
            }
            setUserFound(data.receiver);
            dispatch({type:"gotEm", payload:data.receiver})
        }).catch(e => dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:"Can't connect to server"}}))
    }

    const chatEm = () => {
        nav("/chat?receiver="+locateId+"&encrypted=false")
    }

    return (
        <div className="chat-page-container">
            {auth.error.type==="general-error" && auth.error.err ? <div className={auth.error.type}>{auth.error.message}</div> : <></>}
            {
                userFound ? 
                <div className="user-profile">
                    { userFound.profileImage !== "" ? <img src={`${addr}/api/v1/uploads/${ltp(userFound.profileImage)}`} alt="profile pic"/> : <FaUserCircle className="no-user-profile" /> }
                    
                    <section>
                        <h1>{userFound.username}</h1>
                    </section>
                    <button className="custom-btn" onClick={chatEm}>Chat them up</button>
                </div> : 
                <div>
                    <div className="contacts-panel">
                        <ul>
                        { localStorage.getItem("refToken") && auth.user.token == null ? <h6>Loading...</h6> : <></> }
                        {
                            contacts.map(contact => (
                                <li key={contact.id}>
                                    <Link className="chat-link-btn" to={"/chat?receiver="+contact.id+"&encrypted=false"}>
                                        { contact.profileImage !== "" ? <img src={`${addr}/api/v1/uploads/`+ltp(contact.profileImage)} /> : <FaUserCircle className="no-user-icon"/>}
                                        <h5>{contact.username}</h5>
                                    </Link>
                                </li>
                            ))
                        }
                        </ul>
                    </div>
                     <div className="search-menu">
                        <form>
                            <input type="text" name="id" value={locateId} onChange={(e) => setLocateId(e.target.value)}  placeholder=" Find user by id" required/>
                            <div><input type="submit" value="Find" className="custom-btn" onClick={(e) => locateId !== "" ? FindUser(e) : null}/></div>
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}

export default Chat