"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Link from 'next/link';
import LogoutBtn from '../app/parts/LogoutBtn';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db, storage } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


const MapComponent = () => {

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
  // const [markers, setMarkers] = useState<{ lat: number, lng: number }[]>([]);


  // マップサイズ
  const mapContainerStyle = {
  height: '100vh',
  width: '100vw',
  };

  const [latLng, setLatLng] = useState<{lat: number, lng: number} | null>(null);
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    const clickedLatLng = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    console.log(clickedLatLng);

    setLatLng(clickedLatLng);
  }
  // const handleMapClick = (event: google.maps.MapMouseEvent) => {
  //   // クリックした場所の緯度経度情報
  //   const clickedLatLng = {
  //     lat: event.latLng.lat(),
  //     lng: event.latLng.lng(),
  //   };

  //   // 新しいピンを追加
  //   setMarkers((prevMarkers) => [...prevMarkers, clickedLatLng]);
  // };
  // マーカーポイントの型定義
  type MarkerPoint = {
    lat: number,
    lng: number,
  }
  const [markerPoint, setMarkerPoint] = useState<MarkerPoint>(center);

  // 参照を保持し、その値をメモ化しているので、再レンダリングが起こらない
  const mapRef = useRef();
  // メモ化されたコールバックを返す
  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  // 検索ワード入力用
  const [searchWord, setSearchWord] = useState<string>('');

  // キーワードをもとに検索させる関数
  function getMapData() {
    try {
      // geocoderオブジェクトの取得
      const geocoder = new window.google.maps.Geocoder();
      let getLat = 0;
      let getLng = 0;
      // 検索キーワードを使ってGeocodeでの位置検索
      geocoder.geocode({ address: searchWord }, async (results, status) => {
        if (status === 'OK' && results) {
          getLat = results[0].geometry.location.lat();
          getLng = results[0].geometry.location.lng();
          const center = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          setMarkerPoint(center);
        }
      });
      alert('検索するよ');

    } catch (error) {
      alert('検索処理でエラーが発生しました！');
      throw error;
    }
  }

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

  // 画像アップローダーモーダルの表示/非表示
  const [isImgUploaderActive, setIsImgUploaderActive] = useState<boolean>(false);
  const openImgUploader = () => {
    setIsImgUploaderActive(true);
  }
  const closeImgUploader = () => {
    setIsImgUploaderActive(false);
  }

  // 画像アップローダー

//   const postImage = async(image=null) => {
//     let uploadResult = '';
 
//     if(image.name){
//         const storageRef = ref(storage);
//         const ext = image.name.split('.').pop();
//         const hashName = Math.random().toString(36).slice(-8);
//         const fullPath = '/images/' + hashName + '.' + ext;
//         const uploadRef = ref(storageRef, fullPath);
 
//         // 'file' comes from the Blob or File API
//         await uploadBytes(uploadRef, image).then(async function(result) {
//             console.log(result);
//             console.log('Uploaded a blob or file!');
 
//             await getDownloadURL(uploadRef).then(function(url){
//                 uploadResult = url;
//             });
//         });
//     }
//     return uploadResult;
// }
//   const [image, setImage] = useState(null);
//   const [createObjectURL, setCreateObjectURL] = useState(null);

//   const uploadToClient = (event: any) => {
//     if(event.target.files && event.target.files[0]) {
//       const file = event.target.files[0];

//       setImage(file);
//       setCreateObjectURL(URL.createObjectURL(file));
//     }
//   }

//   const uploadToServer = async () => {
//     const result = await postImage(image);
//     console.log(result);
//   }

