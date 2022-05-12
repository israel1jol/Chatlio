import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/Hooks";
import { useSelector, useDispatch } from "react-redux";
import { FaUserAlt, FaCheckCircle } from "react-icons/fa"
import { SuspenseLoader } from "../Components/Loaders";

const Register = ({addr}) => {
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [unregistered, setUnregistered] = useState(true);
    const [pic, setPic] = useState("");
    const [loading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const nav = useNavigate();

    const auth = useSelector(store => store.auth);

    const loginUser = useAuth();

    useEffect(() => {
        if(!localStorage.getItem("Page_needed_to") && localStorage.getItem("refToken") ){
            return nav("/")
        }
        else if(localStorage.getItem("Page_needed_to") && localStorage.getItem("refToken")){
            setUnregistered(false);
        }
    }, [])

    const register = (e) => {
        e.preventDefault();
        setIsLoading(true);

        dispatch({type:"invalidate_error"});

        fetch(`${addr}/api/v1/auth/register`, {
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                firstname:firstname, lastname:lastname, username:username, email:email, password:password
            })
        }).then(res => res.json()).then(data => {
            if(data.error){
                dispatch({type:"active_session_with_error", error:{err:true, type:"component-based",message:data.error}});
                return setIsLoading(false);
            }
            loginUser(email, password);
            localStorage.setItem("Page_needed_to", "Profile image not set");
            setUnregistered(false);
            setIsLoading(false);
        }).catch(e => {
            setIsLoading(true);
            return dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:"Can't connect to server"}})
        })
    }


    const triggerFileInput = () => {
        document.getElementById("fileUpload").click()
    }
    useEffect(() => {
        if(pic.substring(pic.length-4) !== ".jpg" && pic.substring(pic.length-5) !== ".jpeg" && pic.substring(pic.length-4) !== ".png"){
            setPic("");
        }
    }, [pic])

    useEffect(() => {
        return() => {
            dispatch({type:"invalidate_error"});
        }
    },[])

    return (
        <div className="stage">
            {
                loading ? <SuspenseLoader/> : 
                <>
                {auth.error.type==="general-error" ? <div className={auth.error.type} on>{auth.error.message}</div> : <></>}
            <div className="jumbotron">
                { auth.error.type === "component-based" ? <div className={auth.error.type}>{ auth.error.message }</div> :  <></> }
                {
                    unregistered ? 
                    <div className="form-field">
                    <h3>REGISTER</h3>
                    <form method="POST" action="/login" onSubmit={register}>
                        <div>
                            <label htmlFor="firstname">Firstname</label>
                            <input type="text" name="firstname" id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="lastname">Lastname</label>
                            <input type="text" name="lastname" id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <input type="submit" className="custom-btn"  value="Register"/>
                    </form>   
                    </div>
                    :
                    <>
                    <div className="uploadButton" onClick={triggerFileInput}>
                        <div className="button-area">
                            <FaUserAlt className="icon"/> 
                            <div className="lead">Tap here to select an image &lt; 1MB</div>
                            <FaCheckCircle className={`check-icon ${ pic !== "" ? "open" : "" }`}/>
                        </div>
                    </div>
                    <form action={`${addr}/api/v1/auth/profilePic`} method="post" encType="multipart/form-data">
                        <input type="file" id="fileUpload" name="pic" className="actualUploader" value={pic} onChange={(e) => setPic(e.target.value)} required/>
                        <input type="hidden" name="token" value={auth.user.token ? auth.user.token : ""}/>
                        { pic.substring(pic.length-4) !== ".jpg" && pic.substring(pic.length-5) !== ".jpeg" && pic.substring(pic.length-4) !== ".png"? <h4>JPG, JPEG OR PNG FORMAT.</h4>  : <input type="submit" value="Upload Picture" className="simple-btn simple-btn-primary"/>}
                    </form>
                    <button className="simple-btn simple-btn-secondary" onClick={() => nav("/")}>Skip</button>
                    </>
                }
            </div>
                </>
            }
        </div>
    )
}

export default Register

