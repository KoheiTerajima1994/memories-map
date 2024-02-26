// ReactNodeは任意のReactコンポーネントを渡せることを示している
import React, { createContext, useContext, useState, ReactNode } from 'react';

// コンテキスト作成、デフォルト値をnullに設定
// const MemoLatLngContext = createContext(null);
const MemoLatLngContext = createContext<{ memoLatLng: { lat: number; lng: number; }[] | null; setMemoLatLng: React.Dispatch<React.SetStateAction<{ lat: number; lng: number; }[] | null>> }>({
  memoLatLng: null,
  setMemoLatLng: () => {}
});

// カスタムフックの作成
export const useMemoLatLngContext = () => useContext(MemoLatLngContext);

interface MemoLatLngProviderProps {
    children: ReactNode;
}

export const MemoLatLngProvider = ({ children }: MemoLatLngProviderProps) => {
  const [memoLatLng, setMemoLatLng] = useState<{lat: number, lng: number}[] | null>(null);

  return (
    <MemoLatLngContext.Provider value={{ memoLatLng, setMemoLatLng }}>
      {children}
    </MemoLatLngContext.Provider>
  );
};