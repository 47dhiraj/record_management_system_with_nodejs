import { Link } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

import useTitle from '../../hooks/useTitle'


const Welcome = () => {

    useTitle('RMS: Welcome ! ')

    const { username, isManager, isAdmin } = useAuth()      

    const date = new Date()                                 
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const content = (
        <>
            <p style={{ textAlign: 'end' }}>{today}</p>

            <section className="welcome">

                <h1>Welcome {username} ! </h1>

                <p><Link to="/dash/records"> View Records </Link></p>
                <p><Link to="/dash/records/new"> Add New Record </Link></p>

                {(isManager || isAdmin) &&
                    <p><Link to="/dash/users"> View UserLists </Link></p>
                }

                {(isManager || isAdmin) &&
                    <p><Link to="/dash/users/new"> Add New User </Link></p>
                }

            </section>
        </>

    )

    return content

}


export default Welcome