import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { commentId, replyText, accessToken } = req.body;

  if (!commentId || !replyText || !accessToken) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const fbRes = await axios.post(`https://graph.facebook.com/v19.0/${commentId}/replies`, null, {
      params: {
        message: replyText,
        access_token: accessToken,
      },
    });

    res.status(200).json(fbRes.data);
  } catch (err) {
    console.error("Failed to reply to comment:", err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to reply to comment' });
  }
}
