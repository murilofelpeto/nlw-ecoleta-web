import React from 'react';

interface HeaderProps {
    //? means that is optional
    title: string;
}

//{} -> means that we are inserting props into html

const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header>
            <h1>{props.title}</h1>
        </header>
    );
}

export default Header;