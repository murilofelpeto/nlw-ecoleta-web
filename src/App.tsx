import React from 'react';
import './App.css';

import Routes from './routes';

//JSX --> XML syntax inside javascript
function App() {
    //State --> When we need to store an information from the component, for example a form input
    //States are immutable, because of that we can´t change it's value directly
    // useState returns array [state value, function to update the state value]

    return (
        <Routes />
    );
}

export default App;
