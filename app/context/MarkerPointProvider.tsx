// ReactNodeは任意のReactコンポーネントを渡せることを示している
import React, { createContext, useContext, useState, ReactNode } from 'react';
import useMarkerInitialPoint from '../../hooks/useMarkerInitialPoint';

// 型定義
type LatLng = {
  lat: number,
  lng: number,
}
// type MarkerPoint = LatLng | null;
// 正しい型の付け方がわからない
type MarkerPoint = any;

// コンテキスト作成
const MarkerPointContext = createContext<{ markerPoint: MarkerPoint; setMarkerPoint: (point: MarkerPoint) => void } | undefined>(undefined);

// カスタムフックの作成
export const useMarkerPointContext = () => {
  const context = useContext(MarkerPointContext);
  if (!context) {
    throw new Error("useMarkerPointContext must be used within a MarkerPointProvider");
  }
  return context;
};

interface MarkerPointContextProps {
    children: ReactNode;
}

// コンテキストを提供するコンポーネント(プロバイダー)
export const MarkerPointProvider = ({ children }: MarkerPointContextProps) => {
  const { center, setCenter } = useMarkerInitialPoint();
  const [markerPoint, setMarkerPoint] = useState<MarkerPoint>(center);

  return (
    <MarkerPointContext.Provider value={{ markerPoint, setMarkerPoint }}>
      {children}
    </MarkerPointContext.Provider>
  );
};
