// client/pages/store-profile.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StoreProfile() {
  const router = useRouter();

  useEffect(() => {
    // Remove Facebook's #_=_ quirk
    if (window.location.hash === '#_=_') {
      history.replaceState(null, '', window.location.pathname);
    }

    const { data } = router.query;

    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data));
        sessionStorage.setItem('profileData', JSON.stringify(decoded));

        router.replace('/Profile');
      } catch (err) {
        console.error("Failed to parse/store profile data", err);
        router.replace('/Profile?error=Invalid+data');
      }
    } else {
      router.replace('/Profile?error=Missing+data');
    }
  }, [router.query]);

  return <p>Storing profile data...</p>;
}
