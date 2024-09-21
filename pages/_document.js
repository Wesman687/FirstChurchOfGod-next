import Nav from "@/components/Nav";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <Nav />
      <body className="home page body_style_wide body_filled article_style_stretch scheme_original top_panel_show top_panel_above sidebar_hide">
        <div className="body_wrap">
          <div className="page_wrap">
            <Main />
            <NextScript />

          </div>
        </div>
      </body>
    </Html>
  );
}
