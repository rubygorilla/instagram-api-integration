//client/pages/index.js
import React from 'react';

export default function Home() {
  const handleLogin = () => {
    const clientId = "1359354858675859";
    const redirectUri = "https://iai-backend.vercel.app/api/auth/callback";

    const scope = [
      "instagram_basic",
      "instagram_manage_insights",
      "pages_show_list",
    ].join(",");

    const loginUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

    window.location.href = loginUrl;
  };

  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h1>📊 Instagram Insights Dashboard</h1>
      <button onClick={handleLogin} style={{ padding: 10, fontSize: 18 }}>
        Login with Instagram
      </button>
    </div>
  );
}
