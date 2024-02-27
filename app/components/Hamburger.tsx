"use client";

import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import LogoutBtn from './LogoutBtn';
import Image from 'next/image';

// 型定義
type HamburgerTypes = {
    name: string;
    isMenuBarActive: boolean;
    closeMenu: React.MouseEventHandler<SVGSVGElement>;
}

export default function Hamburger(props: HamburgerTypes) {
    const {name, isMenuBarActive, closeMenu} = props;

    return (
        <div className={`menu-bar ${isMenuBarActive ? 'active' : ''}`}>
            <CloseIcon onClick={closeMenu} className="close-btn"></CloseIcon>
            <div className="menu-bar-contents">
            <div className="logoIcon mb-sm">
                <Image src="/images/logo.png" alt="Logo Icon" width={150} height={150} />
            </div>
            {/* ログインされていれば表示 */}
            {name && <p className="fz-sm">{name}さん、こんにちは！</p>}
            <p className="fz-sm lh-sm my-xl">このアプリは、時代の変化とともに消えゆく景色を残したいという思いから作られたアプリです。会員登録いただくと、投稿ができるようになります。</p>
            {name ? (
                <>
                <Link href="/mypage" className="menu-bar-blue-btn fz-s">マイページ</Link>
                <LogoutBtn />
                {/* <Link href="/howto" className="under-line-btn fz-s">使い方</Link> */}
                </>
            ) : (
                <>
                <Link href="/login" className="menu-bar-blue-btn fz-s">ログイン</Link>
                <Link href="/signup" className="under-line-btn fz-s">登録はこちら</Link>
                {/* <Link href="/howto" className="under-line-btn fz-s">使い方</Link> */}
                </>
            )}
            </div>
        </div>
    )
}