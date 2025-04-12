const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/auth/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Missing code in query params');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: 'productstrategywithaakash@gmail.com',
        client_secret: 'Test@AakashInt#9',
        redirect_uri: 'https://instagram-api-integration.vercel.app/api/auth/callback',
        code: code
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // (Optional) Fetch user/business info
    const userInfoResponse = await axios.get(`https://graph.facebook.com/v18.0/me`, {
      params: {
        access_token: accessToken,
        fields: 'id,name'
      }
    });

    res.json({
      message: 'Instagram Business login successful!',
      user: userInfoResponse.data,
      access_token: accessToken
    });

  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
