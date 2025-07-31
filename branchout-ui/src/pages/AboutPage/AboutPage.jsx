import "./AboutPage.css"
import jackie from "../../assets/portraits/jackie.jpg"
import nathan from "../../assets/portraits/nathan.jpg"
import taliyah from "../../assets/portraits/taliyah.jpg"

function AboutPage() {
    return(
        <>
        <div className="about-grid">
            
            <div className="top-left">
                <h1>our mission</h1>
            </div>
            <div className="top-right">
                <p>
                    We aim to help university students confidently dive into open source by surfacing projects that are active, clear, and aligned with their goals. Ultimately, early developers are able to truly "commit to what matters".
                </p>
            </div>
        </div>
        <hr className = "aboutLine"/>
        <div className="about-grid">
            <div className="bottom-right">
                <h1>why branch out?</h1>
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
        <div className = "meetFounders">meet the founders</div>
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
        </>
    )
}

export default AboutPage;