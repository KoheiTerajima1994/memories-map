import { useState } from 'react';

// マーカーポイントの型定義
type MarkerPoint = {
  lat: number,
  lng: number,
} | null

const useMarkerInitialPoint = () => {
  // マップ初期位置
  const [center, setCenter] = useState<MarkerPoint>({
    lat: 35.68134074965259,
    lng: 139.76719989855425,
});
  return {
    center,
    setCenter
  };
};

export default useMarkerInitialPoint;
