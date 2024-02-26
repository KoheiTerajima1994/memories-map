// ReactNodeは任意のReactコンポーネントを渡せることを示している
import React, { createContext, useContext, useState, ReactNode } from 'react';

// コンテキスト作成、デフォルト値をfalseに設定
const UploadStatusModalContext = createContext<{ uploadStatusModal: boolean; setUploadStatusModal: React.Dispatch<React.SetStateAction<boolean>> }>({
    uploadStatusModal: false,
    setUploadStatusModal: () => {}
  });

// カスタムフックの作成
export const useUploadStatusModalContext = () => useContext(UploadStatusModalContext);

interface UploadStatusModalProps {
    children: ReactNode;
}

// コンテキストを提供するコンポーネント(プロバイダー)
export const UploadStatusModalProvider = ({ children }: UploadStatusModalProps) => {
  const [uploadStatusModal, setUploadStatusModal] = useState<boolean>(false);

  return (
    <UploadStatusModalContext.Provider value={{ uploadStatusModal, setUploadStatusModal }}>
      {children}
    </UploadStatusModalContext.Provider>
  );
};