import dbConnect from '../../../lib/db';
import Page from '../../../models/Page';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Convert array slug to string
    const slugString = Array.isArray(slug) ? slug.join('/') : slug || '';

    const page = await Page.findOne({ 
      slug: slugString,
      status: 'published' 
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.status(200).json(page);
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
