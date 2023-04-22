import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"

export const useLtp = () => {
    return (str) =>  str.substring(8, str.length);
}

export const useAuth = () => {
    const SERVER_ADDR = "";
    const dispatch = useDispatch();

    return (email, password) => {
        let error = null;
    
        fetch(`${SERVER_ADDR}/api/v1/auth/login`, {
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    email:email,
                    password:password
                })
            }).then(res => res.json())
            .then(res => {
                if(res.error){
                    return dispatch({type:"active_session_with_error", error:{err:true, type:"component-based", message:"Username or password invalid"}});
                }
                localStorage.setItem("refToken", res.token.hash);
                getAcessToken(res);
            }).catch(e => {
                dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:"Can't connect to server"}})
            })
    
    
        const getAcessToken = (login) => {
            fetch(`${SERVER_ADDR}/api/v1/auth/accessToken`, {
                method:"GET",
                headers:{
                    "authorization":"Bearer "+login.token.hash
                }
                }).then(res => res.json()).then(accToken => {
                    if(accToken.error){
                        return dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:"Invalid token"}});
                    }
                    const user = login.user;
                    dispatch({type:"active_session", payload:{token:accToken.accessToken, username:user.username, email:user.email, firstname:user.firstname, lastname:user.lastname, profileImage:user.profileImage, id:user._id} });
                }).catch(e => dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:"Can't connect to server"}}))
        }
    }
}

export const useLogout = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();

    return (retainState=false, loadOut=null) => {
        localStorage.removeItem("refToken");
        dispatch({type:"cancelEm"})
        if(retainState){
            dispatch(loadOut)
        }
        else{
            dispatch({type:"cancel_session"});
            nav("/login");
        }
    }
}