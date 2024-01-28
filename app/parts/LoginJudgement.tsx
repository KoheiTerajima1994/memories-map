"use client";

import { auth } from "@/libs/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

// propsにて渡すものの型定義
interface LoginJudgementProps {
  user: User | null;
  name: string;
}

// React.FCとは、constによる型定義でコンポーネントを定義できる型
const LoginJudgement: React.FC<LoginJudgementProps> = (props) => {
  // ログインしているか否かを判定する処理→ログイン状態ならば、top-under-menuとアカウント名を表示
  const [isUnderMenuActive, setIsUnderMenuActive] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState<string>("");

  // アカウント名の取得
  const accountNameAcquisition = () => {
    const accountName: any = auth.currentUser;
    setName(accountName.displayName);
  }

  useEffect(() => {
      onAuthStateChanged(auth, (currentUser) => {
          if(currentUser) {
              setUser(currentUser);
              setIsUnderMenuActive(true);
              accountNameAcquisition();
          }
      });
  }, []);

  // このコンポーネントでは何も表示しないため、nullを返す
  return null;
}

export default LoginJudgement;