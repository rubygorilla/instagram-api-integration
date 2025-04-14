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
        console.log("parsed data=", parsed);
        setProfileData(parsed);
      } catch (err) {
        console.error("❌ Failed to parse profile data", err);
      }
    }
  }, [data]);

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!profileData) return <p>Loading profile data...</p>;

  const { profile, stats } = profileData;
  const reachData = stats?.reach?.data?.[0]?.values || [];

  return (
    <div style={{
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(to right, #fdfbfb, #ebedee)',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={profile.profile_picture_url}
            alt="Profile"
            style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid #FF4081' }}
          />
          <div>
            <h2 style={{ margin: 0 }}>@{profile.username}</h2>
            <p style={{ color: '#555', margin: 0 }}>Instagram Business Account</p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0 }}>{profile.followers_count}</h3>
            <p style={{ margin: 0, color: '#777' }}>Followers</p>
          </div>
          <div>
            <h3 style={{ margin: 0 }}>{profile.follows_count}</h3>
            <p style={{ margin: 0, color: '#777' }}>Following</p>
          </div>
        </div>

        {reachData.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h4 style={{ color: '#FF4081', marginBottom: '10px' }}>📊 Daily Reach</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {reachData.slice(0, 5).map((item, index) => (
                <li key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #eee',
                  padding: '4px 0'
                }}>
                  <span>{new Date(item.end_time).toLocaleDateString()}</span>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}