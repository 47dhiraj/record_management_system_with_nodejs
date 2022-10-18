import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
    faRightFromBracket                                                  
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from 'react-router-dom'

import { useSendLogoutMutation } from '../features/auth/authApiSlice'

import useAuth from '../hooks/useAuth'


const DASH_REGEX = /^\/dash(\/)?$/
const RECORDS_REGEX = /^\/dash\/records(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/


const DashHeader = () => {

    const { isManager, isAdmin } = useAuth()    

    const navigate = useNavigate()             

    const { pathname } = useLocation()        

    const [sendLogout, {                        
        isLoading,
        isSuccess,
        isError,
        error

    }] = useSendLogoutMutation()                


    useEffect(() => {
        if (isSuccess) navigate('/')            
    }, [isSuccess, navigate])

    const onRecordsClicked = () => navigate('/dash/records')
    const onNewRecordClicked = () => navigate('/dash/records/new')

    const onUsersClicked = () => navigate('/dash/users')
    const onNewUserClicked = () => navigate('/dash/users/new')


    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !RECORDS_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small"
    }

    let newRecordButton = null
    if (RECORDS_REGEX.test(pathname))                  
    {
        newRecordButton = (
            <button
                className="icon-button"
                title="New Record"
                onClick={onNewRecordClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }

    let newUserButton = null
    if (USERS_REGEX.test(pathname))                            
    {
        newUserButton = (
            <button
                className="icon-button"
                title="New User"
                onClick={onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        )
    }

    let userButton = null
    if (isManager || isAdmin)                           
    {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) 
        {
            userButton = (
                <button
                    className="icon-button"
                    title="Users"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            )
        }
    }

    let recordsButton = null
    if (!RECORDS_REGEX.test(pathname) && pathname.includes('/dash'))    
    {
        recordsButton = (
            <button
                className="icon-button"
                title="Records"
                onClick={onRecordsClicked}
            >
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        )
    }

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    const errClass = isError ? "errmsg" : "offscreen"

    let buttonContent
    if (isLoading) {
        buttonContent = <p>Logging Out...</p>
    } else {
        buttonContent = (
            <>
                {newRecordButton}
                {newUserButton}
                {recordsButton}
                {userButton}
                {logoutButton}
            </>
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className="dash-header">
                <div className={`dash-header__container ${dashClass}`}>
                    <Link to="/dash">
                        <h1 className="dash-header__title">Records Managements System</h1>
                    </Link>
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    )

    return content
}
export default DashHeader