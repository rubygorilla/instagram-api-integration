import { useEffect, useState } from 'react';

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [replyText, setReplyText] = useState({});
  const [sendingReply, setSendingReply] = useState({});
  const [error, setError] = useState('');
  const token = sessionStorage.getItem('accessToken');

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
        body: JSON.stringify({ commentId, message: text, accessToken: token }),
      });

      const result = await res.json();
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

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!profileData) return <p>Loading profile data...</p>;

  return (
    <div className="container mt-4">
  <div className="text-center mb-4">
    {/* Profile header... */}
  </div>

  {/* <div className="mb-3 text-center">
    <h3 style={{ color: '#e91e63' }}>📊 Daily Reach</h3>
    <ul className="list-unstyled">
      {profileData.stats.reach.data.map((entry, i) => (
        <li key={i}>
          {entry.end_time ? new Date(entry.end_time).toLocaleDateString() : 'N/A'} – {entry.values[0].value}
        </li>
      ))}
    </ul>
  </div> */}

  <div className="text-center">
    <h3 style={{ color: '#e91e63' }}>🧵 Recent Posts</h3>
    <div className="mb-3">
      {['ALL', 'IMAGE', 'VIDEO', 'REEL'].map(type => (
        <button
          key={type}
          onClick={() => setFilter(type)}
          className={`btn btn-sm me-2 ${filter === type ? 'btn-danger' : 'btn-outline-secondary'}`}
        >
          {type}
        </button>
      ))}
    </div>
  </div>

  {/* Centered grid */}
  <div className="d-flex flex-wrap justify-content-center gap-3">
    {filteredMedia?.map(media => (
      <div key={media.id} className="card shadow-sm" style={{ width: '300px' }}>
        <a href={media.permalink} target="_blank" rel="noopener noreferrer">
          <img
            src={media.media_url}
            alt={media.caption || 'Instagram media'}
            className="card-img-top"
            style={{ height: 200, objectFit: 'cover' }}
          />
        </a>
        <div className="card-body">
          <p className="card-text fw-bold">{media.caption?.slice(0, 100) || 'No caption'}</p>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            {new Date(media.timestamp).toLocaleDateString()}
          </p>
          <h6 className="mt-3">💬 Comments</h6>
          {media.comments?.length ? (
            media.comments.map(comment => (
              <div key={comment.id} className="mb-2">
                <div>{comment.text}</div>
                <div className="d-flex mt-1">
                  <input
                    type="text"
                    className="form-control form-control-sm me-2"
                    placeholder="Reply..."
                    value={replyText[comment.id] || ''}
                    onChange={e => handleReplyChange(comment.id, e.target.value)}
                  />
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleReplySubmit(media.id, comment.id)}
                    disabled={sendingReply[comment.id]}
                  >
                    {sendingReply[comment.id] ? 'Replying...' : 'Reply'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>No comments yet</p>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
  );
}
