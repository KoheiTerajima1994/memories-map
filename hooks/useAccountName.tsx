import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../libs/firebase';

const useAccountName = () => {
  const [name, setName] = useState<string>("");

  // アカウント名の取得
  const accountNameAcquisition = () => {
    // null合体演算子を使用し、nullまたはundefined出ない場合に値を返す
    const accountName: string | null | undefined = auth.currentUser?.displayName;
    if(accountName) {
      setName(accountName);
    }
  };

  // ログイン監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // ログイン状態であれば、アカウント名取得
      if (currentUser) {
        accountNameAcquisition();
      }
    });
    return () => unsubscribe();
  }, []);
  return name;
};

export default useAccountName;
