"use client";

import { useState } from "react";
import { Marker } from '@react-google-maps/api';
import usePostingLatLng from "@/hooks/usePostingLatLng";


export default function MarkerClick() {
    // Firebaseに登録された経度、緯度を取得するカスタムフック
    const { postingLatLng, setPostingLatLng } = usePostingLatLng();

    // Firebaseから引っ張ってきたマーカーをクリックした時の処理
    const [isOpenPostModal, setIsOpenPostModal] = useState<boolean>(false);
    const [memoLatLng, setMemoLatLng] = useState<{lat: number, lng: number}[] | null>(null);

    // 画像アップローダー起動時、既存マーカー非表示のため
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
    
        // マップに取得した経度、緯度を表示させる
        latLngInformation.push(markerPoint);
        // 取得するのは、配列の0番目
        // setMemoLatLng(latLngInformation[0]);
        setMemoLatLng(latLngInformation);
        } else {
        console.log('エラーが発生しました。');
        }
    }
    
    return (
        <>
        {postingLatLng !== null && postingLatLng.map((location, index) => (
            <Marker key={index} position={location} onClick={openPostModal} />
        ))}
        </>
    )
}