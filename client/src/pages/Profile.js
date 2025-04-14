import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  
  useEffect(() => {
    if (!token) {
      setError('No access token found. Please login again.');
      setLoading(false);
      return;
    }
    
    const fetchProfileData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await axios.get(`http://localhost:5000/api/profile?token=${token}`);
        setProfile(profileResponse.data);
        
        // Fetch media data
        const mediaResponse = await axios.get(`http://localhost:5000/api/media?token=${token}`);
        setMedia(mediaResponse.data.data || []);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    
    fetchProfileData();
  }, [token]);
  
  const handleCommentSubmit = async (e, mediaId) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    try {
      await axios.post('http://localhost:5000/api/comment', {
        token,
        mediaId,
        text: commentText
      });
      
      // Clear the comment text and refresh media data
      setCommentText('');
      setSelectedMedia(null);
      
      const mediaResponse = await axios.get(`http://localhost:5000/api/media?token=${token}`);
      setMedia(mediaResponse.data.data || []);
      
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
    }
  };
  
  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  
  return (
    <div className="container mt-4">
      {profile && (
        <div className="card mb-4 text-center">
          <div className="card-body">
            {profile.profile_picture_url && (
              <img
                src={profile.profile_picture_url}
                alt={`${profile.username}'s profile`}
                className="rounded-circle mb-3"
                style={{ width: 120, height: 120, objectFit: 'cover' }}
              />
            )}
            <h2 className="card-title">@{profile.username}</h2>
            <p className="card-text">Followers: {profile.followers_count}</p>
            <p className="card-text">Following: {profile.follows_count}</p>
          </div>
        </div>
      )}
      
      <h3 className="mb-3">Your Media</h3>
      
      <div className="row">
        {media.length > 0 ? (
          media.map(item => (
            <div key={item.id} className="col-md-4 mb-4">
              <div className="card h-100">
                {item.media_type === 'IMAGE' && (
                  <img src={item.media_url} alt={item.caption || 'Instagram post'} className="card-img-top" />
                )}
                {item.media_type === 'VIDEO' && (
                  <video controls className="card-img-top">
                    <source src={item.media_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <div className="card-body">
                  <p className="card-text">{item.caption || 'No caption'}</p>
                  <p className="card-text"><small className="text-muted">Posted on: {new Date(item.timestamp).toLocaleDateString()}</small></p>
                  
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => setSelectedMedia(selectedMedia === item.id ? null : item.id)}
                  >
                    {selectedMedia === item.id ? 'Cancel Reply' : 'Reply to Post'}
                  </button>
                  
                  {selectedMedia === item.id && (
                    <form onSubmit={(e) => handleCommentSubmit(e, item.id)} className="mt-3">
                      <div className="form-group">
                        <textarea 
                          className="form-control"
                          rows="2"
                          placeholder="Write your comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-sm btn-success mt-2">Post Comment</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>No media found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;