// ReactNodeは任意のReactコンポーネントを渡せることを示している
import React, { createContext, useContext, useState, ReactNode } from 'react';

// 型定義
type PostingUserInformation = {
  dateAndTime: string;
  name: string;
  text: string;
  id: string;
  lat: number;
  lng: number;
};
type PostingUserInformationContextType = {
  postingUserInformation: PostingUserInformation[] | null;
  setPostingUserInformation: React.Dispatch<React.SetStateAction<PostingUserInformation[] | null>>;
};

// コンテキスト作成、デフォルト値をnullに設定
const PostingUserInformationContext = createContext<PostingUserInformationContextType | null>(null);

// カスタムフックの作成
export const usePostingUserInformationContext = () => {
  const context = useContext(PostingUserInformationContext);
  // nullを返させないため
  if (!context) {
    throw new Error("値が入っていないため、nullを返します。");
  }
  return context;
};

interface PostingUserInformationProviderProps {
    children: ReactNode;
}

// コンテキストを提供するコンポーネント(プロバイダー)
export const PostingUserInformationProvider = ({ children }: PostingUserInformationProviderProps) => {
  const [postingUserInformation, setPostingUserInformation] = useState<PostingUserInformation[] | null>(null);

  return (
    <PostingUserInformationContext.Provider value={{ postingUserInformation, setPostingUserInformation }}>
      {children}
    </PostingUserInformationContext.Provider>
  );
};