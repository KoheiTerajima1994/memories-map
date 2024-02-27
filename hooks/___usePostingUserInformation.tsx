// hooks/useAccountName.js
import { useState } from 'react';

const usePostingUserInformation = () => {
  const [postingUserInformation, setPostingUserInformation] = useState<{dateAndTime: string, name: string, text: string, id: string, lat: number, lng: number}[] | null>(null);
  return {
    postingUserInformation,
    setPostingUserInformation
  };
};

export default usePostingUserInformation;
