"use client";

import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { useMarkerPointContext } from "../context/MarkerPointProvider";
// import useMarkerPoint from "@/hooks/useMarkerPoint";


export default function Search() {
  // マーカー初期位置をコンテキストにて管理
  const { markerPoint, setMarkerPoint } = useMarkerPointContext();
  
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
    } catch (error) {
      alert('検索処理でエラーが発生しました！');
      throw error;
    }
  }

    return (
      <>
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
      </>
    )
}