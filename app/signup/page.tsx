"use client";

import React from 'react';
import '../styles/globals.css';
import SignUpBtn from "../parts/signUpBtn";

const Login = () => {

    return (
        <div className="login-page-bg">
            <div className="login-page">
                <p>みんなの<br />思い出MAP</p>
                <SignUpBtn />
            </div>
        </div>
    );
}

export default Login;