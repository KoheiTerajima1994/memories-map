"use client";

import React from 'react';
import '../styles/globals.css';

const Login = () => {

    return (
        <div className="login-page-bg">
            <div className="login-page">
                <p>みんなの<br />思い出MAP</p>
                <div className="input-wrapper">
                    <label htmlFor="mail">メールアドレス</label>
                    <input type="text" id="mail" />
                </div>
                <div className="input-wrapper">
                    <label htmlFor="pass">パスワード</label>
                    <input type="text" id="pass" />
                </div>
            </div>
        </div>
    );

}

export default Login;