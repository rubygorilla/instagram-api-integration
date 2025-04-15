import { useEffect, useState } from 'react';

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [replyText, setReplyText] = useState({});
  const [sendingReply, setSendingReply] = useState({});
  const [error, setError] = useState('');
  const token = sessionStorage.getItem('accessToken');

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';

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
    <div style={{
      background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af)',
      minHeight: '100vh',
      width: '100%',
      padding: '2rem 0',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Profile Header */}
        <div className="text-center mb-5 text-white">
          <h2 className="fw-bold">📸 Instagram Profile</h2>
          <h5>@{profileData.profile.username}</h5>
          <img
            src={profileData.profile.profile_picture_url}
            alt="Profile"
            className="rounded-circle shadow border border-2 border-white"
            width="120"
            style={{ marginTop: '10px' }}
          />
          <p className="mt-2">
            {profileData.profile.followers_count} followers • {profileData.profile.follows_count} following
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="d-flex justify-content-center gap-2 flex-wrap mb-4">
          {['ALL', 'IMAGE', 'VIDEO', 'REEL'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`btn btn-sm rounded-pill px-3 ${filter === type ? 'btn-light text-dark' : 'btn-outline-light'}`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Media Cards */}
        <div className="row">
          {filteredMedia?.map(media => (
            <div key={media.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                <a href={media.permalink} target="_blank" rel="noopener noreferrer">
                  <img
                    src={media.media_url}
                    alt={media.caption || 'Instagram media'}
                    className="card-img-top"
                    style={{ height: 250, objectFit: 'cover' }}
                  />
                </a>
                <div className="card-body">
                  <p className="card-text fw-semibold">{media.caption?.slice(0, 100) || 'No caption'}</p>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>
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
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>No comments yet</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
