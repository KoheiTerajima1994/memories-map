// ReactNodeは任意のReactコンポーネントを渡せることを示している
import React, { createContext, useContext, useState, ReactNode } from 'react';

// コンテキスト作成、デフォルト値をfalseに設定
const IsUpLoadingContext = createContext<{ isUploaded: boolean; setIsUploaded: React.Dispatch<React.SetStateAction<boolean>> }>({
    isUploaded: false,
    setIsUploaded: () => {}
  });

// カスタムフックの作成
export const useIsUpLoadingContext = () => useContext(IsUpLoadingContext);

interface UploadingProps {
    children: ReactNode;
}

// コンテキストを提供するコンポーネント(プロバイダー)
export const UploadingProvider = ({ children }: UploadingProps) => {
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  return (
    <IsUpLoadingContext.Provider value={{ isUploaded, setIsUploaded }}>
      {children}
    </IsUpLoadingContext.Provider>
  );
};