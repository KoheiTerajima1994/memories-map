// ReactNodeは任意のReactコンポーネントを渡せることを示している
import React, { createContext, useContext, useState, ReactNode } from 'react';

// コンテキスト作成、デフォルト値をnullに設定
const PostingLatLngContext = createContext<{ postingLatLng: { lat: number; lng: number; }[] | null; setPostingLatLng: React.Dispatch<React.SetStateAction<{ lat: number; lng: number; }[] | null>> }>({
  postingLatLng: null,
  setPostingLatLng: () => {}
});

// カスタムフックの作成
export const usePostingLatLngContext = () => useContext(PostingLatLngContext);

interface PostingLatLngProviderProps {
    children: ReactNode;
}

// コンテキストを提供するコンポーネント(プロバイダー)
export const PostingLatLngProvider = ({ children }: PostingLatLngProviderProps) => {
  const [postingLatLng, setPostingLatLng] = useState<{lat: number, lng: number}[] | null>(null);

  return (
    <PostingLatLngContext.Provider value={{ postingLatLng, setPostingLatLng }}>
      {children}
    </PostingLatLngContext.Provider>
  );
};