"use client";

import React, { useState, MouseEvent, useEffect } from 'react';
import '../styles/globals.css';
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/libs/firebase';
import { FirebaseError } from 'firebase/app';
import Link from 'next/link';

const MyPage = () => {
    // TOPページに戻る用
    const router = useRouter();
    const [registerUserName, setRegisterUserName] = useState<string>("");

    useEffect(() => {
        // ログイン状態の変更を検知する
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(!user) {
                router.push('/login');
            }
        },[router]);

        return () => unsubscribe();
    })

    const handleRegisterUserName = async () => {
        try {
            const user = auth.currentUser;
            if(!user) {
                alert('ログインしていません。');
                return;
            }
            await updateProfile(user, {
                displayName: registerUserName,
            });
            alert('アカウント名が設定されました。');
        } catch(error) {
            alert('エラーが発生しました。');
            console.error(error);
        }
    }

    return (
        <div className="login-page-bg">
            <div className="login-page">
                <p>みんなの<br />思い出MAP</p>
                <div style={{display: "flex"}}> 
                    <div>
                        <div className="input-wrapper">
                            <label htmlFor="accountName">アカウント名登録</label>
                            <input type="text" id="accountName" value={registerUserName} onChange={(e) => setRegisterUserName(e.target.value)} />
                        </div>
                        <div className="login-btn-wrapper">
                            <a href="" className="login-btn" onClick={handleRegisterUserName}>アカウント名登録</a>
                        </div>
                    </div>
                    <div>
                        <div className="input-wrapper">
                            <label htmlFor="accountNameChange">アカウント名変更</label>
                            <input type="text" id="accountNameChange" />
                        </div>
                        <div className="login-btn-wrapper">
                            <a href="" className="login-btn">アカウント名変更</a>
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="mailChange">メールアドレス変更</label>
                            <input type="text" id="mailChange" />
                        </div>
                        <div className="login-btn-wrapper">
                            <a href="" className="login-btn">メールアドレス変更</a>
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="passwordChange">パスワード変更</label>
                            <input type="text" id="passwordChange" />
                        </div>
                        <div className="login-btn-wrapper">
                            <a href="" className="login-btn">パスワード変更</a>
                        </div>
                    </div>
                </div>
                <div className="top-btn-wrapper">
                    <Link href="/" className="top-btn">
                        TOPに戻る
                    </Link>
                </div>
            </div>
        </div>
    );

}

export default MyPage;