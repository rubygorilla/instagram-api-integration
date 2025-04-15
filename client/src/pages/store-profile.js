// client/pages/store-profile.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function StoreProfile() {
  const router = useRouter();

  useEffect(() => {
    try {
      const cookieStr = document.cookie
        .split('; ')
        .find(row => row.startsWith('insta_profile='));

      if (!cookieStr) throw new Error("Cookie not found");

      const encodedData = cookieStr.split('=')[1];
      const decoded = JSON.parse(decodeURIComponent(encodedData));

      sessionStorage.setItem('profileData', JSON.stringify(decoded));

      // Optionally delete the cookie (it's HttpOnly=false)
      document.cookie = "insta_profile=; Max-Age=0; path=/";

      router.replace('/Profile');
    } catch (err) {
      console.error("Failed to extract profile from cookie", err);
      router.replace('/Profile?error=Cookie+error');
    }
  }, []);

  return <p>Storing profile data...</p>;
}
