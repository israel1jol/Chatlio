import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useAuth } from "../Hooks/Hooks";
import { useSelector, useDispatch } from "react-redux";
import { FaUserAlt, FaCheckCircle } from "react-icons/fa"
import { SuspenseLoader } from "../Components/Loaders";

const Register = ({addr}) => {
    const [cookie, setCookie, removeCookie] = useCookies(["success_message"]);
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [unregistered, setUnregistered] = useState(true);
    const [picFile, setPicFile] = useState(null);
    const [picPreview, setPicPreview] = useState("");
    const [loading, setIsLoading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploading, setUploading] = useState(false);

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
        if(password !== rePassword){
            return dispatch({type:"active_session_with_error", error:{err:true, type:"component-based",message:"Password does not match"}});
        }
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
            setCookie("success_message", true, {maxAge:30});
        }).catch(e => {
            setIsLoading(false);
            return dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:"Can't connect to server"}})
        })
    }

    const triggerFileInput = () => {
        document.getElementById("fileUpload").click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validTypes.includes(file.type)) {
            setUploadError("JPG, JPEG OR PNG FORMAT.");
            setPicFile(null);
            setPicPreview("");
            return;
        }

        setPicFile(file);
        setPicPreview(URL.createObjectURL(file));
        setUploadError("");
    };

    const uploadProfilePic = async () => {
        if (!picFile) {
            setUploadError("Select a photo first");
            return;
        }

        setUploading(true);
        setUploadError("");

        const formData = new FormData();
        formData.append("pic", picFile);

        try {

            console.log("token", auth.user.token)
            const res = await fetch(`${addr}/api/v1/auth/profilePic`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${auth.user.token}`
                },
                body: formData
            });

            const data = await res.json();
            if (!res.ok || data.error) {
                setUploadError(data.error || "Upload failed");
                setUploading(false);
                return;
            }

            dispatch({ type: "active_session", payload: data.user || data });
            setUploading(false);
            nav("/");
        } catch (err) {
            setUploadError("Could not upload profile picture");
            setUploading(false);
        }
    };

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
                {auth.error.type==="general-error" ? <div className={auth.error.type}>{auth.error.message}</div> : <></>}
            <div className="jumbotron">
                { auth.error.type === "component-based" ? <div className={auth.error.type}>{ auth.error.message }</div> :  <></> }
                {
                    unregistered ? 
                    <div className="form-field">
                    <h3>Create an account</h3>
                    <form method="POST" onSubmit={register}>
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
                        <div>
                            <label htmlFor="re-password">Re-Password</label>
                            <input type="password" name="re-password" id="re-password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} required/>
                        </div>
                        <input type="submit" className="custom-btn submit-btn"  value="Sign Up"/>
                    </form>   
                    </div>
                    :
                    <>
                    {cookie.success_message ? <div className="general-error success-message">Account created successfully! We just sent you an email (Note: Check spam folder if email not in inbox)</div> : <></>}
                    {uploadError && <div className="component-based">{uploadError}</div>}
                    <div id="messagePlaceHolder"></div>
                    <div className="uploadButton" onClick={triggerFileInput}>
                        <div className="button-area">
                            <FaUserAlt className="icon"/> 
                            <div className="lead">{picFile ? picFile.name : "Tap here to select an image < 1MB"}</div>
                            <FaCheckCircle className={`check-icon ${ picFile !== null ? "open" : "" }`}/>
                        </div>
                    </div>
                    <input type="file" id="fileUpload" name="pic" className="actualUploader" accept="image/*" onChange={handleFileChange} style={{display: "none"}}/>
                    
                    {picFile && (
                        <button type="button" className="simple-btn upload-btn simple-btn-primary" onClick={uploadProfilePic} disabled={uploading}>
                            {uploading ? "Uploading..." : "Upload Picture"}
                        </button>
                    )}
                    <button type="button" className="simple-btn simple-btn-secondary" onClick={() => nav("/")}>Skip</button>
                    </>
                }
            </div>
                </>
            }
        </div>
    )
}

export default Register