// ReactNodeは任意のReactコンポーネントを渡せることを示している
import React, { createContext, useContext, useState, ReactNode } from 'react';

// const PostModalContext = createContext();
// コンテキスト作成、デフォルト値をfalseに設定
// setIsOpenPostModalはboolean型の状態を更新する関数であることを示している
const PostModalContext = createContext<{ isOpenPostModal: boolean; setIsOpenPostModal: React.Dispatch<React.SetStateAction<boolean>> }>({
    isOpenPostModal: false,
    setIsOpenPostModal: () => {}
  });

// カスタムフックの作成
export const usePostModalContext = () => useContext(PostModalContext);

interface PostModalProviderProps {
    children: ReactNode;
}

// コンテキストを提供するコンポーネント(プロバイダー)
export const PostModalProvider = ({ children }: PostModalProviderProps) => {
  const [isOpenPostModal, setIsOpenPostModal] = useState(false);

  return (
    <PostModalContext.Provider value={{ isOpenPostModal, setIsOpenPostModal }}>
      {children}
    </PostModalContext.Provider>
  );
};