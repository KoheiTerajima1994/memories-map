"use client";

import React, { useState, MouseEvent, useEffect } from 'react';
import '../styles/globals.css';
import { useRouter } from "next/navigation";
import { onAuthStateChanged, reauthenticateWithCredential, sendEmailVerification, EmailAuthProvider, verifyBeforeUpdateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { auth } from '@/libs/firebase';
import Link from 'next/link';
import Image from 'next/image';

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
    },[]);

    // アドレスを変更させる処理
    // (Firebaseの再認証→メール確認→別処理でFirebaseへ新規メールアドレス登録)

    // Firebaseの再認証、確認メール送信

    const [changeEmail, setChangeEmail] = useState<string>("");
    const [changePassword, setChangePassword] = useState<string>("");
    const [credentialPassword, setCredentialPassword] = useState<string>("");
    const [credentialPassword2, setCredentialPassword2] = useState<string>("");
    const [changeAccountName, setChangeAccountName] = useState<string>("");

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

    // アカウント名の変更処理
    const handleClickChangeAccountName = async (e: MouseEvent<HTMLAnchorElement>) => {
        // aタグ デフォルトの処理を防ぐ
        e.preventDefault();
        if(user) {
            try {
                updateProfile(user, { displayName: changeAccountName})
                alert(`アカウント名が変更されました。新しいアカウント名は【${changeAccountName}】です。`);
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className="login-page-bg color-white">
            <div className="header d-f jc-sb ai-c w-95 mx-a py-2p">
                <Link href="/" className="sub-logo">
                    <Image src="/images/sub-logo.png" alt="Logo Icon" width={100} height={100} />
                </Link>
                <Link href="/" className="top-btn">TOPに戻る</Link>
            </div>
            <div className="d-f jc-sa">
                <div className="w-20">
                    <p className="fz-m ta-c">アカウント名変更</p>
                    <div>
                        <label htmlFor="accountNameChange" className="d-b">新アカウント名を入力</label>
                        <input type="text" id="accountNameChange" className="w-100 bd-rd-s bd-n fz-m" onChange={(e) => setChangeAccountName(e.target.value)} />
                    </div>
                    <div className="login-btn-wrapper mt-5p">
                        <a href="" className="img-uploader-blue-btn w-70 py-3p" onClick={handleClickChangeAccountName}>アカウント名変更</a>
                    </div>
                </div>
                <div className="w-20">
                    <p className="fz-m ta-c">登録メールアドレス変更</p>
                    <div>
                        <label htmlFor="passwordChange" className="d-b">1,パスワード入力</label>
                        <input type="text" id="passwordChange" className="w-100 bd-rd-s bd-n fz-m" value={credentialPassword} onChange={(e) => setCredentialPassword(e.target.value)} />
                    </div>
                    <div className="login-btn-wrapper mt-5p">
                        <a href="" className="img-uploader-blue-btn w-70 py-3p" onClick={(e) => handleClickSendEmail(e, credentialPassword)}>確認メール送信</a>
                    </div>
                    <div className="mt-10p">
                        <label htmlFor="mailChange" className="d-b">2,新しいメールアドレス</label>
                        <input type="text" id="mailChange" className="w-100 bd-rd-s bd-n fz-m" value={changeEmail} onChange={(e) => setChangeEmail(e.target.value)} />
                    </div>
                    <div className="login-btn-wrapper mt-5p">
                        <a href="" className="img-uploader-blue-btn w-70 py-3p" onClick={handleClickChangeEmail}>メールアドレス変更</a>
                    </div>
                </div>
                <div className="w-20">
                    <p className="fz-m ta-c">パスワード変更</p>
                    <div>
                        <label htmlFor="passwordChange" className="d-b">1,パスワード入力</label>
                        <input type="text" id="passwordChange" className="w-100 bd-rd-s bd-n fz-m" value={credentialPassword2} onChange={(e) => setCredentialPassword2(e.target.value)} />
                    </div>
                    <div className="login-btn-wrapper mt-5p">
                        <a href="" className="img-uploader-blue-btn w-70 py-3p" onClick={(e) => handleClickSendEmail(e, credentialPassword2)}>確認メール送信</a>
                    </div>
                    <div className="mt-10p">
                        <label htmlFor="mailChange" className="d-b">2,新しいパスワード</label>
                        <input type="text" id="mailChange" className="w-100 bd-rd-s bd-n fz-m" value={changePassword} onChange={(e) => setChangePassword(e.target.value)} />
                    </div>
                    <div className="login-btn-wrapper mt-5p">
                        <a href="" className="img-uploader-blue-btn w-70 py-3p" onClick={handleClickChangePassword}>パスワード変更</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPage;