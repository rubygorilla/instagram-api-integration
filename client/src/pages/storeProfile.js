import { useEffect } from 'react';

export default function StoreProfile() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const dataParam = url.searchParams.get('data');
    const token = query.get('token');

    if (!dataParam) {
      console.error('Missing data parameter');
      window.location.href = '/profile?error=Invalid+data';
      return;
    }

    try {
      const decoded = JSON.parse(decodeURIComponent(dataParam));
      sessionStorage.setItem('profileData', JSON.stringify(decoded));
      sessionStorage.setItem('accessToken', token);

      // Clean the URL
      window.history.replaceState({}, document.title, '/storeProfile');

      // Redirect
      window.location.href = '/profile';
    } catch (err) {
      console.error('Failed to parse profile data', err);
      window.location.href = '/profile?error=Invalid+data';
    }
  }, []);

  return <p>Storing profile data...</p>;
}
