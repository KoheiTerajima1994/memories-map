"use client"

import MapComponent from '../libs/googleMap';
import './styles/globals.css';
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { db, storage } from '../libs/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import "swiper/css";
import InitialAnimation from '@/app/components/InitialAnimation';
import Hamburger from '@/app/components/Hamburger';
import Search from '@/app/components/Search';
import AuthStatus from '@/app/components/AuthStatus';
import useAccountName from '@/hooks/useAccountName';
import useLatLng from '@/hooks/useLatLng';
import useMapClickOparationEnabled from '@/hooks/useMapClickOparationEnabled';
import usePostingLatLng from '@/hooks/usePostingLatLng';
import useOriginalPostingLatLng from '@/hooks/useOriginalPostingLatLng';
import useIsOpenPostModal from '@/hooks/useIsOpenPostModal';
import PostModal from './components/PostModal';


export default function Home() {
// アカウント名を取得するカスタムフック
const name = useAccountName();

// 経度、緯度の状態管理をするカスタムフック
const { latLng, setLatLng } = useLatLng();

// マップクリックを有効にするカスタムフック
const { mapClickOparationEnabled, setMapClickOparationEnabled } = useMapClickOparationEnabled();

// Firebaseから取得したピン立てを行うカスタムフック
const { postingLatLng, setPostingLatLng } = usePostingLatLng();

// 画像アップローダー起動時、既存マーカー表示、非表示を切り替えるカスタムフック
const { originalPostingLatLng, setOriginalPostingLatLng } = useOriginalPostingLatLng();

// ハンバーガーメニューの開閉
const [isMenuBarActive, setIsMenuBarActive] = useState<boolean>(false);
const openMenu = () => {
  setIsMenuBarActive(true);
}
const closeMenu = () => {
    setIsMenuBarActive(false);
}

// 画像、音声、動画にはStorageを用いる
// 画像パスをhandleImgSelectからonFileUploadToFirebaseへ渡す
const [imgPath, setImgPath] = useState<any>('');

  const handleImgSelect = (e: any) => {
    console.log(e.target.files[0].name);
    const file = e.target.files[0];
    setImgPath(file);
  }

const [loading, setLoading] = useState<boolean>(false);
const [isUploaded, setIsUploaded] = useState<boolean>(false);
const [uploadStatusModal, setUploadStatusModal] = useState<boolean>(false);

const onFileUploadToFirebase = (uniqueId: string) => {
  console.log(imgPath);
  // パスにuniqueIdを付与
  const storageRef = ref(storage, "image/" + uniqueId + imgPath.name);
  const uploadImage = uploadBytesResumable(storageRef, imgPath);
  // 状態表示
  uploadImage.on("state_changed", (snapshot) => {
    setLoading(true);
    setUploadStatusModal(true);
    },
    (err) => {
      console.log(err);
    },
    () => {
      setLoading(false);
      setIsUploaded(true);
    }
  );
}

const closeUploadStatusModal = () => {
  setUploadStatusModal(false);
}

// Firebaseに投稿場所を登録
const [textArea, setTextArea] = useState<string>("");
const [dateAndTime, setDateAndTime] = useState<any>("");
const registerLocation = (uniqueId: string) => {
  // Firebaseのデータベースにデータを追加する
  // addDocはドキュメントの作成、setDocはドキュメントの作成と更新
  const addDataRef = collection(db, "posting-location");
  addDoc(addDataRef, {
    id: uniqueId,
    name: name,
    text: textArea,
    dateAndTime: dateAndTime,
    latLng: latLng,
  });
  setTextArea("");
}

// ファイルアップローダーのリセット
const resetImgPath = () => {
  const fileInput = document.getElementById('img-fileup') as HTMLInputElement;
  if(fileInput) {
    fileInput.value = "";
  }
}

const upLoadFirebaseAndStorage = async () => {
  // Firestore DatabaseとStorage間で同じuuidを使用するために定義
  const uniqueId = uuidv4();
  onFileUploadToFirebase(uniqueId);
  registerLocation(uniqueId);

  setLatLng(null);
  setDateAndTime("");
  resetImgPath();
  setImgPath("");
  setTextArea("");

  // 投稿モーダルを閉じる
  setIsImgUploaderModal4(false);
}

// 画像アップローダーモーダルの表示/非表示
const [isImgUploaderModal1, setIsImgUploaderModal1] = useState<boolean>(false);
const [isImgUploaderModal2, setIsImgUploaderModal2] = useState<boolean>(false);
const [isImgUploaderModal3, setIsImgUploaderModal3] = useState<boolean>(false);
const [isImgUploaderModal4, setIsImgUploaderModal4] = useState<boolean>(false);

// 1枚目のモーダルを開く
const openImgUploaderModal1 = () => {
  // 戻る動作の場合、setIsImgUploaderModal2をfalseにする必要あり
  setIsImgUploaderModal2(false);
  setIsImgUploaderModal1(true);

  setMapClickOparationEnabled(true);

  // originalPostingLatLngに元のデータをセット
  setOriginalPostingLatLng(postingLatLng);
  // setPostingLatLngをnullにする
  setPostingLatLng(null);
}

// 2枚目のモーダルを開く&1枚目のモーダルを閉じる
const openImgUploaderModal2 = () => {
  // ピンが刺されている際の処理
  if(latLng !== null) {
    // 1枚目のモーダルを閉じる
    setIsImgUploaderModal1(false);
    // 3枚目のモーダルを閉じる
    setIsImgUploaderModal3(false);
    // 2枚目のモーダルを開く
    setIsImgUploaderModal2(true);

    setMapClickOparationEnabled(true);
  } else {
    alert('ピンを刺してください。');
  }
}

// 3枚目のモーダルを開く&2枚目のモーダルを閉じる
const openImgUploaderModal3 = () => {
  // 撮影日時が入力されている場合の処理
  if(dateAndTime !== "") {
    // 2枚目のモーダルを閉じる
    setIsImgUploaderModal2(false);
    // 4枚目のモーダルを閉じる
    setIsImgUploaderModal4(false);
    // 3枚目のモーダルを開く
    setIsImgUploaderModal3(true);

    setMapClickOparationEnabled(true);
  } else {
    alert('撮影日時を入力してください。');
  }
}

// 4枚目のモーダルを開く&3枚目のモーダルを閉じる
const openImgUploaderModal4 = () => {
  // 画像が投稿されている場合の処理
  if(imgPath !== "") {
    // 3枚目のモーダルを閉じる
    setIsImgUploaderModal3(false);
    // 4枚目のモーダルを開く
    setIsImgUploaderModal4(true);

    // ピン立て有効
    setMapClickOparationEnabled(true);
  } else {
    alert('画像ファイルを添付してください。');
  }
}

// モーダル自体を閉じる処理
const closeImgUploaderModal = () => {
  setIsImgUploaderModal1(false);
  setIsImgUploaderModal2(false);
  setIsImgUploaderModal3(false);
  setIsImgUploaderModal4(false);

  // ピン立て無効
  setMapClickOparationEnabled(false);

  // originalPostingLatLngがあればそれを使って元に戻す
  if (originalPostingLatLng !== null) {
    setPostingLatLng(originalPostingLatLng);
    // originalPostingLatLngをクリア
    setOriginalPostingLatLng(null);
  }
}

  return (
    <>
      <main className="main">
          {/* ロード時のアニメーション */}
          <InitialAnimation />
          <div className="search-bar-position">
            <div className="search-bar-left" onClick={openMenu}>
              <MenuIcon></MenuIcon>
            </div>
            <Search />
          </div>
          <MapComponent />
          <Hamburger name={name} isMenuBarActive={isMenuBarActive} closeMenu={closeMenu} />
          <div className={`grey-filter ${isMenuBarActive ? 'active' : ''}`} onClick={closeMenu}></div>
          <AuthStatus openImgUploaderModal1={openImgUploaderModal1} />
          {/* 1枚目モーダル */}
          <div className={`img-uploader-modal ${isImgUploaderModal1 ? 'active' : ''}`}>
            <div className="img-uploader-modal-inner">
              <p className="fz-m ta-c">画像を投稿する(簡単4STEP)</p>
              <p className="fz-sm ta-c">1.投稿したい位置にピンを刺してください。</p>
              <div className="img-uploader-blue-btn mx-a w-20 sp-w-50 py-1p sp-py-3p" onClick={openImgUploaderModal2}>次へ</div>
              <div className="img-uploader-under-line-btn" onClick={closeImgUploaderModal}>投稿をやめる</div>
            </div>
          </div>
          {/* 2枚目モーダル */}
          <div className={`img-uploader-modal ${isImgUploaderModal2 ? 'active' : ''}`}>
            <div className="img-uploader-modal-inner">
              <p className="fz-m ta-c">画像を投稿する(簡単4STEP)</p>
              <div className="input-wrapper mb-3p">
                  <label htmlFor="date-and-time">2.撮影日時を登録してください。</label>
                  <input type="datetime-local" id="date-and-time" value={dateAndTime} onChange={(e) => setDateAndTime(e.target.value)} />
              </div>
              <div className="d-f mx-a ai-c jc-c gap-3">
                <div className="img-uploader-blue-btn w-10 sp-w-25 py-1p sp-py-3p" onClick={openImgUploaderModal1}>前へ</div>
                <div className="img-uploader-blue-btn w-10 sp-w-25 py-1p sp-py-3p" onClick={openImgUploaderModal3}>次へ</div>
              </div>
              <div className="img-uploader-under-line-btn" onClick={closeImgUploaderModal}>投稿をやめる</div>
            </div>
          </div>
          {/* 3枚目モーダル */}
          <div className={`img-uploader-modal ${isImgUploaderModal3 ? 'active' : ''}`}>
            <div className="img-uploader-modal-inner">
              <p className="fz-m ta-c">画像を投稿する(簡単4STEP)</p>
              <div className="input-wrapper mb-3p">
                  <label htmlFor="img-fileup">3.画像ファイルを添付してください。(png、jpg形式のみ可能です)</label>
                  <input type="file" id="img-fileup" accept="image/png, image/jpeg" onChange={handleImgSelect} />
              </div>
              <div className="d-f mx-a ai-c jc-c gap-3">
                <div className="img-uploader-blue-btn w-10 sp-w-25 py-1p sp-py-3p" onClick={openImgUploaderModal2}>前へ</div>
                <div className="img-uploader-blue-btn w-10 sp-w-25 py-1p sp-py-3p" onClick={openImgUploaderModal4}>次へ</div>
              </div>
              <div className="img-uploader-under-line-btn" onClick={closeImgUploaderModal}>投稿をやめる</div>
            </div>
          </div>
          {/* 4枚目モーダル */}
          <div className={`img-uploader-modal ${isImgUploaderModal4 ? 'active' : ''}`}>
            <div className="img-uploader-modal-inner">
              <p className="fz-m ta-c">画像を投稿する(簡単4STEP)</p>
              <div className="input-wrapper mb-3p">
                  <label htmlFor="comment">4.コメントがある場合は入力してください。</label>
                  <textarea id="comment" className="comment-width" value={textArea} onChange={(e) => setTextArea(e.target.value)} />
              </div>
              <div className="d-f jc-c">
                <div className="img-uploader-blue-btn mx-a w-20 sp-w-50 py-1p sp-py-3p" onClick={openImgUploaderModal3}>前へ</div>
              </div>
              <div className="d-f jc-c mt-3p">
                <div className="img-uploader-orange-btn" onClick={upLoadFirebaseAndStorage}>投稿する</div>
              </div>
              <div className="img-uploader-under-line-btn" onClick={closeImgUploaderModal}>投稿をやめる</div>
            </div>
          </div>
          {/* 投稿モーダル表示 */}
          <PostModal />
          {/* アップロード状況 */}
          <div className={`grey-filter ${uploadStatusModal ? 'active' : ''}`}></div>
          <div className={`uploadStatusModal ${uploadStatusModal ? 'active' : ''}`}>
            {loading ? (
              <p className="fz-xl">アップロード中です…</p>
            ) : (
              isUploaded ? (
                <div>
                  <p className="fz-xl">アップロードが完了しました。</p>
                  <div className="img-uploader-blue-btn mx-a w-20 py-1p" onClick={closeUploadStatusModal}>OK</div>
                </div>
              ) : (
                null
              )
            )}
          </div>
      </main>
    </>
  );
}
