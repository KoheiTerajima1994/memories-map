"use client";

import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const MapComponent = () => {

  // ハンバーガーメニューの開閉
  const [isMenuBarActive, setIsMenuBarActive] = useState<boolean>(false);

  // ピン立て用
  const [center, setCenter] = useState<{ lat: number, lng: number }>({
    lat: 35.68134074965259,
    lng: 139.76719989855425,
  });
  const [markers, setMarkers] = useState<{ lat: number, lng: number }[]>([]);

  const openMenu = () => {
    setIsMenuBarActive(true);
  }
  const closeMenu = () => {
    setIsMenuBarActive(false);
  }

  // マップサイズ
  const mapContainerStyle = {
  height: '100vh',
  width: '100vw',
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    // クリックした場所の緯度経度情報
    const clickedLatLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    // 新しいピンを追加
    setMarkers((prevMarkers) => [...prevMarkers, clickedLatLng]);
  };

  // // マップの型
  // type MarkerPoint = {
  //   lat: number,
  //   lng: number,
  // }
  // // マップの初期値
  // const center: MarkerPoint = {
  //   lat: 35.68134074965259,
  //   lng: 139.76719989855425
  // }

  // 検索機能は一旦見送り
  // const [map, setMap] = useState<string | null>(null);
  // const [maps, setMaps] = useState<string | null>(null);
  // const [geocoder, setGeocoder] = useState<string | null>(null);
  // const [address, setAddress] = useState<string | null>(null);
  // const [marker, setMarker] = useState<string | null>(null);

  // const handleApiLoaded = (obj) => {
  //   setMap(obj.map);
  //   setMaps(obj.maps);
  //   setGeocoder(new obj.maps.Geocoder());
  // };

  // const search = () => {
  //   geocoder.geocode({
  //     address,
  //   }, (results, status) => {
  //     if (status === maps.GeocoderStatus.OK) {
  //       map.setCenter(results[0].geometry.location);
  //       if (marker) {
  //         marker.setMap(null);
  //       }
  //       setMarker(new maps.Marker({
  //         map,
  //         position: results[0].geometry.location,
  //       }));
  //       console.log(results[0].geometry.location.lat());
  //       console.log(results[0].geometry.location.lng());
  //     }
  //   });
  // };

  return (
        <>
          <div className="search-bar-position">
            <div className="search-bar-left" onClick={openMenu}>
              <MenuIcon></MenuIcon>
            </div>
            <div className="search-bar-center">
              <input id="pac-input" type="text" placeholder="検索" />
            </div>
            <div className="search-bar-right">
              <SearchIcon></SearchIcon>
            </div>
          </div>
          <LoadScript googleMapsApiKey = {process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={15}
              onClick={handleMapClick}
            >
              {/* <Marker position={center} /> */}
              {/* ピンを表示 */}
              {markers.map((marker, index) => (
                <Marker key={index} position={marker} />
              ))}
            </GoogleMap>
          </LoadScript>
          <div className={`menu-bar ${isMenuBarActive ? 'active' : ''}`}>
            <CloseIcon onClick={closeMenu} className="close-btn"></CloseIcon>
            <div className="menu-bar-contents">
              <p>みんなの思い出MAP</p>
              <p>このアプリは、時代の変化とともに消えゆく景色を残したいという思いから作られたアプリです。会員登録いただくと、投稿ができるようになります。</p>
              <a href="">ログイン</a>
              <a href="">登録はこちら</a>
              <a href="">使い方</a>
            </div>
          </div>
      <div className={`grey-filter ${isMenuBarActive ? 'active' : ''}`} onClick={closeMenu}></div>
        </>
  );
};

export default MapComponent;