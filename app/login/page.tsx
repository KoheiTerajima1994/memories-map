"use client";

import React from 'react';
import '../styles/globals.css';
import LoginBtn from "../parts/LoginBtn";

const Login = () => {

    return (
        <div className="login-page-bg">
            <div className="login-page">
                <p>みんなの<br />思い出MAP</p>
                <LoginBtn />
            </div>
        </div>
    );

}

export default Login;