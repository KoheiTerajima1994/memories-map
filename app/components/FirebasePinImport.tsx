"use client";

import { useEffect } from "react";
import { db } from '../../libs/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Marker } from '@react-google-maps/api';
import { usePostModalContext } from "../context/PostModalProvider";
import { useMemoLatLngContext } from "../context/MemoLatLngProvider";
import { usePostingUserInformationContext } from "../context/PostingUserInformationProvider";
import { usePostingLatLngContext } from "../context/PostingLatLngProvider";

type LatLng = {
    lat: number;
    lng: number;
} | null;

export default function FirebasePinImport(props: {latLng: LatLng }) {
    // props受け取り
    const { latLng } = props;
    // Firebaseに登録した場所をインポートしたい
    // Firebaseから取得したピン立てをコンテキストにて管理
    const { postingLatLng, setPostingLatLng } = usePostingLatLngContext();

    // Firebaseから取得した情報をコンテキストにて管理
    // const { postingUserInformation, setPostingUserInformation } = usePostingUserInformation();
    const { postingUserInformation, setPostingUserInformation } = usePostingUserInformationContext();

    // 投稿モーダルの開閉状態をコンテキストにて管理
    const { isOpenPostModal, setIsOpenPostModal } = usePostModalContext();

    // 経度、緯度をメモ管理状態をコンテキストにて管理
    const { memoLatLng, setMemoLatLng } = useMemoLatLngContext();

    // firebaseに登録したものを全て取得する
    useEffect(() => {
        const postingLocationRead = async () => {
        // 複数取得する場合は、collectionとgetDocsを使用後、forEachにてループを回す
        const collectionRef = collection(db, 'posting-location');

        const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
            // オブジェクトを格納する配列{ lat: number; lng: number }[]はオブジェクト型の配列を示している

            // 取得する値の型定義
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
            // lat,lngを配列の末尾に追加していく処理
            const containerPostingLat: number = doc.data().latLng.lat;
            const containerPostingLng: number = doc.data().latLng.lng;
            // 配列に緯度、経度を入れる
            locations.push({ lat: containerPostingLat, lng: containerPostingLng });
    
            // 投稿時間、アカウント名、テキスト、idを配列の末尾に追加していく処理
            const containerPostingDateAndTime: string = doc.data().dateAndTime;
            const containerPostingName: string = doc.data().name;
            const containerPostingText: string = doc.data().text;
            const containerPostingId: string = doc.data().id;

            // 時間表記のフォーマットを行う
            const parsedDate = new Date(containerPostingDateAndTime);
            const formatDate = (date: Date) => {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');

                return `${year}/${month}/${day} ${hours}:${minutes}`;
            }
            const formattedDate = formatDate(parsedDate);

            // 取得したデータを配列に入れる処理
            userInformation.push({
                dateAndTime: formattedDate,
                name: containerPostingName,
                text: containerPostingText,
                id: containerPostingId,
                lat: containerPostingLat,
                lng: containerPostingLng,
                });
            });
            // ピン立てに反映
            setPostingLatLng(locations);
            // モーダルに反映
            setPostingUserInformation(userInformation);
            console.log(userInformation);
        });

        // コンポーネントがアンマウントされるときに通信を解除
        return () => unsubscribe();
        }

        postingLocationRead();
    },[]);

    // ここから
    // Firebaseから引っ張ってきたマーカーをクリックした時の処理
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
    
        // マップに取得した経度、緯度を表示させる
        latLngInformation.push(markerPoint);
        // 取得するのは、配列の0番目
        // setMemoLatLng(latLngInformation[0]);
        setMemoLatLng(latLngInformation);
        } else {
        console.log('エラーが発生しました。');
        }
    }
    // ここまで

    return (
        <>
        {/* これはFirebaseから持ってきたピン */}
        {postingLatLng !== null && postingLatLng.map((location, index) => (
            <Marker key={index} position={location} onClick={openPostModal} />
        ))}
        </>
    )
}