const _auth = {
    user:{
        token:null,
        username:"Guest",
        email:null,
        firstname:null,
        lastname:null,
        profileImage:"",
        id:""
    },
    authenticated:false,
    error:{
        err:false,
        type:"",
        message:""
    }
}

const AuthReducer = (state=_auth, action) => {
    const initial_state = state;

    switch(action.type){
        case "active_session":
            return {user:action.payload, authenticated:true, error:_auth.error};

        case "cancel_session":
            return _auth;

        case "cancel_session_with_error":
            return {user:_auth.user, authenticated:false, error:action.error}

        case "active_session_with_error":
            return {user:initial_state.user, authenticated:initial_state.authenticated, error:action.error}

        case "invalidate_error":
            return {user:initial_state.user, authenticated:initial_state.authenticated, error:_auth.error}

        default:
            return initial_state;
    }
}

export default AuthReducer;