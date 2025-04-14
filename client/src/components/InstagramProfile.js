import React from 'react';

const InstagramProfile = ({ profile }) => {
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '1rem', 
      borderRadius: '10px', 
      maxWidth: '300px', 
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <img 
        src={profile.profile_picture_url} 
        alt="Profile" 
        style={{ width: '100px', borderRadius: '50%' }} 
      />
      <h2>@{profile.username}</h2>
      <p><strong>Followers:</strong> {profile.followers_count}</p>
      <p><strong>Following:</strong> {profile.follows_count}</p>
    </div>
  );
};

export default InstagramProfile;