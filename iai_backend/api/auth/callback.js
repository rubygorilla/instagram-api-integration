// iai_backend/api/auth/callback.js
import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;
  console.log("code =", code);

  if (!code) return res.status(400).send('Missing code');

  try {
    const tokenRes = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
      params: {
        client_id: "1359354858675859",
        client_secret: "3856a375446d139ca3a3ff7509f27d17",
        redirect_uri: "https://iaibackend.vercel.app/api/auth/callback",
        code,
      },
    });

    const accessToken = tokenRes.data.access_token;
    console.log("accessToken ="+ accessToken)

    const pagesRes = await axios.get('https://graph.facebook.com/me/accounts', {
      params: { access_token: accessToken },
    });

    console.log("pagesRes ="+pagesRes);
    
    const page = pagesRes.data.data[0];
    const pageId = page.id;

    const igRes = await axios.get(`https://graph.facebook.com/${pageId}`, {
      params: {
        fields: 'instagram_business_account',
        access_token: accessToken,
      },
    });

    const igId = igRes.data.instagram_business_account.id;

    const statsRes = await axios.get(`https://graph.facebook.com/${igId}/insights`, {
      params: {
        metric: 'impressions,reach,profile_views',
        period: 'day',
        access_token: accessToken,
      },
    });

    res.status(200).json({
      message: 'Fetched Instagram stats',
      stats: statsRes.data,
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error fetching Instagram stats');
  }
}
