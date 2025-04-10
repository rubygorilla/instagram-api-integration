// routes/instagram.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Instagram login route
router.get('/auth/instagram', (req, res) => {
  const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(instagramAuthUrl);
});

// Instagram callback route
router.get('/auth/instagram/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json(
        { error: 'Authorization code not provided' }
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: process.env.INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.REDIRECT_URI,
      code
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, user_id } = tokenResponse.data;

    // Redirect to frontend with data
    res.redirect(`http://localhost:3000/profile?token=${access_token}&userId=${user_id}`);
  } catch (error) {
    console.error('Instagram authentication error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// API endpoint to get user profile
router.get('/api/profile', async (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).json({ error: 'Access token not provided' });
  }

  try {
    const userResponse = await axios.get(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${token}`);
    res.json(userResponse.data);
  } catch (error) {
    console.error('Error fetching profile:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// API endpoint to get user media
router.get('/api/media', async (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).json({ error: 'Access token not provided' });
  }

  try {
    const mediaResponse = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${token}`);
    res.json(mediaResponse.data);
  } catch (error) {
    console.error('Error fetching media:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

module.exports = router;
