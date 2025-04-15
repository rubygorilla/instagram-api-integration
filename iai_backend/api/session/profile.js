export default function handler(req, res) {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/insta_profile=([^;]+)/);
  
    if (!match) {
      return res.status(404).json({ error: 'Profile not found' });
    }
  
    try {
      const profile = JSON.parse(decodeURIComponent(match[1]));
      res.status(200).json({ profile });
    } catch (err) {
      console.error("Invalid cookie format", err);
      res.status(500).json({ error: 'Failed to parse profile' });
    }
  }
  