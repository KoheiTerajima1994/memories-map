"use client";

import { useEffect, useState, MouseEventHandler } from 'react';
import { auth } from '@/libs/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

// 返り値がないので、voidで型をつける
interface modal1 {
    openImgUploaderModal1: () => void;
}

export default function AuthStatus(props: modal1) {
    const {openImgUploaderModal1} = props;

    // ログインしているか否かを判定する処理→ログイン状態ならば、top-under-menuを表示
    const [isUnderMenuActive, setIsUnderMenuActive] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if(currentUser) {
                setUser(currentUser);
                setIsUnderMenuActive(true);
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