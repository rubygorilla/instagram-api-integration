// client/pages/store-profile.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StoreProfile() {
  const navigate = useNavigate();

  useEffect(() => {
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
      navigate('/profile');
    } catch (err) {
      console.error('❌ Failed to extract profile from cookie', err);
      navigate('/profile?error=Cookie+error');
    }
  }, [navigate]);

  return <p>Storing profile data...</p>;
}
