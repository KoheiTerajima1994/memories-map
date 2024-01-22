"use client";

import { MouseEvent } from "react";
import { auth } from "@/libs/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

export default function LogoutBtn() {
    const router = useRouter();

    const handleClickLogout = async (e: MouseEvent<HTMLAnchorElement>) => {
        try {
            await signOut(auth);
            router.push("/");
        } catch(error) {
            if(error instanceof FirebaseError) {
                console.error(error);
            }
        }
    };

    return (
        <>
            <div className="logout-btn-wrapper">
                <a href="" className="under-line-btn" onClick={handleClickLogout}>ログアウト</a>
            </div>
        </>
    )
}