"use client";

import React, { useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import "swiper/css";
import FirebasePinImport from '@/app/components/FirebasePinImport';
import { useMapClickOparationEnabledContext } from '@/app/context/MapClickOparationEnabledProvider';
import { useLatLngContext } from '@/app/context/LatLngProvider';
import { useMarkerPointContext } from '@/app/context/MarkerPointProvider';

const MapComponent = () => {

  // 経度、緯度の状態管理をコンテキストにて管理
  const { latLng, setLatLng } = useLatLngContext();

  // マップクリックを有効状態をコンテキストにて管理
  const { mapClickOparationEnabled, setMapClickOparationEnabled } = useMapClickOparationEnabledContext();

  // マーカー初期位置をコンテキストにて管理
  const { markerPoint, setMarkerPoint } = useMarkerPointContext();

  // マップサイズ
  const mapContainerStyle = {
  height: '100vh',
  width: '100vw',
  };

  // 新たなピン立ての処理(地図に写真を追加するの段階で有効にさせる)
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    console.log('クリックされました')
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
  // 正しい型の付け方がわからない
  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  return (
        <>
          {/* google mapのローディング */}
          <LoadScript googleMapsApiKey = {String(process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY)}>
            <GoogleMap
              // mapの大きさ
              mapContainerStyle={mapContainerStyle}
              // mapの初期位置、検索後の位置
              center={markerPoint}
              // mapの縮尺
              zoom={15}
              // 新たなピン立ての処理
              onClick={handleMapClick}
              // 地図が初めて読み込まれた時の呼び出されるコールバック関数、useRefを使うことでコンポーネントが再レンダリングされても不要な再描画が行われない
              onLoad={onMapLoad}
            >
              <Marker position={markerPoint} />
              {/* これはピン立て用 */}
              {latLng && <Marker position={latLng} />}
              {/* Firebaseに登録した場所をインポートする処理 */}
              <FirebasePinImport />
            </GoogleMap>
          </LoadScript>
        </>
  );
};

export default MapComponent;
