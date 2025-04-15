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

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

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
      const res = await fetch(`https://instagram-api-integration-server.vercel.app/api/comments/reply`, {
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
      <style jsx>{`
        .media-card {
          border-radius: 1rem;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .media-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
        }
        .media-img-wrapper {
          background: #fff;
          max-height: 400px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }
        .media-img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
          display: block;
        }
        .media-img:hover {
          transform: scale(1.10);
        }
        .badge-image {
          background: linear-gradient(to right, #ff9a9e, #fad0c4);
          color: #000;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
        }
        .badge-video {
          background: linear-gradient(to right, #a18cd1, #fbc2eb);
          color: #000;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
        }
        .badge-reel {
          background: linear-gradient(to right, #fbc2eb, #a6c1ee);
          color: #000;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
        }
        .btn-outline-light {
          border-color: #fff;
          color: #fff;
          transition: all 0.3s ease;
        }
        .btn-outline-light:hover {
          background-color: #fff;
          color: #000;
        }
        input.form-control-sm {
          border-radius: 0.5rem;
        }
        .follow-info {
          font-size: 1.25rem;
          font-weight: 500;
        }
        .logout-btn {
          padding: 0.8rem 1.8rem;       /* Bigger padding for size */
          font-size: 1.25rem;           /* Larger text */
          font-weight: 600;
          background: linear-gradient(135deg, #ff6a00,rgb(251, 249, 250));
          color: #170b0b;
          border: none;
          border-radius: 2.5rem;        /* More rounded */
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
          transition: transform 0.2s ease, box-shadow 0.3s ease;
          z-index: 10;
        }
        .logout-btn:hover {
          transform: scale(1.07);       /* Slight grow on hover */
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
          background: linear-gradient(135deg, #ee0979, #ff6a00);
        }
        .filter-btn {
          padding: 0.8rem 1.8rem;
          font-size: 1.1rem;
          font-weight: 600;
          background: linear-gradient(135deg, #ff9966, #ff5e62);
          color: #fff;
          border: none;
          border-radius: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease, box-shadow 0.3s ease, background 0.3s ease;
        }
      .filter-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        background: linear-gradient(135deg, #ff5e62, #ff9966);
      }
      .filter-btn.active {
        background: #fff;
        color: #000;
        border: 2px solid #ff5e62;
      }
      `}</style>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
        
        {/* Profile Header */}
        <div className="text-center mb-5 text-white position-relative">
        <button onClick={handleLogout} className="logout-btn position-absolute top-0 end-0 mt-3 me-3">
          🚪 Logout
        </button>
          <h2 className="fw-bold">📸 Instagram Profile</h2>
          <h5>@{profileData.profile.username}</h5>
          <img
            src={profileData.profile.profile_picture_url}
            alt="Profile"
            className="rounded-circle shadow border border-2 border-white"
            width="300"
            style={{ marginTop: '10px' }}
          />
          <p className="mt-2 follow-info">
            {profileData.profile.followers_count} followers • {profileData.profile.follows_count} following
          </p>
        </div>
        {/* Filter Buttons */}
        <div className="d-flex justify-content-center gap-2 flex-wrap mb-4">
          {['ALL', 'IMAGE', 'VIDEO', 'REEL'].map(type => (
            <button
            key={type}
            onClick={() => setFilter(type)}
            className={`filter-btn ${filter === type ? 'active' : ''}`}
          >
            {type === 'IMAGE' ? '🖼️ Image' :
             type === 'VIDEO' ? '🎬 Video' :
             type === 'REEL' ? '🎞️ Reel' : '📁 All'}
          </button>
          ))}
        </div>

        {/* Media Cards */}
        <div className="row">
          {filteredMedia?.map(media => (
            <div key={media.id} className="col-md-6 mb-4">
              <div className="card media-card h-100 border-0">
                <a href={media.permalink} target="_blank" rel="noopener noreferrer">
                  <div className="media-img-wrapper">
                    <img
                      src={media.media_url}
                      alt={media.caption || 'Instagram media'}
                      className="media-img"
                    />
                  </div>
                </a>
                <div className="card-body">
                  <span className={`badge mb-2 ${
                    media.media_type === 'IMAGE' ? 'badge-image' :
                    media.media_type === 'VIDEO' && media.caption?.toLowerCase().includes('reel') ? 'badge-reel' :
                    'badge-video'
                  }`}>
                    {media.media_type === 'IMAGE' ? '🖼️ Image' :
                     media.media_type === 'VIDEO' && media.caption?.toLowerCase().includes('reel') ? '🎞️ Reel' :
                     '🎬 Video'}
                  </span>
                  <p className="card-text fw-semibold">{media.caption?.slice(0, 100) || 'No caption'}</p>
                  <p className="text-muted small">
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
                    <p className="text-muted small">No comments yet</p>
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
