// ReactNodeは任意のReactコンポーネントを渡せることを示している
import React, { createContext, useContext, useState, ReactNode } from 'react';

// コンテキスト作成、デフォルト値をnullに設定
const LatLngContext = createContext<{ latLng: { lat: number; lng: number; } | null; setLatLng: React.Dispatch<React.SetStateAction<{ lat: number; lng: number; } | null>> }>({
  latLng: null,
  setLatLng: () => {}
});

// カスタムフックの作成
export const useLatLngContext = () => useContext(LatLngContext);

interface LatLngProviderProps {
    children: ReactNode;
}

// コンテキストを提供するコンポーネント(プロバイダー)
export const LatLngProvider = ({ children }: LatLngProviderProps) => {
  const [latLng, setLatLng] = useState<{lat: number, lng: number} | null>(null);

  return (
    <LatLngContext.Provider value={{ latLng, setLatLng }}>
      {children}
    </LatLngContext.Provider>
  );
};