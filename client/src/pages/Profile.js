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
      } catch (err) {
        console.error("❌ Failed to parse profile data", err);
      }
    }
  }, [data]);

  useEffect(() => {
    const fetchComments = async () => {
      if (profileData?.media && profileData.token) {
        const commentsByMedia = {};
        for (const media of profileData.media) {
          try {
            const res = await fetch(`https://graph.facebook.com/v19.0/${media.id}/comments?access_token=${profileData.token}`);
            const data = await res.json();
            commentsByMedia[media.id] = data?.data || [];
          } catch (err) {
            console.error(`❌ Failed to fetch comments for media ${media.id}`, err);
          }
        }
        setCommentsMap(commentsByMedia);
      }
    };

    fetchComments();
  }, [profileData]);

  const handleReplySubmit = async (commentId, token) => {
    const message = replyMap[commentId];
    if (!message) return;

    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, access_token: token }),
      });

      if (res.ok) {
        alert("Reply posted successfully!");
        setReplyMap(prev => ({ ...prev, [commentId]: '' }));
      } else {
        const error = await res.json();
        alert(`Error: ${error.error?.message}`);
      }
    } catch (err) {
      console.error('❌ Failed to post reply:', err);
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
                    textDecoration: 'none',
                    color: 'inherit',
                    width: 'calc(33.33% - 20px)',
                    background: '#fff',
                    borderRadius: 8,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <a
                    href={media.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={media.media_url}
                      alt={media.caption || 'Instagram media'}
                      style={{ width: '100%', height: 250, objectFit: 'cover' }}
                    />
                  </a>
                  <div style={{ padding: 10 }}>
                    <p style={{ fontSize: 14, margin: 0, fontWeight: 500 }}>{media.caption?.slice(0, 100) || 'No caption'}</p>
                    <p style={{ fontSize: 12, color: 'gray', margin: 0 }}>{new Date(media.timestamp).toLocaleDateString()}</p>
                  </div>

                  {/* Comments */}
                  <div style={{ padding: '0 10px 10px', background: '#fafafa', borderTop: '1px solid #eee' }}>
                    {commentsMap[media.id]?.length ? commentsMap[media.id].map(comment => (
                      <div key={comment.id} style={{ padding: '6px 0' }}>
                        <strong>{comment.username}:</strong> {comment.text}
                        <div style={{ display: 'flex', marginTop: 4 }}>
                          <input
                            type="text"
                            placeholder="Reply..."
                            value={replyMap[comment.id] || ''}
                            onChange={(e) => setReplyMap(prev => ({ ...prev, [comment.id]: e.target.value }))}
                            style={{ flex: 1, padding: 6, border: '1px solid #ccc', borderRadius: 4 }}
                          />
                          <button
                            onClick={() => handleReplySubmit(comment.id, profileData.token)}
                            style={{
                              marginLeft: 6,
                              padding: '6px 12px',
                              background: '#e91e63',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer'
                            }}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    )) : <p style={{ color: '#888', fontSize: 13 }}>No comments yet</p>}
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
