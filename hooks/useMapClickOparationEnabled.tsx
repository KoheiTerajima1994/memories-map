// hooks/useAccountName.js
import { useState } from 'react';

const useMapClickOparationEnabled = () => {
  const [mapClickOparationEnabled, setMapClickOparationEnabled] = useState<boolean>(false);
  return {
    mapClickOparationEnabled,
    setMapClickOparationEnabled
  };
};

export default useMapClickOparationEnabled;
