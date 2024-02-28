"use client"

import MapComponent from '../libs/googleMap';
import './styles/globals.css';
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import "swiper/css";
import InitialAnimation from '@/app/components/InitialAnimation';
import Hamburger from '@/app/components/Hamburger';
import Search from '@/app/components/Search';
import useAccountName from '@/hooks/useAccountName';
import PostModal from './components/PostModal';
import { PostModalProvider } from './context/PostModalProvider';
import { MemoLatLngProvider } from './context/MemoLatLngProvider';
import { PostingUserInformationProvider } from './context/PostingUserInformationProvider';
import { MapClickOparationEnabledProvider } from './context/MapClickOparationEnabledProvider';
import ImgUploadModal from './components/ImgUploadModal';
import ImgUploadStatus from './components/ImgUploadStatus';
import { UploadStatusModalProvider } from './context/UploadStatusModalProvider';
import { LoadingProvider } from './context/LoadingProvider';
import { UploadingProvider } from './context/IsUploadedProvider';
import { MarkerPointProvider } from './context/MarkerPointProvider';
import { LatLngProvider } from './context/LatLngProvider';
import { PostingLatLngProvider } from './context/PostingLatLngProvider';

export default function Home() {
// アカウント名を取得するカスタムフック
const name = useAccountName();

// ハンバーガーメニューの開閉
const [isMenuBarActive, setIsMenuBarActive] = useState<boolean>(false);
const openMenu = () => {
  setIsMenuBarActive(true);
}
const closeMenu = () => {
  setIsMenuBarActive(false);
}

  return (
    <>
    <PostModalProvider>
    <MemoLatLngProvider>
    <PostingUserInformationProvider>
    <MapClickOparationEnabledProvider>
    <UploadStatusModalProvider>
    <LoadingProvider>
    <UploadStatusModalProvider>
    <LoadingProvider>
    <UploadingProvider>
    <MarkerPointProvider>
    <LatLngProvider>
    <PostingLatLngProvider>
        <main className="main">
            {/* ロード時のアニメーション */}
            <InitialAnimation />
            <div className="search-bar-position">
              <div className="search-bar-left" onClick={openMenu}>
                <MenuIcon></MenuIcon>
              </div>
              {/* 検索機能 */}
              <Search />
            </div>
            {/* マップ、ピン立て処理 */}
            <MapComponent />
            <Hamburger name={name} isMenuBarActive={isMenuBarActive} closeMenu={closeMenu} />
            <div className={`grey-filter ${isMenuBarActive ? 'active' : ''}`} onClick={closeMenu}></div>
            <ImgUploadModal name={name} />
            {/* 投稿モーダル表示 */}
            <PostModal />
            {/* アップロード状況 */}
            <ImgUploadStatus />
        </main>
    </PostingLatLngProvider>
    </LatLngProvider>
    </MarkerPointProvider>
    </UploadingProvider>
    </LoadingProvider>
    </UploadStatusModalProvider>
    </LoadingProvider>
    </UploadStatusModalProvider>
    </MapClickOparationEnabledProvider>
    </PostingUserInformationProvider>
    </MemoLatLngProvider>
    </PostModalProvider>
    </>
  );
}
