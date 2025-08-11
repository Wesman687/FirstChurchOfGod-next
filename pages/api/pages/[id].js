import { dbConnect } from '@/lib/db';
import Page from '@/models/Page';
import { withAdminAuth } from '@/lib/authGuard';

// GET /api/pages/[id] - Get page by ID
// PUT /api/pages/[id] - Update page by ID  
// DELETE /api/pages/[id] - Delete page by ID
async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ 
      success: false, 
      error: 'Page ID is required' 
    });
  }

  if (req.method === 'GET') {
    try {
      const page = await Page.findById(id).lean();
      
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
    } catch (error) {
      console.error('Error fetching page:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch page' 
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, slug, blocks, nav, seo, published } = req.body;

      // Check if slug is being changed and if it conflicts
      if (slug) {
        const existingPage = await Page.findOne({ slug, _id: { $ne: id } });
        if (existingPage) {
          return res.status(409).json({ 
            success: false, 
            error: 'A page with this slug already exists' 
          });
        }
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) updateData.slug = slug;
      if (blocks !== undefined) updateData.blocks = blocks;
      if (nav !== undefined) updateData.nav = nav;
      if (seo !== undefined) updateData.seo = seo;
      if (published !== undefined) updateData.published = published;

      const page = await Page.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      );

      if (!page) {
        return res.status(404).json({ 
          success: false, 
          error: 'Page not found' 
        });
      }

      // Trigger revalidation for the updated page
      if (process.env.NODE_ENV === 'production') {
        try {
          await res.revalidate(`/${page.slug}`);
          await res.revalidate('/'); // Also revalidate home page for nav updates
        } catch (revalidateError) {
          console.error('Revalidation error:', revalidateError);
          // Don't fail the request if revalidation fails
        }
      }

      return res.status(200).json({ 
        success: true, 
        page: page.toJSON() 
      });
    } catch (error) {
      console.error('Error updating page:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to update page' 
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const page = await Page.findByIdAndDelete(id);

      if (!page) {
        return res.status(404).json({ 
          success: false, 
          error: 'Page not found' 
        });
      }

      // Trigger revalidation for the deleted page and nav
      if (process.env.NODE_ENV === 'production') {
        try {
          await res.revalidate(`/${page.slug}`);
          await res.revalidate('/');
        } catch (revalidateError) {
          console.error('Revalidation error:', revalidateError);
        }
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Page deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting page:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to delete page' 
      });
    }
  }

  return res.status(405).json({ 
    success: false, 
    error: `Method ${req.method} not allowed` 
  });
}

export default handler;
