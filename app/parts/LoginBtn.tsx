"use client";

import { useState, MouseEvent, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "@/libs/firebase";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';

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
        <div className="login-page-bg color-white">
            <div className="header d-f jc-sb ai-c w-95 mx-a py-2p">
                <Link href="/" className="sub-logo">
                    <Image src="/images/sub-logo.png" alt="Logo Icon" width={100} height={100} />
                </Link>
                <Link href="/" className="top-btn">TOPに戻る</Link>
            </div>

            <div className="w-30 mx-a">
                <p className="fz-m">ログインページ</p>
                <div>
                    <label htmlFor="mail" className="fz-m ta-c">メールアドレス</label>
                    <input type="text" id="mail" className="w-100 bd-rd-s bd-n fz-m" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>
                <div className="mt-5p">
                    <label htmlFor="pass" className="fz-m ta-c">パスワード</label>
                    <input type="text" id="pass" className="w-100 bd-rd-s bd-n fz-m" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>
                <div className="login-btn-wrapper mt-5p">
                    <a href="" className="img-uploader-blue-btn w-70 py-3p" onClick={handleClickLogin}>ログイン</a>
                </div>
            </div>
        </div>
    )
}