"use client";

import React, { useCallback, useEffect, useRef, useState, MouseEvent } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Link from 'next/link';
import LogoutBtn from '../app/parts/LogoutBtn';
import { onAuthStateChanged, User } from 'firebase/auth';
import { app, auth, db, storage } from './firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { connectStorageEmulator, getDownloadURL, getMetadata, getStorage, listAll, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import InitialAnimation from '@/app/parts/InitialAnimation';
import Hamburger from '@/app/parts/Hamburger';
import Search from '@/app/parts/Search';
import AuthStatus from '@/app/parts/AuthStatus';

const MapComponent = () => {

  // アカウント名の取得と表示
  const [name, setName] = useState<string>("");
  // アカウント名の取得
  const accountNameAcquisition = () => {
    const accountName: any = auth.currentUser;
    setName(accountName.displayName);
  }
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
        if(currentUser) {
            accountNameAcquisition();
        }
    });
}, []);

  // ハンバーガーメニューの開閉
  const [isMenuBarActive, setIsMenuBarActive] = useState<boolean>(false);
  const openMenu = () => {
    setIsMenuBarActive(true);
  }
  const closeMenu = () => {
      setIsMenuBarActive(false);
  }

  // マップ初期位置
  const [center, setCenter] = useState<{ lat: number, lng: number }>({
    lat: 35.68134074965259,
    lng: 139.76719989855425,
  });
  // マップサイズ
  const mapContainerStyle = {
  height: '100vh',
  width: '100vw',
  };

  // マーカーポイントの型定義
  type MarkerPoint = {
    lat: number,
    lng: number,
  }
  const [markerPoint, setMarkerPoint] = useState<MarkerPoint>(center);

  // マップクリックでピン立ての処理(地図に写真を追加するの段階で有効にさせる)
  const [mapClickOparationEnabled, setMapClickOparationEnabled] = useState<boolean>(false);
  const [latLng, setLatLng] = useState<{lat: number, lng: number} | null>(null);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if(mapClickOparationEnabled) {
      // e.latLngがある場合の処理
      const clickedLatLng = e.latLng ? {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      } : null;
      console.log(clickedLatLng);
      setLatLng(clickedLatLng);
    } else {
      console.log('エラーが発生しました。')
    }
  }

  // 参照を保持し、その値をメモ化しているので、再レンダリングが起こらない
  const mapRef = useRef();
  // メモ化されたコールバックを返す
  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  // 画像、音声、動画にはStorageを用いる
  // 画像パスをhandleImgSelectからonFileUploadToFirebaseに渡す用
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

  const upLoadFirebaseAndStorage = async () => {
    // Firestore DatabaseとStorage間で同じuuidを使用するために定義
    const uniqueId = uuidv4();
    onFileUploadToFirebase(uniqueId);
    registerLocation(uniqueId);

    setLatLng(null);
    setDateAndTime("");
    setImgPath("");
    setTextArea("");

    // 投稿モーダルを閉じる
    setIsImgUploaderModal4(false);
  }

  // google mapを一度のみ読み込みたい。。。。！！！
  const [load, setLoad] = useState<boolean>(false);
  useEffect(() => {
    setLoad(true);
    console.log('true!!');
  },[]);


  // Firebaseに登録した場所をインポートしたい
  const [postingLatLng, setPostingLatLng] = useState<{lat: number, lng: number}[] | null>(null);
  const [postingUserInformation, setPostingUserInformation] = useState<{dateAndTime: string, name: string, text: string, id: string, lat: number, lng: number}[] | null>(null);
  // firebaseに登録したものを全て取得する
  useEffect(() => {
    const postingLocationRead = async () => {
      // 複数取得する場合は、collectionとgetDocsを使用後、forEachにてループを回す
      const collectionRef = collection(db, 'posting-location');
      const querySnapshot = await getDocs(collectionRef);

      // オブジェクトを格納する配列{ lat: number; lng: number }[]はオブジェクト型の配列を示している
      const locations: { lat: number; lng: number }[] = [];
      const userInformation: {
        dateAndTime: string;
        name: string;
        text: string;
        id: string;
        lat: number;
        lng: number;
      }[] = [];

      querySnapshot.forEach((doc) => {
        // console.log(doc.data());
        // console.log(doc.data().latLng.lat);
        // console.log(doc.data().latLng.lng);
        // console.log(doc.data().dateAndTime);
        // console.log(doc.data().name);
        // console.log(doc.data().text);
        // console.log(doc.data().id);

        // lat,lngを配列の末尾に追加していく処理
        const containerPostingLat: number = doc.data().latLng.lat;
        const containerPostingLng: number = doc.data().latLng.lng;
        locations.push({ lat: containerPostingLat, lng: containerPostingLng });
        // console.log(locations);

        // 投稿時間、アカウント名、テキスト、idを配列の末尾に追加していく処理
        const containerPostingDateAndTime: string = doc.data().dateAndTime;
        const containerPostingName: string = doc.data().name;
        const containerPostingText: string = doc.data().text;
        const containerPostingId: string = doc.data().id;
        userInformation.push({
          dateAndTime: containerPostingDateAndTime,
          name: containerPostingName,
          text: containerPostingText,
          id: containerPostingId,
          lat: containerPostingLat,
          lng: containerPostingLng,
        });
      });
      // ここから、実際のピン立て
      setPostingLatLng(locations);
      setPostingUserInformation(userInformation);
      console.log(userInformation);
    }

    postingLocationRead();
  },[]);

  // Firebaseから引っ張ってきたマーカーをクリックした時の処理
  const [isOpenPostModal, setIsOpenPostModal] = useState<boolean>(false);
  const [memoLatLng, setMemoLatLng] = useState<{lat: number, lng: number}[] | null>(null);

  // 新しく追加！！！
  const [originalPostingLatLng, setOriginalPostingLatLng] = useState<{lat: number, lng: number}[] | null>(null);

  const openPostModal = (e: google.maps.MapMouseEvent) => {
    console.log('マーカーがクリックされました。');
    setIsOpenPostModal(true);

    // クリックした場所の緯度・経度を表示
    if(e.latLng) {
      const clickedLat: number = e.latLng.lat();
      const clickedLng: number = e.latLng.lng();
      
      // オブジェクトを格納する配列{ lat: number; lng: number }[]はオブジェクト型の配列を示している
      const latLngInformation: {
        lat: number;
        lng: number;
      }[] = [];
  
      const markerPoint: {
        lat: number;
        lng: number;
      } = {
        lat: clickedLat,
        lng: clickedLng,
      };
  
      latLngInformation.push(markerPoint);
      // 取得するのは、配列の0番目
      // setMemoLatLng(latLngInformation[0]);
      setMemoLatLng(latLngInformation);
    } else {
      console.log('エラーが発生しました。');
    }
  }

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
    })
    console.log('ここで処理が重なっている？');
  },[]);

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
          {/* ロード時のアニメーション */}
          <InitialAnimation />
          <div className="search-bar-position">
            <div className="search-bar-left" onClick={openMenu}>
              <MenuIcon></MenuIcon>
            </div>
            <Search setMarkerPoint={setMarkerPoint} />
          </div>
          {load ? (
            <LoadScript googleMapsApiKey = {String(process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY)}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={markerPoint}
                zoom={15}
                onClick={handleMapClick}
                onLoad={onMapLoad}
              >
                <Marker position={markerPoint} />
                {latLng && <Marker position={latLng} />}
                {postingLatLng !== null && postingLatLng.map((location, index) => (
                  <Marker key={index} position={location} onClick={openPostModal} />
                ))}
              </GoogleMap>
            </LoadScript>
          ):(
            <p>エラーです。</p>
          )}
          <Hamburger name={name} isMenuBarActive={isMenuBarActive} closeMenu={closeMenu} />
          <div className={`grey-filter ${isMenuBarActive ? 'active' : ''}`} onClick={closeMenu}></div>
          <AuthStatus openImgUploaderModal1={openImgUploaderModal1} />
          {/* 1枚目モーダル */}
          <div className={`img-uploader-modal ${isImgUploaderModal1 ? 'active' : ''}`}>
            <div className="img-uploader-modal-inner">
              <p className="fz-m ta-c">画像を投稿する(簡単4STEP)</p>
              <p className="fz-sm ta-c">1.投稿したい位置にピンを刺してください。</p>
              <div className="img-uploader-blue-btn mx-a w-20 py-1p" onClick={openImgUploaderModal2}>次へ</div>
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
                <div className="img-uploader-blue-btn w-10 py-1p" onClick={openImgUploaderModal1}>前へ</div>
                <div className="img-uploader-blue-btn w-10 py-1p" onClick={openImgUploaderModal3}>次へ</div>
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
                <div className="img-uploader-blue-btn w-10 py-1p" onClick={openImgUploaderModal2}>前へ</div>
                <div className="img-uploader-blue-btn w-10 py-1p" onClick={openImgUploaderModal4}>次へ</div>
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
                <div className="img-uploader-blue-btn w-10 py-1p" onClick={openImgUploaderModal3}>前へ</div>
              </div>
              <div className="d-f jc-c mt-3p">
                <div className="img-uploader-orange-btn" onClick={upLoadFirebaseAndStorage}>投稿する</div>
              </div>
              <div className="img-uploader-under-line-btn" onClick={closeImgUploaderModal}>投稿をやめる</div>
            </div>
          </div>
          {/* 投稿モーダル表示 */}
          <div className={`grey-filter ${isOpenPostModal ? 'active' : ''}`} onClick={closePostModalBygreyFilter}></div>
          <div className={`post-modal d-f fd-c ${isOpenPostModal ? "active" : ""}`}>
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
                  <p>{userInformation.dateAndTime}</p>
                  <p>{userInformation.name}</p>
                  <p>{userInformation.text}</p>
                  {/* <p>{userInformation.id}</p>
                  <p>{userInformation.lat}</p>
                  <p>{userInformation.lng}</p> */}
                </SwiperSlide>
                )
              ))}
            </Swiper>
            <a href="" className="img-uploader-blue-btn w-30 py-1p" onClick={closePostModal}>モーダルを閉じる</a>
          </div>
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
        </>
  );
};

export default MapComponent;