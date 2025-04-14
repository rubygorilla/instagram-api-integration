import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Profile() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const data = queryParams.get('data');
  const error = queryParams.get('error');

  const [profileData, setProfileData] = useState(null);
  const [filter, setFilter] = useState('ALL');

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

  const filteredMedia = profileData?.media?.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'REEL') return item.media_type === 'VIDEO' && item.caption?.includes('reel'); // optional reel detection
    return item.media_type === filter;
  });

  return (
    <div style={{ padding: 20, maxWidth: '100%', background: '#f9f9f9' }}>
      <h1>📸 Instagram Profile</h1>
      {profileData ? (
        <>
          <div style={{ marginBottom: 20 }}>
            <h2>@{profileData.profile.username}</h2>
            <img src={profileData.profile.profile_picture_url} alt="Profile" width="100" style={{ borderRadius: '50%' }} />
            <p>{profileData.profile.followers_count} followers • {profileData.profile.follows_count} following</p>
          </div>

          <h2 style={{ color: 'deeppink' }}>📊 Daily Reach</h2>
          <ul>
            {profileData.stats.reach.data.map((entry, i) => (
              <li key={i}>
                {new Date(entry.end_time).toLocaleDateString()} – {entry.values[0].value}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 30 }}>
            <h2 style={{ color: 'deeppink' }}>📜 Recent Posts</h2>

            {/* Filter Buttons */}
            <div style={{ marginBottom: 20 }}>
              {['ALL', 'IMAGE', 'VIDEO', 'REEL'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  style={{
                    marginRight: 10,
                    padding: '6px 12px',
                    backgroundColor: filter === type ? '#e91e63' : '#ddd',
                    color: filter === type ? 'white' : 'black',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Media Grid */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {filteredMedia?.map(media => (
                <a
                  key={media.id}
                  href={media.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    width: 'calc(33.33% - 20px)',
                    background: '#fff',
                    borderRadius: 8,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <img
                    src={media.media_url}
                    alt={media.caption || 'Instagram media'}
                    style={{ width: '100%', height: 250, objectFit: 'cover' }}
                  />
                  <div style={{ padding: 10 }}>
                    <p style={{ fontSize: 14, margin: 0, fontWeight: 500 }}>{media.caption?.slice(0, 100) || 'No caption'}</p>
                    <p style={{ fontSize: 12, color: 'gray', margin: 0 }}>{new Date(media.timestamp).toLocaleDateString()}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p>Loading profile data...</p>
      )}
    </div>
  );
}
