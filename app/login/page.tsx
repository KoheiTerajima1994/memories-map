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
                <div className="input-wrapper">
                    <label htmlFor="mail">メールアドレス</label>
                    <input type="text" id="mail" />
                </div>
                <div className="input-wrapper">
                    <label htmlFor="pass">パスワード</label>
                    <input type="text" id="pass" />
                </div>
                <div className="login-btn-wrapper">
                    <a href="" className="login-btn">ログイン</a>
                </div>
                <div className="top-btn-wrapper">
                    <a href="">TOPに戻る</a>
                </div>
            </div>
        </div>
    );

}

export default Login;