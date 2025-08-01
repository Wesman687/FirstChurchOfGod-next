// Simple test API to check if the basic setup works
export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Test API working', method: 'GET' });
  } else if (req.method === 'POST') {
    res.status(200).json({ message: 'Test API working', method: 'POST', body: req.body });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
