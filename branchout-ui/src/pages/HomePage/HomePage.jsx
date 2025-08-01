import { useLocation } from 'react-router-dom';
import { useMediaQuery, Menu, MenuItem, IconButton} from '@mui/material';
import {useState} from 'react';
import "./HomePage.css"
import fullLogo from "../../assets/logo/fullLogo.png";

function HomePage(){

    const location = useLocation();
    const hideSidebar = location.pathname === '/home';
    const [activeTab, setActiveTab] = useState('');


    return (
        <>
        <div className="home-container">
        {!hideSidebar && <Sidebar />}
        <div id = "homeMenu">
                <div
                    className = "homeTab"
                    onClick={() => {
                        setActiveTab('about')
                        document.getElementById('homeAbout').scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                        backgroundColor: activeTab === 'about' ? '#daa7e2' : 'transparent',
                        color: activeTab === 'about' ? "black" : "white",
                        transition: 'background-color 0.3s ease',
                    }}
                >About</div>
                <div
                    className = "homeTab"
                    onClick={() => {
                        setActiveTab('why')
                        document.getElementById('homeWhy').scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                        backgroundColor: activeTab === 'why' ? '#daa7e2' : 'transparent',
                        color: activeTab === 'why' ? "black" : "white",
                        transition: 'background-color 0.3s ease',
                    }}
                >Why</div>
                <div
                    className = "homeTab"
                    onClick={() => {
                        setActiveTab('founders')
                        document.getElementById('homeFounders').scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                        backgroundColor: activeTab === 'founders' ? '#daa7e2' : 'transparent',
                        color: activeTab === 'founders' ? "black" : "white",
                        transition: 'background-color 0.3s ease',
                    }}
                >Founders</div>
        </div>
        <div id = "loginSignup">
            <button>
                Login/Signup
            </button>
        </div>

        <div className = "homeLogo">
            <img src = {fullLogo}/>
        </div>
        <section id = "homeAbout">

        </section>
        <section id = "homeWhy">

        </section>
        <section id = "homeFounders">

        </section>
        <section id = "homeCommit">

        </section>
        </div>
        </>
    );
}
export default HomePage;