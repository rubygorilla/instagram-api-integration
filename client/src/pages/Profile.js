import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Profile() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const data = queryParams.get('data');
  const error = queryParams.get('error');

  const [profileData, setProfileData] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [commentsMap, setCommentsMap] = useState({});
  const [replyMap, setReplyMap] = useState({});

  useEffect(() => {
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        setProfileData(parsed);

        // Fetch comments for each media item
        parsed.media.forEach(media => {
          fetch(`https://graph.facebook.com/v19.0/${media.id}/comments?access_token=${parsed.token}`)
            .then(res => res.json())
            .then(result => {
              setCommentsMap(prev => ({ ...prev, [media.id]: result.data || [] }));
            })
            .catch(err => console.error("Failed to fetch comments", err));
        });

      } catch (err) {
        console.error("❌ Failed to parse profile data", err);
      }
    }
  }, [data]);

  const handleReplySubmit = async (commentId, token) => {
    const message = replyMap[commentId];
    if (!message) return;

    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          access_token: profileData.token
        })
      });
      const json = await res.json();
      console.log("✅ Reply sent:", json);
      setReplyMap(prev => ({ ...prev, [commentId]: '' }));
    } catch (err) {
      console.error("❌ Failed to send reply", err);
    }
  };

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  const filteredMedia = profileData?.media?.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'REEL') return item.media_type === 'VIDEO' && item.caption?.includes('reel');
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
                <div
                  key={media.id}
                  style={{
                    width: 'calc(33.33% - 20px)',
                    background: '#fff',
                    borderRadius: 8,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    paddingBottom: 10
                  }}
                >
                  <a
                    href={media.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
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

                  {/* Comments */}
                  <div style={{ padding: '0 10px' }}>
                    {commentsMap[media.id]?.map(comment => (
                      <div key={comment.id} style={{ borderTop: '1px solid #eee', padding: '6px 0' }}>
                        <strong>{comment.username}:</strong> {comment.text}
                        <div style={{ marginTop: 4 }}>
                          <input
                            type="text"
                            placeholder="Reply..."
                            value={replyMap[comment.id] || ''}
                            onChange={(e) => setReplyMap(prev => ({ ...prev, [comment.id]: e.target.value }))}
                            style={{ width: '80%', padding: 4 }}
                          />
                          <button
                            onClick={() => handleReplySubmit(comment.id, profileData.token)}
                            style={{ marginLeft: 5, padding: '4px 10px' }}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
