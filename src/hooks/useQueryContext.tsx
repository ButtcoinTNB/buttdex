'use client';

import { useSearchParams } from 'next/navigation';
import { EndpointTypes } from '@/models/types';

export default function useQueryContext() {
  const searchParams = useSearchParams();
  const cluster = searchParams?.get('cluster');

  const endpoint = cluster ? (cluster as EndpointTypes) : 'mainnet';
  const hasClusterOption = endpoint !== 'mainnet';
  
  const fmtUrlWithCluster = (url: string) => {
    if (hasClusterOption) {
      const mark = url.includes('?') ? '&' : '?';
      return decodeURIComponent(`${url}${mark}cluster=${endpoint}`);
    }
    return url;
  };

  return {
    fmtUrlWithCluster,
  };
} 