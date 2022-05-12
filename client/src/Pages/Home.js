import React, {useState} from "react";
import { FaLongArrowAltUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
    const [showPanel, setShowPanel] = useState(false);
    const auth = useSelector(store => store.auth);

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

    return (
        <div className="fluid-container">
            {auth.error.type==="general-error" ? <div className={auth.error.type}>{auth.error.message}</div> : <></>}
            <header className="home-header">
                <div className="heading">
                    <h3>Chat with anyone, anywhere. With Chatify.</h3>
                </div>
                <div className="illustration">
                    <img src="https://i.postimg.cc/3xKRh3vc/vecteezy-people-working-and-meeting-illustration.jpg" alt="image" className="home-header-img"/>
                    <p className="lead">Connect with friends and family with the tap of a button</p>
                </div>
                { auth.authenticated && auth.user.profileImage === "" ? <Link to="/register" className="simple-btn simple-btn-primary">Finish registration</Link> : <></> }
            </header>

            <button className="toggler" onClick={toggle}> <FaLongArrowAltUp size="30" color="grey" /> </button>

            
            <div className="panel">
                <main>
                    <section className="panel-box-alpha">
                        <img src="https://i.postimg.cc/5tLk9QX8/2292-R0l-VIEFOTi-Aw-NTYt-MTA4.jpg" alt="image1" />
                        <p>
                            Connect with your friends with their unique ID to start interacting with them.
                        </p>
                        { auth.user.username === "Guest" ? <div><Link to="/register" className="panel-btn">Sign up to get started</Link></div> : <span>Your Id is <em>{auth.user.id}</em></span> }
                    </section>
                    <section className="panel-box-beta">
                        <img src="https://i.postimg.cc/RFTsKrQF/People-Talking-Illustration.jpg" alt="image2" />
                        { auth.user.username === "Guest" ? <></> : <div><Link to="/explore" className="panel-btn">Explore</Link></div> }
                        <p>
                            Your privacy matters, therefore end-to-end encryption will soon be available to the app very soon.
                        </p>
                    </section>
                </main>
            </div>
            
        </div>
    )
}

export default Home