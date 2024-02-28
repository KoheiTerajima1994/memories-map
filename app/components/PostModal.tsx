"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import { MouseEvent, useEffect, useState } from 'react';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../../libs/firebase';
import { usePostModalContext } from '../context/PostModalProvider';
import { useMemoLatLngContext } from '../context/MemoLatLngProvider';
import { usePostingUserInformationContext } from '../context/PostingUserInformationProvider';

export default function PostModal() {
  // 投稿モーダルの開閉状態をコンテキストにて管理
  const { isOpenPostModal, setIsOpenPostModal } = usePostModalContext();

  // 経度、緯度をメモ管理状態をコンテキストにて管理
  const { memoLatLng, setMemoLatLng } = useMemoLatLngContext();

  // Firebaseから取得した情報をコンテキストにて管理
  const { postingUserInformation, setPostingUserInformation } = usePostingUserInformationContext();

  const closePostModal = (e: MouseEvent<HTMLAnchorElement>) => {
    // aタグ デフォルトの処理を防ぐ
    e.preventDefault();
    console.log('モーダルを閉じるがクリックされました。');
    setIsOpenPostModal(false);
  }
  const closePostModalBygreyFilter = () => {
    console.log('モーダルを閉じるがクリックされました。');
    setIsOpenPostModal(false);
  }

  // Storageにある画像全件取得
  const [imageList, setImageList] = useState<string[]>([]);
  const imageListRef = ref(storage, "image/");
  useEffect(() => {
    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev) => [...prev, url]);
        })
      })
    });
  },[]);

    return (
        <>
          {/* 投稿モーダル表示 */}
          <div className={`grey-filter ${isOpenPostModal ? 'active' : ''}`} onClick={closePostModalBygreyFilter}></div>
          <div className={`post-modal d-f fd-c ${isOpenPostModal ? "active" : ''}`}>
            <Swiper className="sample-slider w-30 sp-w-90">
            {memoLatLng && postingUserInformation !== null && postingUserInformation.map((userInformation, index) => (
              // {useStateにてセットした緯度経度とuserInformation.lat,userInformation.lngが一致すれば、表示}
              userInformation.lat === memoLatLng[0].lat && userInformation.lng === memoLatLng[0].lng && (
                <SwiperSlide
                key={index}
                >
                  {imageList.map((url, index) => {
                    if(url.indexOf(userInformation.id) !== -1) {
                      return <div key={index} className="d-f jc-c ai-c"><img src={url} alt="" className="w-70" /></div>
                    }
                  })}
                  <p>投稿日：{userInformation.dateAndTime}</p>
                  <p>アカウント名：{userInformation.name}さん</p>
                  <p>コメント：{userInformation.text}</p>
                  {/* <p>{userInformation.id}</p>
                  <p>{userInformation.lat}</p>
                  <p>{userInformation.lng}</p> */}
                </SwiperSlide>
                )
              ))}
            </Swiper>
            <a href="" className="img-uploader-blue-btn w-30 sp-w-50 py-1p" onClick={closePostModal}>モーダルを閉じる</a>
          </div>
        </>
    )
}