import { dbConnect } from '@/lib/db';
import Page from '@/models/Page';
import { withAdminAuth } from '@/lib/authGuard';

// GET /api/pages - List all pages (admin only)
// POST /api/pages - Create a new page (admin only)
async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { published, nav } = req.query;
      
      let filter = {};
      
      // Filter by published status
      if (published !== undefined) {
        filter.published = published === 'true';
      }
      
      // Filter by nav visibility
      if (nav !== undefined) {
        filter['nav.show'] = nav === 'true';
      }

      const pages = await Page.find(filter)
        .sort({ 'nav.order': 1, createdAt: -1 })
        .lean();

      return res.status(200).json({ 
        success: true, 
        pages: pages || [] 
      });
    } catch (error) {
      console.error('Error fetching pages:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch pages' 
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, slug, blocks = [], nav = {}, seo = {}, published = false } = req.body;

      if (!title || !slug) {
        return res.status(400).json({ 
          success: false, 
          error: 'Title and slug are required' 
        });
      }

      // Check if slug already exists
      const existingPage = await Page.findOne({ slug });
      if (existingPage) {
        return res.status(409).json({ 
          success: false, 
          error: 'A page with this slug already exists' 
        });
      }

      const page = new Page({
        title,
        slug,
        blocks,
        nav: {
          show: nav.show !== false, // Default to true
          order: nav.order || 999,
          label: nav.label || title,
        },
        seo,
        published,
        author: {
          uid: req.user.uid,
          name: req.user.name,
          email: req.user.email,
        },
      });

      await page.save();

      return res.status(201).json({ 
        success: true, 
        page: page.toJSON() 
      });
    } catch (error) {
      console.error('Error creating page:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to create page' 
      });
    }
  }

  return res.status(405).json({ 
    success: false, 
    error: `Method ${req.method} not allowed` 
  });
}

export default handler;
