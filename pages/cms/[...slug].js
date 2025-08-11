import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { 
  HeroBlock, 
  RichTextBlock, 
  GalleryBlock, 
  FormBlock, 
  ImageBlock, 
  VideoBlock, 
  SpacerBlock, 
  DividerBlock 
} from '../../components/blocks';

// Block component mapping
const BLOCK_COMPONENTS = {
  hero: HeroBlock,
  richText: RichTextBlock,
  gallery: GalleryBlock,
  form: FormBlock,
  image: ImageBlock,
  video: VideoBlock,
  spacer: SpacerBlock,
  divider: DividerBlock
};

export default function DynamicCMSPage({ page, notFound }) {
  const router = useRouter();

  // Handle 404 case
  if (notFound) {
    return (
      <Layout>
        <Head>
          <title>Page Not Found - First Church of God</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600 mb-8">Page not found</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle loading state
  if (router.isFallback) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const renderBlock = (block, index) => {
    const BlockComponent = BLOCK_COMPONENTS[block.type];
    
    if (!BlockComponent) {
      console.warn(`Unknown block type: ${block.type}`);
      return null;
    }

    return (
      <BlockComponent
        key={block._id || index}
        {...block.content}
      />
    );
  };

  return (
    <Layout>
      <Head>
        <title>{page.seo?.title || page.title} - First Church of God</title>
        {page.seo?.description && (
          <meta name="description" content={page.seo.description} />
        )}
        {page.seo?.keywords && (
          <meta name="keywords" content={page.seo.keywords} />
        )}
        <meta property="og:title" content={page.seo?.title || page.title} />
        {page.seo?.description && (
          <meta property="og:description" content={page.seo.description} />
        )}
        {page.seo?.image && (
          <meta property="og:image" content={page.seo.image} />
        )}
        <meta property="og:type" content="website" />
      </Head>

      <main>
        {page.blocks?.map((block, index) => renderBlock(block, index))}
      </main>
    </Layout>
  );
}

// This function gets called at build time for static generation
export async function getStaticPaths() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/pages`);
    const pages = response.ok ? await response.json() : [];

    const paths = pages
      .filter(page => page.status === 'published')
      .map(page => ({
        params: { slug: page.slug.split('/').filter(Boolean) }
      }));

    return {
      paths,
      fallback: 'blocking' // Enable ISR for new pages
    };
  } catch (error) {
    console.error('Error fetching pages for static paths:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

// This function gets called at build time and on each request if fallback is enabled
export async function getStaticProps({ params }) {
  try {
    const slug = params.slug ? params.slug.join('/') : '';
    
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/pages/by-slug/${slug}`);
    
    if (!response.ok) {
      return {
        notFound: true,
      };
    }

    const page = await response.json();

    // Only show published pages in production
    if (page.status !== 'published' && process.env.NODE_ENV === 'production') {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        page,
      },
      revalidate: 60, // Revalidate every minute for ISR
    };
  } catch (error) {
    console.error('Error fetching page:', error);
    return {
      notFound: true,
    };
  }
}
