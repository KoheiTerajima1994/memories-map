"use client";

import React, { useState, MouseEvent, useEffect } from 'react';
import '../styles/globals.css';
import { useRouter } from "next/navigation";
import { onAuthStateChanged, sendEmailVerification, updateEmail } from 'firebase/auth';
import { auth } from '@/libs/firebase';
import { FirebaseError } from 'firebase/app';
import Link from 'next/link';

const MyPage = () => {
    // TOPページに戻る処理
    const router = useRouter();
    useEffect(() => {
        // ログイン状態の変更を検知する
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(!user) {
                router.push('/login');
            }
        });
        return () => unsubscribe();
    },[]);

    // アドレスを変更する処理
    const [changeEmail, setChangeEmail] = useState<string>("");

    const handleClickChangeEmail = async (e: MouseEvent<HTMLAnchorElement>) => {
        // aタグ デフォルトの処理を防ぐ
        e.preventDefault();
        try {
            updateEmail(auth.currentUser, changeEmail);

        // 新しいメールアドレスにメール確認を送信
        const user = auth.currentUser;
        await sendEmailVerification(user);

        // ユーザーにメールの確認を促す
        alert("メールを確認してください。");
        } catch (error) {
            alert("【エラー】アドレスの変更ができませんでした。");
            console.error(error);
        }
    }

    // 新しいメールアドレスに対してメール確認を送信する関数
const sendEmailVerification = async (user: User) => {
    try {
        await sendEmailVerification(user.auth);
    } catch (error) {
        console.error("メール確認の送信に失敗しました。", error);
        throw error;
    }
}




// // const auth = getAuth();
// updateEmail(auth.currentUser, "user@example.com").then(() => {
//   // Email updated!
//   // ...
// }).catch((error) => {
//   // An error occurred
//   // ...
// });


    return (
        <div className="login-page-bg">
            <div className="login-page">
                <p>みんなの<br />思い出MAP</p>
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
                        <input type="text" id="mailChange" value={changeEmail} onChange={(e) => setChangeEmail(e.target.value)} />
                    </div>
                    <div className="login-btn-wrapper">
                        <a href="" className="login-btn" onClick={handleClickChangeEmail}>メールアドレス変更</a>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="passwordChange">パスワード変更</label>
                        <input type="text" id="passwordChange" />
                    </div>
                    <div className="login-btn-wrapper">
                        <a href="" className="login-btn">パスワード変更</a>
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