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

    console.log(pagesRes.data);       // ✅ The actual response payload
    console.log(pagesRes.status);     // HTTP status code (200, 404, etc.)
    console.log(pagesRes.headers);    // Response headers
    console.log(pagesRes.config);  

    const page = pagesRes.data.data[0];
    console.log("page="+page)
    const pageId = page.id;
    console.log("pageId="+pageId)

    const igRes = await axios.get(`https://graph.facebook.com/${pageId}`, {
      params: {
        fields: 'instagram_business_account',
        access_token: accessToken,
      },
    });

    console.log(igRes.data);       // ✅ The actual response payload
    console.log(igRes.status);     // HTTP status code (200, 404, etc.)
    console.log(igRes.headers);    // Response headers
    console.log(igRes.config); 

    const igId = igRes.data.instagram_business_account?.id;
    console.log("igid="+igId)

    const igProfile = await axios.get(`https://graph.facebook.com/v19.0/${igId}`, {
      params: {
        fields: 'username',
        access_token: accessToken,
      },
    });
    console.log(igProfile.data); 

    const statsRes = await axios.get(`https://graph.facebook.com/v19.0/${igId}/insights`, {
      params: {
        metric: 'follower_count',
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
