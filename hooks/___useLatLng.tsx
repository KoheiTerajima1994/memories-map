// hooks/useAccountName.js
import { useState } from 'react';

const useLatLng = () => {
  const [latLng, setLatLng] = useState<{lat: number, lng: number} | null>(null);
  return {
    latLng,
    setLatLng
  };
};

export default useLatLng;
