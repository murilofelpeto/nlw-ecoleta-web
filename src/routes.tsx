import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

//This case we dont need to import index, because react will always search for a index file
import Home from './pages/Home';
import CreatePoint from "./pages/CreatePoint";

//When we use Route component, the react won't match exactly the path, it will match only the first character
//So we need to inform react that the route must be exact
const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact />
            <Route component={CreatePoint} path="/create-point"  />
        </BrowserRouter>
    );
}

export default Routes;