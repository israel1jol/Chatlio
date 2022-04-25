import React, {useState} from "react";
import { FaLongArrowAltUp } from "react-icons/fa";

const Home = () => {
    const [showPanel, setShowPanel] = useState(false);


    const toggle = () => {
        const panel = document.querySelector(".panel");
        const btn = document.querySelector(".toggler");
        if(showPanel){
            panel.classList.remove("open");
            btn.classList.remove("open");
            setShowPanel(prev => !prev);
            return;
        }
        panel.classList.add("open");
        btn.classList.add("open");
        setShowPanel(prev => !prev);
    }

    console.log(showPanel);
    return (
        <div className="fluid-container">
            <div className="home-header">
                <div className="heading">
                    <h3>Chat with anyone, anywhere. With Chatify.</h3>
                </div>
                <div className="illustration">
                    <img src="https://i.postimg.cc/3xKRh3vc/vecteezy-people-working-and-meeting-illustration.jpg" alt="image" className="home-header-img"/>
                    <p className="lead">Connect with friends and family with the tap of a button</p>
                </div>
            </div>

            <button className="toggler" onClick={toggle}> <FaLongArrowAltUp size="30" color="grey" /> </button>

            
            <div className="panel">
                <main>

                </main>
            </div>
            
        </div>
    )
}

export default Home