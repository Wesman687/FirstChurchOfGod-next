import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { dbConnect } from '../../lib/db';
import Page from '../../models/Page';
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
        <meta property="og:title" content={`${page.seo?.title || page.title} - First Church of God`} />
        <meta property="og:description" content={page.seo?.description || "Join us for worship at First Church of God in Palatka, FL."} />
        <meta property="og:url" content={`https://www.palatka-firstchurchofgod.org/cms/${page.slug}`} />
        <meta property="og:image" content={page.seo?.image || "https://www.palatka-firstchurchofgod.org/images/og-card.jpg"} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="First Church of God" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${page.seo?.title || page.title} - First Church of God`} />
        <meta name="twitter:description" content={page.seo?.description || "Join us for worship at First Church of God in Palatka, FL."} />
        <meta name="twitter:image" content={page.seo?.image || "https://www.palatka-firstchurchofgod.org/images/og-card.jpg"} />
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
    await dbConnect();
    const pages = await Page.find({ status: 'published' }, 'slug').lean();

    const paths = pages
      .filter(page => page.slug)
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
    
    await dbConnect();
    const page = await Page.findOne({ 
      slug: slug,
      status: 'published' 
    }).lean();

    if (!page) {
      return {
        notFound: true,
      };
    }

    // Convert MongoDB ObjectId to string for serialization
    const serializedPage = {
      ...page,
      _id: page._id.toString(),
      createdAt: page.createdAt?.toISOString(),
      updatedAt: page.updatedAt?.toISOString(),
    };

    return {
      props: {
        page: serializedPage,
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
