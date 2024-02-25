// hooks/useAccountName.js
import { useState } from 'react';

const usePostingLatLng = () => {
  const [postingLatLng, setPostingLatLng] = useState<{lat: number, lng: number}[] | null>(null);
  return {
    postingLatLng,
    setPostingLatLng
  };
};

export default usePostingLatLng;
