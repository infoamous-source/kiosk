import { useState, useEffect } from 'react';
import type { OSPlatform } from '../types/app';
import { detectOS } from '../utils/os-detection';

export function useOSDetection(): OSPlatform {
  const [os, setOs] = useState<OSPlatform>('unknown');

  useEffect(() => {
    setOs(detectOS());
  }, []);

  return os;
}
