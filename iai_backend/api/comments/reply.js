import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mediaId, commentId, message } = req.body;

  if (!mediaId || !commentId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // ✅ If you're storing access token in cookie, parse it from there
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/insta_profile=([^;]+)/);

    if (!match) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const profileData = JSON.parse(decodeURIComponent(match[1]));
    const accessToken = process.env.FB_USER_TOKEN; // OR store access token in cookie if needed

    if (!accessToken) {
      return res.status(401).json({ error: 'Missing access token' });
    }

    // 📩 Make the API call to post a reply
    const endpoint = `https://graph.facebook.com/v19.0/${commentId}/replies`;

    const response = await axios.post(
      endpoint,
      {
        message,
        access_token: accessToken,
      }
    );

    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('❌ Error posting reply:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
}
