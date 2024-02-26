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
// type PostingUserInformationContextType = {
//   postingUserInformation: {
//     dateAndTime: string;
//     name: string;
//     text: string;
//     id: string;
//     lat: number;
//     lng: number;
//   }[] | null;
//   setPostingUserInformation: React.Dispatch<React.SetStateAction<{
//     dateAndTime: string;
//     name: string;
//     text: string;
//     id: string;
//     lat: number;
//     lng: number;
//   }[] | null>>;
// };

// コンテキスト作成、デフォルト値をnullに設定
// const PostingUserInformationContext = createContext();
const PostingUserInformationContext = createContext<PostingUserInformationContextType | null>(null);

// カスタムフックの作成
export const usePostingUserInformationContext = () => useContext(PostingUserInformationContext);

interface PostingUserInformationProviderProps {
    children: ReactNode;
}

export const PostingUserInformationProvider = ({ children }: PostingUserInformationProviderProps) => {
  const [postingUserInformation, setPostingUserInformation] = useState<PostingUserInformation[] | null>(null);

  return (
    <PostingUserInformationContext.Provider value={{ postingUserInformation, setPostingUserInformation }}>
      {children}
    </PostingUserInformationContext.Provider>
  );
};