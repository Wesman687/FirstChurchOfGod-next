import { dbConnect } from '@/lib/db';
import Page from '@/models/Page';

// GET /api/pages/public - Get published pages for public use (navigation, etc.)
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: `Method ${req.method} not allowed` 
    });
  }

  await dbConnect();

  try {
    const { nav, slug } = req.query;

    if (slug) {
      // Get a specific page by slug
      const page = await Page.findOne({ slug, published: true })
        .select('title slug blocks seo createdAt updatedAt')
        .lean();

      if (!page) {
        return res.status(404).json({ 
          success: false, 
          error: 'Page not found' 
        });
      }

      return res.status(200).json({ 
        success: true, 
        page 
      });
    }

    if (nav === 'true') {
      // Get pages for navigation
      const navPages = await Page.find({ 
        published: true, 
        'nav.show': true 
      })
      .select('title slug nav.label nav.order')
      .sort({ 'nav.order': 1, title: 1 })
      .lean();

      return res.status(200).json({ 
        success: true, 
        pages: navPages.map(page => ({
          title: page.title,
          slug: page.slug,
          label: page.nav?.label || page.title,
          order: page.nav?.order || 999,
          path: `/${page.slug}`
        }))
      });
    }

    // Get all published pages (limited fields)
    const pages = await Page.find({ published: true })
      .select('title slug seo.description createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ 
      success: true, 
      pages 
    });

  } catch (error) {
    console.error('Error fetching public pages:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch pages' 
    });
  }
}
