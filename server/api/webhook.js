const VERIFY_TOKEN = 'IGAAOqhqipGmVBZAE1GRUxXVWNpTTloRThXUzg5OElUaUVHN2sxd2xyVXN2dkxJekEwWmhfMFVrZAkJpRWhUREotZAU9jVW94c2RKM0lNcGtNdjFvSXBMWDdBWldYenhtTjFXdmE0TUFmbDhZATDIyOE9TdUotSGN1TWdJWS1yT25VSQZDZD';

export default async function handler(req, res) {
  const { method, query, body } = req;

  if (method === 'GET') {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified!');
      return res.status(200).send(challenge);
    } else {
      console.warn('❌ Webhook verification failed');
      return res.status(403).send('Verification failed');
    }
  }

  if (method === 'POST') {
    console.log('📬 Webhook POST received:');
    console.log(JSON.stringify(body, null, 2));
    return res.status(200).send('EVENT_RECEIVED');
  }

  return res.status(405).send('Method Not Allowed');
}