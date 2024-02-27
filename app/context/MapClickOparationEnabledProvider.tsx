// ReactNodeは任意のReactコンポーネントを渡せることを示している
import React, { createContext, useContext, useState, ReactNode } from 'react';

// コンテキスト作成、デフォルト値をfalseに設定
const MapClickOparationEnabledContext = createContext<{ mapClickOparationEnabled: boolean; setMapClickOparationEnabled: React.Dispatch<React.SetStateAction<boolean>> }>({
    mapClickOparationEnabled: false,
    setMapClickOparationEnabled: () => {}
  });

// カスタムフックの作成
export const useMapClickOparationEnabledContext = () => useContext(MapClickOparationEnabledContext);

interface MapClickOparationEnabledProps {
    children: ReactNode;
}

// コンテキストを提供するコンポーネント(プロバイダー)
export const MapClickOparationEnabledProvider = ({ children }: MapClickOparationEnabledProps) => {
  const [mapClickOparationEnabled, setMapClickOparationEnabled] = useState<boolean>(false);

  return (
    <MapClickOparationEnabledContext.Provider value={{ mapClickOparationEnabled, setMapClickOparationEnabled }}>
      {children}
    </MapClickOparationEnabledContext.Provider>
  );
};