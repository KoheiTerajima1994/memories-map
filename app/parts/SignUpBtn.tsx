"use client";

import { useState, MouseEvent, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { auth } from "@/libs/firebase";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';

export default function SignUpBtn() {
    // Email,Password,Name入力用
    const [registerEmail, setRegisterEmail] = useState<string>("");
    const [registerPassword, setRegisterPassword] = useState<string>("");
    const [registerAccountName, setRegisterAccountName] = useState<string>("");

    const router = useRouter();

    // 会員登録ボタン押下後、Firebaseへ登録する処理
    const handleClickSignUp = async (e: MouseEvent<HTMLAnchorElement>) => {
        // aタグ デフォルトの処理を防ぐ
        e.preventDefault();
        try {
            // Email,Password登録
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                registerEmail,
                registerPassword
            );
            await updateProfile(userCredential.user, {
                displayName: registerAccountName,
            });
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
    }, [router]);

    return (
        <div className="login-page-bg color-white">
            <div className="header d-f jc-sb ai-c w-95 mx-a py-2p">
                <Link href="/" className="sub-logo">
                    <Image src="/images/sub-logo.png" alt="Logo Icon" width={100} height={100} />
                </Link>
                <Link href="/" className="top-btn">TOPに戻る</Link>
            </div>
            <div className="w-30 mx-a">
                <p className="fz-m">会員登録ページ</p>
                <div>
                    <label htmlFor="mail" className="fz-m ta-c">メールアドレス</label>
                    <input type="text" id="mail" className="w-100 bd-rd-s bd-n fz-m" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                </div>
                <div className="mt-5p">
                    <label htmlFor="pass" className="fz-m ta-c">パスワード</label>
                    <input type="text" id="pass" className="w-100 bd-rd-s bd-n fz-m" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                </div>
                <div className="mt-5p">
                    <label htmlFor="name" className="fz-m ta-c">アカウント名</label>
                    <input type="text" id="name" className="w-100 bd-rd-s bd-n fz-m" value={registerAccountName} onChange={(e) => setRegisterAccountName(e.target.value)} />
                </div>
                <div className="login-btn-wrapper mt-5p">
                    <a href="" className="img-uploader-blue-btn w-70 py-3p" onClick={handleClickSignUp}>会員登録</a>
                </div>
            </div>
        </div>
    )
}