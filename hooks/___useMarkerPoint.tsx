// hooks/useAccountName.js
import { useState } from 'react';
import useMarkerInitialPoint from './useMarkerInitialPoint';

// LatLng型の定義
type LatLng = {
  lat: number,
  lng: number,
}

// マーカーポイントの型定義
// ここでオーバーロードが一致しないとエラーが出る、一旦anyにて定義
// type MarkerPoint = LatLng | null;
type MarkerPoint = any;


const useMarkerPoint = () => {
  const { center, setCenter } = useMarkerInitialPoint();
  const [markerPoint, setMarkerPoint] = useState<MarkerPoint>(center);

  return {
    markerPoint,
    setMarkerPoint
  };
};

export default useMarkerPoint;
