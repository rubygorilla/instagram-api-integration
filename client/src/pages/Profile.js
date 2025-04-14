import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Profile() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const data = queryParams.get('data');
  const error = queryParams.get('error');

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        console.log("parsed data="+JSON.stringify(parsed, null, 2))
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
