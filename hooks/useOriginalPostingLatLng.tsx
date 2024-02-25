// hooks/useAccountName.js
import { useState } from 'react';

const useOriginalPostingLatLng = () => {
  const [originalPostingLatLng, setOriginalPostingLatLng] = useState<{lat: number, lng: number}[] | null>(null);
  return {
    originalPostingLatLng,
    setOriginalPostingLatLng
  };
};

export default useOriginalPostingLatLng;
