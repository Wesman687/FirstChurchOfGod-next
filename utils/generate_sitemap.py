import os
from datetime import datetime

BASE_URL = "https://firstchurchofgod.org"
PAGES_DIR = "../pages"
OUTPUT_PATH = "../public/sitemap.xml"

EXCLUDE = {"_app.js", "_document.js", "_error.js", "api", "fonts", "[...slug].js"}

# Helper to get all .js files recursively

def get_page_paths(root):
    page_paths = []
    for dirpath, dirnames, filenames in os.walk(root):
        # Exclude folders
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE]
        for filename in filenames:
            if filename.endswith(".js") and filename not in EXCLUDE:
                rel_dir = os.path.relpath(dirpath, root)
                if rel_dir == ".":
                    url_path = ""
                else:
                    url_path = "/" + rel_dir.replace(os.sep, "/")
                name = filename.replace(".js", "")
                if name == "index":
                    page_url = url_path or "/"
                else:
                    page_url = f"{url_path}/{name}".replace("//", "/")
                page_paths.append(page_url)
    return page_paths

def generate_sitemap():
    pages = get_page_paths(PAGES_DIR)
    now = datetime.now().strftime("%Y-%m-%d")
    sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    for page in sorted(set(pages)):
        sitemap.append(f"  <url>")
        sitemap.append(f"    <loc>{BASE_URL}{page}</loc>")
        sitemap.append(f"    <lastmod>{now}</lastmod>")
        sitemap.append(f"    <changefreq>weekly</changefreq>")
        sitemap.append(f"    <priority>0.7</priority>")
        sitemap.append(f"  </url>")
    sitemap.append("</urlset>")
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(sitemap))
    print(f"Sitemap generated at {OUTPUT_PATH}")

if __name__ == "__main__":
    generate_sitemap()
