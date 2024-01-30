"use client";

import { useEffect, useState } from 'react';
import { auth } from '@/libs/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

export default function AuthStatus() {

    // ログインしているか否かを判定する処理→ログイン状態ならば、top-under-menuとアカウント名を表示
    const [isUnderMenuActive, setIsUnderMenuActive] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState<string>("");

    // アカウント名の取得
    const accountNameAcquisition = () => {
        const accountName: any = auth.currentUser;
        setName(accountName.displayName);
    }

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if(currentUser) {
                setUser(currentUser);
                setIsUnderMenuActive(true);
                accountNameAcquisition();
            }
        });
    }, []);

    return (
        <div className={`top-under-menu ${isUnderMenuActive ? 'active' : ''}`}>
            <div className="register-photo" onClick={openImgUploaderModal1}>
                <AddAPhotoIcon />
                <p>地図に写真を追加する</p>
            </div>
        </div>
    )
}