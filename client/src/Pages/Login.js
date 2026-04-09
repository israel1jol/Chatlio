// ...existing code...
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

    const formHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        dispatch({type:"invalidate_error"});
        // call login action; if it returns a promise await it
        try {
            const res = loginUser(email, password);
            if (res && typeof res.then === "function") await res;
        } catch (err) {
            // noop — auth reducer should surface errors
        }
        // do NOT setLoading(false) here — wait for auth update in effect below
    }

    useEffect(() => {
        if(localStorage.getItem("refToken")){
            nav("/");
        }
    }, [nav]);

    // watch auth to stop loader / navigate
    useEffect(() => {
        if(auth.authenticated){
            nav("/");
            return;
        }
        if(auth.error && auth.error.err){
            setLoading(false);
        }
    }, [auth.authenticated, auth.error, nav]);

    useEffect(() => {
        return () => {
            dispatch({type:"invalidate_error"});
            setLoading(false);
        }
    }, [dispatch])

    return (
        <div className="stage">
            { loading ? <SuspenseLoader/> :
            <>
                {auth.error.type==="general-error" && auth.error.err ? <div className={auth.error.type}>{auth.error.message}</div> : <></>}
                <div className="jumbotron">
                    <div className="form-field">
                    <h3>Log in to Chatlio</h3>
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
// ...existing code...