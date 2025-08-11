
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="First Church of God" />
        <meta property="og:title" content="First Church of God - Palatka, FL" />
        <meta property="og:description" content="Join us for worship at First Church of God in Palatka, FL. Sunday service 10am-1:30pm, Wednesday 6pm, Saturday Bible Study 9:30am." />
        <meta property="og:image" content="/images/church_foto.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="First Church of God - Palatka, FL" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="First Church of God - Palatka, FL" />
        <meta name="twitter:description" content="Join us for worship at First Church of God in Palatka, FL. Sunday service 10am-1:30pm, Wednesday 6pm, Saturday Bible Study 9:30am." />
        <meta name="twitter:image" content="/images/church_foto.jpg" />
        
        {/* Additional SEO */}
        <meta name="description" content="First Church of God in Palatka, FL. Join us for Sunday worship 10am-1:30pm, Wednesday service 6pm, and Saturday Bible Study 9:30am. Christian Art Camp available for ages 5-12." />
        <meta name="keywords" content="church, First Church of God, Palatka FL, worship, Bible study, Christian Art Camp" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
