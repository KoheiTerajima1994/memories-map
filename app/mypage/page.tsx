"use client";

import React, { useState, MouseEvent, useEffect } from 'react';
import '../styles/globals.css';
import { useRouter } from "next/navigation";
import { onAuthStateChanged, reauthenticateWithCredential, sendEmailVerification, EmailAuthProvider, verifyBeforeUpdateEmail, updatePassword } from 'firebase/auth';
import { auth } from '@/libs/firebase';
import Link from 'next/link';

const MyPage = () => {
    // ログアウト状態の場合、TOPページに戻る処理
    const router = useRouter();
    useEffect(() => {
        // ログイン状態の変更を検知する
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(!user) {
                router.push('/login');
            }
        });
        return () => unsubscribe();
    },[router]);

    // アドレスを変更させる処理
    // (Firebaseの再認証→メール確認→別処理でFirebaseへ新規メールアドレス登録)

    // Firebaseの再認証、確認メール送信

    const [changeEmail, setChangeEmail] = useState<string>("");
    const [changePassword, setChangePassword] = useState<string>("");
    const [credentialPassword, setCredentialPassword] = useState<string>("");
    const [credentialPassword2, setCredentialPassword2] = useState<string>("");

    const user = auth.currentUser;

    const handleClickSendEmail = async (e: MouseEvent<HTMLAnchorElement>, passElement: string) => {
        // aタグ デフォルトの処理を防ぐ
        e.preventDefault();
        try {
            // 再認証の処理
            const credential = await EmailAuthProvider.credential(
                // userが存在すれば、emailプロパティーにアクセス、パスワードは入力してもらう
                user?.email ?? '',
                passElement,
            )
            user && (await reauthenticateWithCredential(user, credential));
            sendEmailVerificationWrapper(user);
            alert('確認メールを送信しました。');
        } catch (error) {
            alert("【エラー】メールの送信ができませんでした。");
            console.error(error);
        }
    }

    // 古いメールアドレスにメールを送り、認証を求める処理
    const sendEmailVerificationWrapper = async (user: any) => {
        try {
            await sendEmailVerification(user);
        } catch (error) {
            console.error("メール確認の送信に失敗しました。", error);
            throw error;
        }
    }

    // 新しいメールアドレスに変える処理、確認メール送信
    // updateEmailではなく、verifyBeforeUpdateEmailを用いて、メールアドレスを変更
    const handleClickChangeEmail = async (e: MouseEvent<HTMLAnchorElement>) => {
        // aタグ デフォルトの処理を防ぐ
        e.preventDefault();
        if(user) {
            try {
                await verifyBeforeUpdateEmail(user, changeEmail);
                alert('新しいメールアドレスへ確認メールを送信しました。');
            } catch (error) {
                alert("【エラー】アドレスの変更ができませんでした。");
                console.error(error);
            }
        }
    }

    // 新しいパスワードの変える処理
    const handleClickChangePassword = async (e: MouseEvent<HTMLAnchorElement>) => {
        // aタグ デフォルトの処理を防ぐ
        e.preventDefault();
        if(user) {
            try {
                await updatePassword(user, changePassword);
                alert(`パスワードの変更ができました。新しいパスワードは【${changePassword}】です。`)
            } catch (error) {
                alert("【エラー】パスワードの変更ができませんでした。");
                console.error(error);
            }
        }
    }

    return (
        <div className="login-page-bg">
            <div className="login-page">
                <p>みんなの<br />思い出MAP</p>
                <div>
                    {/* <div className="input-wrapper">
                        <label htmlFor="accountNameChange">アカウント名変更</label>
                        <input type="text" id="accountNameChange" />
                    </div>
                    <div className="login-btn-wrapper">
                        <a href="" className="login-btn">アカウント名変更</a>
                    </div> */}
                    <p>登録メールアドレス変更</p>
                    <div className="input-wrapper">
                        <label htmlFor="passwordChange">1,パスワード入力</label>
                        <input type="text" id="passwordChange" value={credentialPassword} onChange={(e) => setCredentialPassword(e.target.value)} />
                    </div>
                    <div className="login-btn-wrapper">
                        <a href="" className="login-btn" onClick={(e) => handleClickSendEmail(e, credentialPassword)}>確認メール送信</a>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="mailChange">2,新しいメールアドレス</label>
                        <input type="text" id="mailChange" value={changeEmail} onChange={(e) => setChangeEmail(e.target.value)} />
                    </div>
                    <div className="login-btn-wrapper">
                        <a href="" className="login-btn" onClick={handleClickChangeEmail}>メールアドレス変更</a>
                    </div>
                    <br /><br />
                    <p>パスワード変更</p>
                    <div className="input-wrapper">
                        <label htmlFor="passwordChange">1,パスワード入力</label>
                        <input type="text" id="passwordChange" value={credentialPassword2} onChange={(e) => setCredentialPassword2(e.target.value)} />
                    </div>
                    <div className="login-btn-wrapper">
                        <a href="" className="login-btn" onClick={(e) => handleClickSendEmail(e, credentialPassword2)}>確認メール送信</a>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="mailChange">2,新しいパスワード</label>
                        <input type="text" id="mailChange" value={changePassword} onChange={(e) => setChangePassword(e.target.value)} />
                    </div>
                    <div className="login-btn-wrapper">
                        <a href="" className="login-btn" onClick={handleClickChangePassword}>パスワード変更</a>
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