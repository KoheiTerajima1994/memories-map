"use client";

import React from 'react';
import '../styles/globals.css';

const Login = () => {

    return (
        <div className="login-page-bg">
            <div className="login-page">
                <p>みんなの<br />思い出MAP</p>
                <div>
                    <label htmlFor="mail">メールアドレス</label>
                    <input type="text" id="mail" />
                </div>
            </div>
        </div>
    );

}

export default Login;