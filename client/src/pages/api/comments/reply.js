const handleReply = async (commentId, message) => {
    const token = sessionStorage.getItem('accessToken');
  
    if (!token) {
      console.error("Missing access token");
      return;
    }
  
    const res = await fetch('/api/comments/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentId, message, accessToken: token }),
    });
  
    const data = await res.json();
    if (data.success) {
      alert('Reply posted!');
    } else {
      console.error(data.error);
      alert('Failed to reply');
    }
  };  