"use client";

import { useState, MouseEvent, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/libs/firebase";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function SignUpBtn() {
    // Email,Password入力用
    const [registerEmail, setRegisterEmail] = useState<string>("");
    const [registerPassword, setRegisterPassword] = useState<string>("");

    const router = useRouter();

    // 会員登録ボタン押下後、Firebaseへ登録する処理
    const handleClickSignUp = async (e: MouseEvent<HTMLAnchorElement>) => {
        // aタグ デフォルトの処理を防ぐ
        e.preventDefault();
        try {
            // Email,Password登録
            await createUserWithEmailAndPassword(
                auth,
                registerEmail,
                registerPassword
            );
            router.push("/");
        } catch (error) {
            if(error instanceof FirebaseError) {
                alert("【エラー】パスワードが6文字未満、または、既に登録いただいております。");
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
                <input type="text" id="mail" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
            </div>
            <div className="input-wrapper">
                <label htmlFor="pass">パスワード</label>
                <input type="text" id="pass" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
            </div>
            <div className="login-btn-wrapper">
                <a href="" className="login-btn" onClick={handleClickSignUp}>会員登録</a>
            </div>
            <div className="top-btn-wrapper">
                <Link href="/" className="top-btn">
                    TOPに戻る
                </Link>
            </div>
        </>
    )
}