// src/pages/storeProfile.js
import { useEffect } from 'react';

export default function StoreProfile() {
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const dataParam = url.searchParams.get('data');
      if (!dataParam) throw new Error('Missing data parameter');

      const decoded = JSON.parse(decodeURIComponent(dataParam));
      sessionStorage.setItem('profileData', JSON.stringify(decoded));

      // Redirect to /profile (client-side)
      window.location.href = '/profile';
    } catch (err) {
      console.error('Failed to parse profile data', err);
      window.location.href = '/profile?error=Invalid+data';
    }
  }, []);

  return <p>Storing profile data...</p>;
}
