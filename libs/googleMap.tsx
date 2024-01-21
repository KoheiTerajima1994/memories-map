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
import { connectStorageEmulator, getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

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

  // マップサイズ
  const mapContainerStyle = {
  height: '100vh',
  width: '100vw',
  };


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

  // ログインしているか否かを判定する処理→ログイン状態ならば、top-under-menuとアカウント名を表示
  const [isUnderMenuActive, setIsUnderMenuActive] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState<string>("");

  // アカウント名の取得
  const accountNameAcquisition = () => {
    const accountName: any = auth.currentUser;
    setName(accountName.displayName)
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

  // 画像アップローダーモーダルの表示/非表示
  const [isImgUploaderActive, setIsImgUploaderActive] = useState<boolean>(false);
  const openImgUploader = () => {
    setMapClickOparationEnabled(true);
    setIsImgUploaderActive(true);
  }
  const closeImgUploader = () => {
    setMapClickOparationEnabled(false);
    setIsImgUploaderActive(false);
  }

  // 画像、音声、動画にはStorageを用いる
  // ローディング文言表示用
  const [loading, setLoading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  // 画像アップのタイミング
  // const [uploadTiming, setUploadTiming] = useState<boolean>(false);

  // 画像パスをhandleImgSelectからonFileUploadToFirebaseに渡す用
  const [imgPath, setImgPath] = useState<any>('');

  const handleImgSelect = (e: any) => {
    console.log(e.target.files[0].name);
    const file = e.target.files[0];
    setImgPath(file);
  }

  const onFileUploadToFirebase = (uniqueId: string) => {
    console.log(imgPath);
    // パスにuniqueIdを付与
    const storageRef = ref(storage, "image/" + uniqueId + "/" + imgPath.name);
    const uploadImage = uploadBytesResumable(storageRef, imgPath);
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
  const openPostModal = (e: google.maps.MapMouseEvent) => {
    console.log('マーカーがクリックされました。');
    setIsOpenPostModal(true);
    // クリックした場所の緯度・経度を表示
    const clickedLat: number = e.latLng.lat();
    const clickedLng: number = e.latLng.lng();

    // オブジェクトを格納する配列{ lat: number; lng: number }[]はオブジェクト型の配列を示している
    const latLngInformation: {
      lat: number;
      lng: number;
    }[] = [];

    latLngInformation.push({
      lat: clickedLat,
      lng: clickedLng,
    });
    // 取得するのは、配列の0番目
    // setMemoLatLng(latLngInformation[0]);
    setMemoLatLng(latLngInformation);
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

  // Storageにある画像を表示したい→現状、取得できない…非同期で取得しなくてはいけない？
  // const storage = getStorage();
  // const pathReference = ref(storage, 'gs://omoide-map.appspot.com/image/2999c9b6-960e-4133-9585-d30ca1baf9ae/LINE_ALBUM_230411_7.jpg');
  // console.log(pathReference);

  const storage = getStorage(app);
  const pathReference = ref(storage, 'image/');

  const [getImg, setGetImg] = useState<string>("");

  // const handleDownloadAll = async () => {
  //   const directoryRef = ref(storage, 'image/'); // ディレクトリへの参照
  //   const files = await listAll(directoryRef); // ディレクトリ内のファイル一覧を取得
  
  //   const downloadURLs = await Promise.all(files.items.map(async (fileRef) => {
  //     return await getDownloadURL(fileRef); // 各ファイルに対してダウンロードURLを取得
  //   }));
  
  //   console.log(downloadURLs);
  // };
  
  // useEffect(() => {
  //   handleDownloadAll();
  // },[]);

  // const handleDownload = async () => {
  //   const fileName = "2999c9b6-960e-4133-9585-d30ca1baf9ae/LINE_ALBUM_230411_7.jpg";
  //   const fileRef = ref(storage, `image/${fileName}`);
  //   const url = await getDownloadURL(fileRef);
  //   console.log(url);
  // }

  // useEffect(() => {
  //   handleDownload();
  // },[])

  // useEffect(() => {
  //   listAll(pathReference)
  //     .then((res) => {
  //       res.prefixes.forEach((itemRef) => {
  //         console.log(itemRef.fullPath);
  //         setGetImg(itemRef.fullPath);
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("画像が取得できません。");
  //     });
  // }, []);

  // useEffect(() => {
  //   listAll(pathReference)
  //     .then(async (res) => {
  //       // itemsに対して処理
  //       await Promise.all(res.items.map(async (itemRef) => {
  //         const downloadURL = await getDownloadURL(itemRef);
  //         console.log(downloadURL);
  //         // ダウンロードURLを利用して必要な処理を行う
  //         console.log("ダウンロードURLが正常に表示されました。");
  //       }));
  //     })
  //     .catch((error) => {
  //       console.error("画像が取得できません。", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   listAll(pathReference)
  //     .then((res) => {
  //       // res.itemsにはディレクトリ内の各ファイルの参照が含まれています
  //       const fileRefs = res.items;
  
  //       // 各ファイルに対してダウンロードURLを取得
  //       const downloadURLPromises = fileRefs.map(fileRef => getDownloadURL(fileRef));
  
  //       // Promise.allを使用してすべてのダウンロードURLを取得
  //       Promise.all(downloadURLPromises)
  //         .then(urls => {
  //           // urlsには各ファイルのダウンロードURLが配列として含まれています
  //           setGetImg(urls);
  //         })
  //         .catch(error => {
  //           console.error("ダウンロードURLの取得に失敗しました。", error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.error("画像一覧の取得に失敗しました。", error);
  //     });
  // }, []);

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
                <Marker position={latLng} />
                {postingLatLng !== null && postingLatLng.map((location, index) => (
                  <Marker key={index} position={location} onClick={openPostModal} />
                ))}
              </GoogleMap>
            </LoadScript>
          ):(
            <p>エラーです。</p>
          )}
          <div className={`menu-bar ${isMenuBarActive ? 'active' : ''}`}>
            <CloseIcon onClick={closeMenu} className="close-btn"></CloseIcon>
            <div className="menu-bar-contents">
              <p>{name}さん、こんにちは！</p>
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
              <p className="upload-status">アップロード中…</p>
              ) : (
              isUploaded ? (
              <p className="upload-status">アップロード完了</p>
              ) : null
              )}
              <p className="img-uploader-title">画像を投稿する</p>
              <p>1.投稿したい位置にピンを刺してください。</p>
              <div className="input-wrapper">
                  <label htmlFor="date-and-time">2.撮影日時を登録してください。</label>
                  <input type="datetime-local" id="date-and-time" value={dateAndTime} onChange={(e) => setDateAndTime(e.target.value)} />
              </div>
              <div className="input-wrapper">
                  <label htmlFor="img-fileup">3.画像ファイルを添付してください。(png、jpg形式のみ可能です)</label>
                  <input type="file" id="img-fileup" accept="image/png, image/jpeg" onChange={handleImgSelect} />
              </div>
              <div className="input-wrapper">
                  <label htmlFor="comment">4.コメントがある場合は入力してください。</label>
                  <textarea id="comment" value={textArea} onChange={(e) => setTextArea(e.target.value)} />
              </div>
              <div className="go-posting" onClick={upLoadFirebaseAndStorage}>投稿する</div>
              <div className="stop-posting" onClick={closeImgUploader}>投稿をやめる</div>
            </div>
          </div>
          {/* 投稿モーダル表示 */}
          <div className={`grey-filter ${isOpenPostModal ? 'active' : ''}`} onClick={closePostModalBygreyFilter}></div>
          <div className={`post-modal ${isOpenPostModal ? "active" : ""}`}>
            <p>これは投稿モーダルです。</p>
            {memoLatLng && postingUserInformation !== null && postingUserInformation.map((userInformation, index) => (
              // {useStateにてセットした緯度経度とuserInformation.lat,userInformation.lngが一致すれば、表示}
              userInformation.lat === memoLatLng[0].lat && userInformation.lng === memoLatLng[0].lng && (
                <div key={index}>
                  {/* <img src={getImg} alt="" /> */}
                  <p>{userInformation.dateAndTime}</p>
                  <p>{userInformation.name}</p>
                  <p>{userInformation.text}</p>
                  <p>{userInformation.id}</p>
                  <p>{userInformation.lat}</p>
                  <p>{userInformation.lng}</p>
                </div>
              )
            ))}
            <a href="" className="post-modal-close" onClick={closePostModal}>「！！！モーダルを閉じる！！！」</a>
          </div>
        </>
  );
};

export default MapComponent;