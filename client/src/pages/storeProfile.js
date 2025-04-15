// client/pages/store-profile.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function StoreProfile() {
  const router = useRouter();

  useEffect(() => {
    // Fix Facebook redirect quirk
    // Clean up Facebook hash fragment
    if (window.location.hash === '#_=_') {
      window.history.replaceState(null, '', window.location.pathname);
    }

    try {
      // Find the insta_profile cookie
      const cookieStr = document.cookie
        .split('; ')
        .find(row => row.startsWith('insta_profile='));

      if (!cookieStr) throw new Error("insta_profile cookie not found");

      const encodedData = cookieStr.split('=')[1];
      const decoded = JSON.parse(decodeURIComponent(encodedData));

      // Store profile data in sessionStorage
      sessionStorage.setItem('profileData', JSON.stringify(decoded));

      // Delete the cookie
      document.cookie = 'insta_profile=; Max-Age=0; Path=/';

      // Redirect to profile page
      router.replace('/Profile');
    } catch (err) {
      console.error('Failed to extract profile from cookie', err);
      router.replace('/Profile?error=Cookie+error');
    }
  }, [router]);

  return <p>Storing profile data...</p>;
}