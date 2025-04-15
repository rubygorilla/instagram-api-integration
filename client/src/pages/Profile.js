import { useEffect, useState } from 'react';

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [replyText, setReplyText] = useState({});
  const [sendingReply, setSendingReply] = useState({});
  const [error, setError] = useState('');
  const token = sessionStorage.getItem('accessToken');

  // Load data from sessionStorage
  useEffect(() => {
    const raw = sessionStorage.getItem('profileData');
    if (raw) {
      try {
        setProfileData(JSON.parse(raw));
      } catch (e) {
        console.error('Invalid session data', e);
        sessionStorage.removeItem('profileData');
        setError('Invalid session data');
      }
    } else {
      setError('No profile data found. Please log in again.');
    }
  }, []);

  const filteredMedia = profileData?.media?.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'REEL') return item.media_type === 'VIDEO' && item.caption?.toLowerCase().includes('reel');
    return item.media_type === filter;
  });

  // ✅ Now keyed by commentId instead of mediaId
  const handleReplyChange = (commentId, value) => {
    setReplyText(prev => ({ ...prev, [commentId]: value }));
  };

  const handleReplySubmit = async (mediaId, commentId) => {
    const text = replyText[commentId];
    if (!text?.trim()) return;
  
    if (!token) {
      alert('Access token missing. Please log in again.');
      return;
    }
  
    setSendingReply(prev => ({ ...prev, [commentId]: true }));
    try {
      const res = await fetch(`https://iaibackend.vercel.app/api/comments/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, commentId, message: text, token }), // ✅ include accessToken
      });
  
      const result = await res.json();
      console.log("result from reply post="+JSON.stringify(result));
      if (result.success) {
        alert('✅ Reply sent!');
        setReplyText(prev => ({ ...prev, [commentId]: '' }));
      } else {
        alert('❌ Failed to send reply');
      }
    } catch (err) {
      alert('❌ Error sending reply');
    } finally {
      setSendingReply(prev => ({ ...prev, [commentId]: false }));
    }
  };
  ;

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!profileData) return <p>Loading profile data...</p>;

  return (
    <div style={{ padding: 20, maxWidth: '100%', background: '#f9f9f9' }}>
      <h1>📸 Instagram Profile</h1>
      <div style={{ marginBottom: 20 }}>
        <h2>@{profileData.profile.username}</h2>
        <img
          src={profileData.profile.profile_picture_url}
          alt="Profile"
          width="100"
          style={{ borderRadius: '50%' }}
        />
        <p>
          {profileData.profile.followers_count} followers • {profileData.profile.follows_count} following
        </p>
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
                cursor: 'pointer',
              }}
            >
              {type}
            </button>
          ))}
        </div>

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
                paddingBottom: 10,
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
                  <p style={{ fontSize: 14, margin: 0, fontWeight: 500 }}>
                    {media.caption?.slice(0, 100) || 'No caption'}
                  </p>
                  <p style={{ fontSize: 12, color: 'gray', margin: 0 }}>
                    {new Date(media.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </a>

              {/* 💬 Comments Section */}
              <div style={{ padding: '0 10px' }}>
                <h4 style={{ fontSize: 13, marginBottom: 5 }}>💬 Comments</h4>
                {media.comments?.length ? (
                  media.comments.map(comment => (
                    <div key={comment.id} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 13 }}>{comment.text}</div>
                      <div style={{ marginTop: 5 }}>
                        <input
                          type="text"
                          placeholder="Reply..."
                          value={replyText[comment.id] || ''}
                          onChange={e => handleReplyChange(comment.id, e.target.value)}
                          style={{ width: '70%', marginRight: 5, fontSize: 12 }}
                        />
                        <button
                          onClick={() => handleReplySubmit(media.id, comment.id)}
                          disabled={sendingReply[comment.id]}
                          style={{
                            padding: '4px 8px',
                            fontSize: 12,
                            backgroundColor: '#e91e63',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                          }}
                        >
                          {sendingReply[comment.id] ? 'Replying...' : 'Reply'}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 12, color: 'gray' }}>No comments yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
