"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import useIsOpenPostModal from '@/hooks/useIsOpenPostModal';
import useMemoLatLng from '@/hooks/useMemoLatLng';
import usePostingUserInformation from '@/hooks/usePostingUserInformation';
import { MouseEvent, useEffect, useState } from 'react';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../../libs/firebase';

export default function PostModal() {
  // 投稿モーダルの開閉状態を管理するカスタムフック
  const { isOpenPostModal, setIsOpenPostModal } = useIsOpenPostModal();

  // 経度、緯度をメモ管理するカスタムフック
  const { memoLatLng, setMemoLatLng } = useMemoLatLng();

  // Firebaseから取得した情報を格納するカスタムフック
  const { postingUserInformation, setPostingUserInformation } = usePostingUserInformation();

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
            <Swiper className="sample-slider w-30">
            {memoLatLng && postingUserInformation !== null && postingUserInformation.map((userInformation, index) => (
              // {useStateにてセットした緯度経度とuserInformation.lat,userInformation.lngが一致すれば、表示}
              userInformation.lat === memoLatLng[0].lat && userInformation.lng === memoLatLng[0].lng && (
                <SwiperSlide
                key={index}
                >
                  {imageList.map((url) => {
                    if(url.indexOf(userInformation.id) !== -1) {
                      return <div className="d-f jc-c ai-c"><img src={url} alt="" className="w-70" /></div>
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
            <a href="" className="img-uploader-blue-btn w-30 py-1p" onClick={closePostModal}>モーダルを閉じる</a>
          </div>
        </>
    )
}