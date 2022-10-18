import { useNavigate, useLocation } from 'react-router-dom'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"

import useAuth from "../hooks/useAuth"


const DashFooter = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const { username, status } = useAuth()          

    const onGoHomeClicked = () => navigate('/dash')

    
    let goHomeButton = null                          
    if (pathname !== '/dash') {                 

        goHomeButton = (
            <button
                className="dash-footer__button icon-button"
                title="Home"
                onClick={onGoHomeClicked}        
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        )
    }

    const content = (
        <footer className="dash-footer">

            {goHomeButton}
            
            <p style={{ fontSize: '1.3rem' }}>Current User: {username} </p>
            <p style={{ fontSize: '1.3rem' }}>Status: {status} </p>

        </footer>
    )

    return content

}


export default DashFooter
