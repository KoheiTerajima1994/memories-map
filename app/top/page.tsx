// import React from 'react';

// const TopPage = () => {
//   return (
//     <div>
//       <p>これはトップページです。</p>
//     </div>
//   );
// };

// export default TopPage;

"use client"

import { useCallback, useRef, useState } from 'react';

// mui
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CircularProgress, TextField } from '@mui/material';;

// GoogleMap
import {
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

const theme = createTheme();
const containerStyle = {
  height: "70vh",
  width: "100%",
};

// Google側の設定引用
type Libraries = ("drawing" | "geometry" | "localContext" | "places" | "visualization")[];
const libraries: Libraries = ["places"]; // PlacesAPIを使用します。

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

type MarkerPoint = {
  lat: number,
  lng: number,
}
const center: MarkerPoint = { // なんとなくの六本木です
  lat: 35.66581861,
  lng: 139.72951166,
};

let Map: google.maps.Map;
let infoWindows: Array<google.maps.InfoWindow | undefined | null> = [];

// GoogleMapコンポーネント
export default function SearchMap() {
  const [searchWord, setSearchWord] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [markerPoint, setMarkerPoint] = useState<MarkerPoint>(center);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY, // ご利用環境のAPIキーを設定
    libraries,
  });
  const mapRef = useRef();
  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  // Map描画まで画面を見せない
  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  /**
   * 入力されたワードでMap検索開始
   *
   */
  function getMapData() {
    try {
      setIsLoading(true);
      const geocoder = new window.google.maps.Geocoder();
      let getLat = 0;
      let getLng = 0;
      geocoder.geocode({ address: searchWord }, async (results, status) => {
        if (status === 'OK' && results) {
          getLat = results[0].geometry.location.lat();
          getLng = results[0].geometry.location.lng();
          const center = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          setMarkerPoint(center);
          getNearFood(getLat, getLng);
        }
      });

      setIsLoading(false);
    } catch (error) {
      alert('検索処理でエラーが発生しました！');
      setIsLoading(false);
      throw error;
    }
  }

  /**
   * 近場のご飯屋さんを検索して表示
   *
   */
  function getNearFood(lat: Number, lng: Number) {
    try {
      if (document.getElementById('map') == null || typeof document.getElementById('map') == null) {
        return;
      }
      var pyrmont = new google.maps.LatLng(
        parseFloat(lat.toString()),
        parseFloat(lng.toString()),
      );
      Map = new google.maps.Map(document.getElementById('map')!, {
        center: pyrmont,
        zoom: 17
      });

      var request = {
        location: pyrmont,
        radius: 500,
        type: "restaurant",
        keyword: '居酒屋', // 検索地点の付近を`keyword`を使って検索する
      };
      var service = new google.maps.places.PlacesService(Map);
      service.nearbySearch(request, callback);
    } catch (error) {
      alert('検索処理でエラーが発生しました！');
      throw error;
    }
  }

  /**
   * `nearbySearch`のコールバック処理
   *
   */
  function callback(result: any, status: any) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < result.length; i++) {
        createMarker(result[i]);
      }
    }
    return;
  }

  /**
   * 検索結果の箇所にマーカーを設定する
   *
   */
  function createMarker(place: google.maps.places.PlaceResult) {
    if (!place.geometry || !place.geometry.location) return;
    // お店情報マーカー
    const marker = new google.maps.Marker({
      map: Map,
      position: place.geometry.location,
      title: place.name,
      label: place.name?.substr(0, 1),
      optimized: false,
    });

    // お店情報ウィンドウ
    infoWindows[0] = new google.maps.InfoWindow();

    // ウィンドウにて表示する情報
    const price = (place.price_level) ? place.price_level : '取得できませんでした';

    const infoList = [
      place.name,
      `ランク：${place.rating}`,
      `金額：${price}`,
      (place.photos && place.photos.length > 0) ?
        `<p><img style="max-width:200px" src="${place.photos[0].getUrl()}"/></p>` : null
    ];

    const info = infoList.join('<br>'); // 改行区切りで加工して見せる
    google.maps.event.addListener(marker, "click", () => {
      if (infoWindows[1]) infoWindows[1].close(); // マーカーの詳細表示を複数表示をさせない
      if (infoWindows[0] == undefined || infoWindows[0] == null) return;
      infoWindows[0].close();
      infoWindows[0].setContent(info);
      infoWindows[0].open(marker.getMap(), marker);
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <Box>
          <GoogleMap
            id="map"
            mapContainerStyle={containerStyle}
            zoom={17}
            center={markerPoint}
            options={options}
            onLoad={onMapLoad}
          >
            <Marker position={markerPoint} />
          </GoogleMap>
        </Box>
        <Box component="form" sx={{ mt: 2 }}>
          {
            isLoading === true ? <div style={{
              marginTop: 10, textAlign
                : 'center'
            }}>
              <CircularProgress />
            </div> : null
          }
          <TextField id="standard-basic" label="検索ワード" variant="standard"
            value={searchWord}
            style={{ width: '100%' }}
            onChange={(e) => { setSearchWord(e.target.value) }} />
          <Button
            type="button"
            onClick={async () => { await getStaionInfo() }}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            検索
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}