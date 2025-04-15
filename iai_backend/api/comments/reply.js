import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { commentId, message, accessToken } = req.body;

  if (!commentId || !message || !accessToken) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const replyRes = await axios.post(
      `https://graph.facebook.com/v19.0/${commentId}/replies`,
      { message },
      {
        params: { access_token: accessToken },
      }
    );

    res.status(200).json({ success: true, data: replyRes.data });
  } catch (err) {
    console.error('❌ Reply error:', err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
}