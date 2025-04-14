import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Profile() {
  const router = useRouter();
  const { data, error } = router.query;
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        setProfileData(parsed);
      } catch (err) {
        console.error("❌ Failed to parse profile data", err);
      }
    }
  }, [data]);

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>📸 Instagram Profile</h1>
      {profileData ? (
        <pre>{JSON.stringify(profileData, null, 2)}</pre>
      ) : (
        <p>Loading profile data...</p>
      )}
    </div>
  );
}
