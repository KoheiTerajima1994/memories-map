// hooks/useAccountName.js
import { useState } from 'react';

const useMemoLatLng = () => {
  const [memoLatLng, setMemoLatLng] = useState<{lat: number, lng: number}[] | null>(null);
  return {
    memoLatLng,
    setMemoLatLng
  };
};

export default useMemoLatLng;
