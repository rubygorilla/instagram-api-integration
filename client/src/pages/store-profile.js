// client/pages/store-profile.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function StoreProfile() {
  const router = useRouter();

  useEffect(() => {
    const { data } = router.query;
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        sessionStorage.setItem('profileData', JSON.stringify(parsed));
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
