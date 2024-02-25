// hooks/useAccountName.js
import { useState } from 'react';

const useIsOpenPostModal = () => {
  const [isOpenPostModal, setIsOpenPostModal] = useState<boolean>(false);
  return {
    isOpenPostModal,
    setIsOpenPostModal
  };
};

export default useIsOpenPostModal;
