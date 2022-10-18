import { Link } from 'react-router-dom'


const Public = () => {

    const content = (

        <section className="public">

            <header>
                <h1 style={{ textAlign: 'center' }}> Welcome to, <span className="nowrap"> Agent's Company RMS </span></h1>
            </header>

            <main className="public__main">

                <p style={{ textAlign: 'center' }}> Located in : Kathmandu, Nepal.</p>

                <address className="public__addr">
                    Ghattekulo, Dillibazar<br />
                    <br />
                    <a href="9899400000">Contact : 9899400000</a>
                </address>
                <br />
                <p style={{ textAlign: 'center' }}> Ownership: 47 Group</p>

            </main>

            <footer style={{ textAlign: 'center', fontSize: '1.7rem' }}>
                <Link to="/login" style={{ color: '#00b359', fontWeight: 'bold' }}>Employee Login</Link>
            </footer>

        </section>

    )


    return content
}


export default Public