// api/hello.js
//test api call
export default function handler(req, res) {
    res.status(200).json({ message: 'Hello World from Node.js on Vercel!' });
  }

  