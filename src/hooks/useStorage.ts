'use client';

import { useStorageContext } from '@/components/StorageProvider';

export const useStorage = () => {
  return useStorageContext();
};
