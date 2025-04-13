// iai_backend/api/auth/callback.js
import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;
  console.log("code =", code);

  if (!code) return res.status(400).send('Missing code');

  try {
    // 1. Exchange code for access token
    const tokenRes = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
      params: {
        client_id: "1359354858675859",
        client_secret: "3856a375446d139ca3a3ff7509f27d17",
        redirect_uri: "https://iaibackend.vercel.app/api/auth/callback",
        code,
      },
    });

    const accessToken = tokenRes.data.access_token;
    console.log("accessToken =", accessToken);

    // 2. Get businesses the user manages
    const businessRes = await axios.get('https://graph.facebook.com/v19.0/me/businesses', {
      params: { access_token: accessToken },
    });

    console.log("businessRes =", businessRes.data);

    if (!businessRes.data.data.length) {
      return res.status(404).json({ message: 'No businesses found for this user' });
    }

    const businessId = businessRes.data.data[0].id;
    console.log("businessId =", businessId);

    // 3. Get owned pages under that business
    const ownedPagesRes = await axios.get(`https://graph.facebook.com/v19.0/${businessId}/owned_pages`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,instagram_business_account',
      },
    });

    console.log("ownedPagesRes =", ownedPagesRes.data);

    const page = ownedPagesRes.data.data[0];
    if (!page) return res.status(404).json({ message: 'No owned pages found under business' });

    const pageId = page.id;
    const igId = page.instagram_business_account?.id;

    if (!igId) return res.status(404).json({ message: 'No Instagram business account connected to the Page' });

    console.log("Instagram Business Account ID =", igId);

    // 4. Get Instagram profile details
    const igProfile = await axios.get(`https://graph.facebook.com/v19.0/${igId}`, {
      params: {
        fields: 'username,profile_picture_url,followers_count,follows_count',
        access_token: accessToken,
      },
    });

    // 5. Get Instagram insights (optional)
    const insightsRes = await axios.get(`https://graph.facebook.com/v19.0/${igId}/insights`, {
      params: {
        metric: 'impressions,reach',
        access_token: accessToken,
      },
    });

    res.status(200).json({
      message: 'Fetched Instagram profile and stats',
      profile: igProfile.data,
      stats: insightsRes.data,
    });

  } catch (err) {
    console.error('API Error:', err.response?.data || err.message);
    res.status(500).send('Error fetching Instagram data');
  }
}
