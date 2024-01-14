"use client";

import { useState, MouseEvent, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "@/libs/firebase";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function LoginBtn() {
    // Email,Password入力用
    const [loginEmail, setLoginEmail] = useState<string>("");
    const [loginPassword, setLoginPassword] = useState<string>("");

    const router = useRouter();

    const handleClickLogin = async (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            router.push("/");
        } catch (error) {
            if(error instanceof FirebaseError) {
                alert("メールアドレスまたはパスワードが間違っています");
                console.error(error);
            }
        }
    }

    // ログインしているか否かを判定する処理→ログイン状態ならば、TOPページへ遷移
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if(currentUser) {
                setUser(currentUser);
                router.push("/");
            }
        });
    }, []);

    return (
        <>
            <div className="input-wrapper">
                <label htmlFor="mail">メールアドレス</label>
                <input type="text" id="mail" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div className="input-wrapper">
                <label htmlFor="pass">パスワード</label>
                <input type="text" id="pass" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            </div>
            <div className="login-btn-wrapper">
                <a href="" className="login-btn" onClick={handleClickLogin}>ログイン</a>
            </div>
            <div className="top-btn-wrapper">
                <Link href="/" className="top-btn">
                    TOPに戻る
                </Link>
            </div>
        </>
    )
}