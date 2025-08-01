import { useLocation, useNavigate } from 'react-router-dom';
import {Menu, MenuItem, IconButton} from '@mui/material';
import {useState, useEffect} from 'react';
import "./HomePage.css"
import fullLogo from "../../assets/logo/fullLogo.png";
import nathan from "../../assets/portraits/nathan.jpg";
import jackie from "../../assets/portraits/jackie.jpg";
import taliyah from "../../assets/portraits/taliyah.jpg"


function HomePage(){

    const location = useLocation();
    const hideSidebar = location.pathname === '/home';
    const [activeTab, setActiveTab] = useState('home');
    const navigate = useNavigate();

    useEffect(() => {
    const homeSection = document.getElementById('homeHome');
    if (homeSection) {
        homeSection.scrollIntoView({ behavior: 'smooth' });
    }
    }, []);

    const imageMap = {
        discovery: nathan,
        summarization: jackie,
        filtering: jackie,
        protocol: nathan,
    };
    const [activeImage, setActiveImage] = useState(imageMap.discovery);
    const [activeFeature, setActiveFeature] = useState('discovery');


    return (
        <>
        <div className="home-container">
        {!hideSidebar && <Sidebar />}
        <div id = "homeMenu">
                <div
                    className = "homeTab"
                    onClick={() => {
                        setActiveTab('home')
                        document.getElementById('homeHome').scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                        backgroundColor: activeTab === 'home' ? '#daa7e2' : 'transparent',
                        color: activeTab === 'home' ? "black" : "white",
                        transition: 'background-color 0.3s ease',
                    }}
                >Home</div>
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
                        setActiveTab('features')
                        document.getElementById('homeFeatures').scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                        backgroundColor: activeTab === 'features' ? '#daa7e2' : 'transparent',
                        color: activeTab === 'features' ? "black" : "white",
                        transition: 'background-color 0.3s ease',
                    }}
                >Features</div>
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

        <div className="mobileTop">
            <div className="lilLogo">
                <img src={fullLogo} />
            </div>
            <div id="loginSignup">
                <button onClick = {() => navigate('/signup')}
                >Login/Signup
                </button>
            </div>
        </div>

        <section id = "homeHome">
        </section>
        {/* <div className = "homeLogo">
            <img src = {fullLogo}/>
        </div> */}
        <section id = "homeAbout">
            <div className="about-grid">
            
            <div className="top-left">
                <h1>Our Mission</h1>
            </div>
            <div className="top-right">
                <p>
                    We aim to help university students confidently dive into open source by surfacing projects that are active, clear, and aligned with their goals. Ultimately, early developers are able to truly "commit to what matters".
                </p>
            </div>
        </div>
        <hr className = "aboutLine"/>
        <div className="about-grid" id = "homeWHY">
            <div className="bottom-right">
                <h1>Why Branch Out?</h1>
            </div>
            <div className="bottom-left">
                <p>
                    Open source is powerful — but hard to break into. As students, we were overwhelmed trying to find projects that made sense, felt welcoming, or matched what we were learning.
                    <br />
                    <br />
                    So we built the platform we wish we had: A space that makes discovering and contributing to open source simple, relevant, and beginner-friendly.
                </p>
            </div>
        </div>
        <hr className = "aboutLine"/>

        </section>
        {/* <section id = "homeWhy"> */}

        {/* </section> */}
        <section id = "homeFeatures">

             <div className="features-container">
                <div className="features-header">
                    <h1>Helping You Branch Out, 
                    One Repo at a Time</h1>
                    <p>
                    Branchout helps students and new developers find open-source projects they'll actually want to contribute to—through personalized discovery, AI-generated summaries, and context-aware recommendations that make GitHub more accessible, intuitive, and fun.
                    </p>
                </div>


                <div className="features-split-container">
                    <img src={activeImage} alt="Feature Preview" className="features-image" />
                    <div className="features-grid">
                        <div
                            className={`feature-card ${activeFeature === 'discovery' ? 'highlight' : ''}`}
                            onClick={() => {
                                setActiveImage(imageMap.discovery);
                                setActiveFeature('discovery');
                            }}
                        >
                            <h3>Swipe-Based Discovery</h3>
                            <p>Explore open-source projects through a personalized, swipeable interface based on your interests and skill level.</p>
                        </div>

                        <div
                            className={`feature-card ${activeFeature === 'summarization' ? 'highlight' : ''}`}

                            onClick={() => {
                                setActiveImage(imageMap.summarization);
                                setActiveFeature('summarization');
                            }}
                        >
                            <h3>AI Generated Summaries</h3>
                            <p>Get clear, concise overviews of GitHub repositories using large language models to save time and improve understanding.</p>
                        </div>

                        <div
                            className={`feature-card ${activeFeature === 'filtering' ? 'highlight' : ''}`}
                            onClick={() => {
                                setActiveImage(imageMap.filtering);
                                setActiveFeature('filtering');
                            }}
                        >
                            <h3>Repo Feedback Filtering</h3>
                            <p>Refine your recommendations by marking projects as too easy, too complex, or irrelevant for smarter future suggestions.</p>
                        </div>

                        <div
                            className={`feature-card ${activeFeature === 'protocol' ? 'highlight' : ''}`}
                            onClick={() => {
                                setActiveImage(imageMap.protocol);
                                setActiveFeature('protocol');
                            }}
                        >
                            <h3>Model Context Protocol</h3>
                            <p>Ensure accurate AI recommendations by dynamically passing relevant user preferences and context into every model call.</p>
                        </div>
                    </div>
                </div>
                </div>
        </section>
        <hr className = "aboutLine"/>

        <section id = "homeFounders">
             <div className = "meetFounders">Meet the Founders</div>
                    <div className = "founderContent">
                        <a href = "https://www.linkedin.com/in/jackiejurado" target = "_blank">
                        <div className = "jackie">
                            <img src = {jackie} alt = "Jackie's Portrait"></img>
                            <h2>Jaqueline Jurado</h2>
                            <p>CS @ UF</p>
                        </div>
                        </a>
                        <div className = "nathan">
                            <a href = "https://www.linkedin.com/in/nathan-kenmognie-5541a4291" target = "_blank">
                            <img src = {nathan} alt = "Nathan's Portrait"></img>
                            <h2>Nathan Kenmognie</h2>
                            <p>CS @ UT San Antonio</p>
                             </a>
                        </div>
                        <div className = "taliyah">
                            <a href = "https://www.linkedin.com/in/taliyah-harvey" target = "_blank">
                            <img src = {taliyah} alt = "Taliyah's Portrait"></img>
                            <h2>Taliyah Harvey</h2>
                            <p>CS @ USC</p>
                            </a>
                        </div>
                    </div>
        </section>
        </div>
        </>
    );
}
export default HomePage;