// hooks/useAccountName.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../libs/firebase';

const useAccountName = () => {
  const [name, setName] = useState<string>("");

  // アカウント名の取得
  const accountNameAcquisition = () => {
    const accountName: any = auth.currentUser;
    setName(accountName.displayName);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        accountNameAcquisition();
      }
    });

    return () => unsubscribe();

  }, []);

  return name;
};

export default useAccountName;
