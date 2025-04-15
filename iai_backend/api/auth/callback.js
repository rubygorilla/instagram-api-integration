// iai_backend/api/auth/callback.js
import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;
  console.log("🔁 OAuth callback triggered");

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

    // 2. Get businesses
    const businessRes = await axios.get('https://graph.facebook.com/v19.0/me/businesses', {
      params: { access_token: accessToken },
    });

    const businesses = businessRes.data.data;
    if (!businesses.length) {
      return res.redirect(`/error?message=${encodeURIComponent('No businesses found')}`);
    }

    const businessId = businesses[0].id;

    // 3. Get pages
    const ownedPagesRes = await axios.get(`https://graph.facebook.com/v19.0/${businessId}/owned_pages`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,instagram_business_account',
      },
    });

    const pages = ownedPagesRes.data.data;
    const page = pages[0];

    if (!page) {
      return res.redirect(`/error?message=${encodeURIComponent('No pages found under business')}`);
    }

    const igId = page.instagram_business_account?.id;
    if (!igId) {
      return res.redirect(`/error?message=${encodeURIComponent('No Instagram account linked to this Page')}`);
    }

    // 4. Get Instagram profile
    const igProfileRes = await axios.get(`https://graph.facebook.com/v19.0/${igId}`, {
      params: {
        fields: 'username,profile_picture_url,followers_count,follows_count',
        access_token: accessToken,
      },
    });

    // 5a. Get follower count
    const followerCountRes = await axios.get(`https://graph.facebook.com/v22.0/${igId}/insights`, {
      params: {
        metric: 'follower_count',
        period: 'day',
        access_token: accessToken,
      },
    });

    // 5b. Get reach
    const reachRes = await axios.get(`https://graph.facebook.com/v22.0/${igId}/insights`, {
      params: {
        metric: 'reach',
        period: 'day',
        access_token: accessToken,
      },
    });

    // 6. Get media
    const mediaRes = await axios.get(`https://graph.facebook.com/v19.0/${igId}/media`, {
      params: {
        fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,permalink',
        access_token: accessToken,
      },
    });

    const profilePayload = {
      profile: igProfileRes.data,
      stats: {
        follower_count: followerCountRes.data,
        reach: reachRes.data,
      },
      media: mediaRes.data.data,
    };

    // Store in HTTP-only secure cookie
    // const encodedData = encodeURIComponent(JSON.stringify(profilePayload));
    // res.setHeader('Set-Cookie', [
    //   `insta_profile=${encodedData}; Path=/; Secure; SameSite=None; Max-Age=300`,
    // ]);    

    // Redirect to a frontend route that reads the cookie and stores it in sessionStorage
    const encodedData = encodeURIComponent(JSON.stringify(profilePayload));
    console.log("Redirecting to:", `https://instagram-api-integration.vercel.app/storeProfile?data=${encodedData}`);

    res.redirect(`https://instagram-api-integration.vercel.app/storeProfile?data=${encodedData}`);

  } catch (err) {
    console.error('❌ API Error:', err.response?.data || err.message);
    const errorMsg = encodeURIComponent(err.response?.data?.error?.message || err.message);
    res.redirect(`/error?message=${errorMsg}`);
  }
}