// 動くのは、registerLocationがクリックされてからでいいのでは？
// uploadImageの部分をuseStateを用いる？
  // 画像、音声、動画にはStorageを用いる
  // ローディング文言表示用
  const [loading, setLoading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  // 画像アップのタイミング
  // const [uploadTiming, setUploadTiming] = useState<boolean>(false);

  const onFileUploadToFirebase = (e: any) => {
    console.log(e.target.files[0].name);
    const file = e.target.files[0];
    const storageRef = ref(storage, "image/" + file.name);
    const uploadImage = uploadBytesResumable(storageRef, file);
    // 状態表示
    uploadImage.on("state_changed", (snapshot) => {
      setLoading(true);
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

  // Firebaseに投稿場所を登録
  const [textArea, setTextArea] = useState<string>("");
  const [dateAndTime, setDateAndTime] = useState<any>("");
  const registerLocation = () => {
    // Firebaseのデータベースにデータを追加する
    // addDocはドキュメントの作成、setDocはドキュメントの作成と更新
    const addDataRef = collection(db, "posting-location");
    addDoc(addDataRef, {
      text: textArea,
      dateAndTime: dateAndTime,
      latLng: latLng,
    });
    setTextArea("");
  }

  return (
        <>
          <div className="search-bar-position">
            <div className="search-bar-left" onClick={openMenu}>
              <MenuIcon></MenuIcon>
            </div>
            <div className="search-bar-center">
              <input
              id="pac-input"
              type="text"
              placeholder="検索"
              onChange={(e) => { setSearchWord(e.target.value) }}
              />
            </div>
            <div className="search-bar-right" onClick={async () => { await getMapData() }}>
              <SearchIcon></SearchIcon>
            </div>
          </div>
          <LoadScript googleMapsApiKey = {String(process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY)}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              // center={center}
              center={markerPoint}
              zoom={15}
              onClick={handleMapClick}
              onLoad={onMapLoad}
            >
              <Marker position={markerPoint} />
              <Marker position={latLng} />
              {/* <Marker position={center} /> */}
              {/* ピンを表示 */}
              {/* {markers.map((marker, index) => (
                <Marker key={index} position={marker} />
              ))} */}
            </GoogleMap>
          </LoadScript>
          <div className={`menu-bar ${isMenuBarActive ? 'active' : ''}`}>
            <CloseIcon onClick={closeMenu} className="close-btn"></CloseIcon>
            <div className="menu-bar-contents">
              <p>みんなの思い出MAP</p>
              <p>このアプリは、時代の変化とともに消えゆく景色を残したいという思いから作られたアプリです。会員登録いただくと、投稿ができるようになります。</p>
              <Link href="/login">ログイン</Link>
              <Link href="/signup">登録はこちら</Link>
              <Link href="">使い方</Link>
              <LogoutBtn />
            </div>
          </div>
          <div className={`grey-filter ${isMenuBarActive ? 'active' : ''}`} onClick={closeMenu}></div>
          <div className={`top-under-menu ${isUnderMenuActive ? 'active' : ''}`}>
            <div className="register-photo" onClick={openImgUploader}>
              <AddAPhotoIcon />
              <p>地図に写真を追加する</p>
            </div>
          </div>
          {/* ピンを追加 */}
          <div className={`img-uploader-modal ${isImgUploaderActive ? 'active' : ''}`}>
            <div className="img-uploader-modal-inner">
              {loading ? (
              <p>アップロード中…</p>
              ) : (
              isUploaded ? (
              <p>アップロード完了</p>
              ) : null
              )}
              <p>1.投稿したい位置にピンを刺してください。</p>
              <div className="input-wrapper">
                  <label htmlFor="date-and-time">2.撮影日時を登録してください。</label>
                  <input type="datetime-local" id="date-and-time" value={dateAndTime} onChange={(e) => setDateAndTime(e.target.value)} />
              </div>
              <div className="input-wrapper">
                  <label htmlFor="img-fileup">3.画像ファイルを添付してください。(png、jpg形式のみ可能です)</label>
                  <input type="file" id="img-fileup" accept="image/png, image/jpeg" onChange={onFileUploadToFirebase} />
              </div>
              <div className="input-wrapper">
                  <label htmlFor="comment">4.コメントがある場合は入力してください。</label>
                  <textarea id="comment" value={textArea} onChange={(e) => setTextArea(e.target.value)} />
              </div>
              <div className="stop-posting" onClick={registerLocation}>投稿する</div>
              <div className="stop-posting" onClick={closeImgUploader}>投稿をやめる</div>
            </div>
          </div>
        </>
  );
};

export default MapComponent;