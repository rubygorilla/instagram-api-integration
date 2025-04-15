// pages/storeProfile.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function StoreProfile() {
  const router = useRouter();

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const dataParam = url.searchParams.get('data');
      if (!dataParam) throw new Error('Missing data parameter');

      const decoded = JSON.parse(decodeURIComponent(dataParam));
      sessionStorage.setItem('profileData', JSON.stringify(decoded));

      router.replace('/Profile');
    } catch (err) {
      console.error('Failed to parse profile data', err);
      router.replace('/Profile?error=Invalid+data');
    }
  }, [router]);

  return <p>Storing profile data...</p>;
}
