import React from 'react';
import {FiLogIn} from 'react-icons/fi'
import {Link} from 'react-router-dom' // This component we use for SPA application, so our app doesnt need to reload the entire application every time we click in a link

import logo from '../../assets/logo.svg';
import './styles.css';

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"/>
                </header>

                <main>
                    <h1>Seu marketplace de coleta de residuos</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</p>
                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
};

export default Home;