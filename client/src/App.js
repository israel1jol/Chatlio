import React from "react";
import "./scss/main.scss";
import Views from "./Views";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import ChatReducer from "./Provider/ChatProvider/ChatReducer";
import AuthReducer from "./Provider/AuthProvider/AuthReducer";

const App = () => {
    const appReducer = combineReducers({auth:AuthReducer, chat:ChatReducer});

    const store = configureStore({
        reducer:appReducer
    });
    
    return (
        <Provider store={store}>
            <div className="App">
                <Views />
            </div>
        </Provider>
    )
}

export default App;