// ReactNodeは任意のReactコンポーネントを渡せることを示している
import React, { createContext, useContext, useState, ReactNode } from 'react';

// コンテキスト作成、デフォルト値をfalseに設定
const LoadingContext = createContext<{ loading: boolean; setLoading: React.Dispatch<React.SetStateAction<boolean>> }>({
    loading: false,
    setLoading: () => {}
  });

// カスタムフックの作成
export const useLoadingContext = () => useContext(LoadingContext);

interface LoadingProps {
    children: ReactNode;
}

// コンテキストを提供するコンポーネント(プロバイダー)
export const LoadingProvider = ({ children }: LoadingProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};