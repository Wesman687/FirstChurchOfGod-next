import Head from 'next/head';

const CampHead = ({ 
  title = "Art Camp Registration - First Church of God",
  description = "Join us for an amazing Art Camp experience! Register your child for creative activities, Bible stories, worship, and fun. Ages 3-18 welcome.",
  image = "/images/art_camp2.jpg",
  url = "/camp"
}) => {
  // Get the full URL for images and canonical links
  const fullImageUrl = image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://firstchurchofgod.com'}${image}`;
  const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://firstchurchofgod.com'}${url}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="art camp, children, church, registration, bible, worship, creative activities, First Church of God, East Palatka, FL" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="First Church of God Art Camp - Children enjoying creative activities and Bible stories" />
      <meta property="og:site_name" content="First Church of God" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta property="twitter:image:alt" content="First Church of God Art Camp - Children enjoying creative activities and Bible stories" />
      <meta property="twitter:site" content="@FirstChurchOfGod" />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="First Church of God" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={fullUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Structured Data for Events */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "First Church of God Art Camp 2025",
            "description": description,
            "image": fullImageUrl,
            "startDate": "2025-08-25",
            "endDate": "2025-08-29", 
            "eventSchedule": {
              "@type": "Schedule",
              "startDate": "2025-08-25",
              "endDate": "2025-08-29",
              "startTime": "10:00",
              "endTime": "13:30"
            },
            "location": {
              "@type": "Place",
              "name": "First Church of God",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "106 Rio Vista Ave",
                "addressLocality": "East Palatka",
                "addressRegion": "FL",
                "postalCode": "32131",
                "addressCountry": "US"
              },
              "telephone": "(386) 227-4629"
            },
            "organizer": {
              "@type": "Organization",
              "name": "First Church of God",
              "url": fullUrl.replace('/camp', ''),
              "telephone": "(386) 227-4629"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": fullUrl,
              "description": "Free registration for children ages 3-18"
            },
            "audience": {
              "@type": "Audience",
              "audienceType": "Children and Youth",
              "suggestedMinAge": 3,
              "suggestedMaxAge": 18
            },
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled"
          })
        }}
      />
    </Head>
  );
};

export default CampHead;
