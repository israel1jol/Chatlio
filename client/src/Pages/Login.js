import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/Hooks";
import { useDispatch, useSelector } from "react-redux";
import { SuspenseLoader } from "../Components/Loaders";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const auth = useSelector(store => store.auth);

    const loginUser = useAuth();

    const formHandler = (e) => {
        setLoading(true);
        e.preventDefault();
        dispatch({type:"invalidate_error"});
        loginUser(email, password);
        if(auth.isAuthenticated){            
            return nav("/")
        }
        setLoading(false);
        
    }

    useEffect(() => {
        if(localStorage.getItem("refToken")){
            return nav("/")
        }
    })

    useEffect(() => {
        return () => {
            clearTimeout()
        }
    })

    return (
        <div className="stage">
            { loading ? <SuspenseLoader/> :
            <>
                {auth.error.type==="general-error" && auth.error.err ? <div className={auth.error.type}>{auth.error.message}</div> : <></>}
                <div className="jumbotron">
                    <div className="form-field">
                    <h3>Login</h3>
                    <form method="POST" action="/home" onSubmit={formHandler}>
                        {auth.error.type=== "component-based"  ? <div className={auth.error.type}>{auth.error.message}</div> : <></>}
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <input type="submit" value="Login" className="custom-btn submit-btn"/>
                    </form>
                    </div>
                </div>
                </>
             }
        </div>
    )
}

export default Login