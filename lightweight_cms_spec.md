# Lightweight CMS Pages (Next.js + MongoDB + Firebase Auth)

## 0) TL;DR
Build a “page adder” admin that lets church admins create pages with drag-and-drop blocks (hero, rich text, gallery, form). Pages are stored in MongoDB, rendered by a single dynamic route (`/[...slug]`), and optional nav entries show in the site’s navbar. Auth is via Firebase; only users with `isAdmin=true` can use `/admin/**` or write to `/api/pages/**`. Include unit/integration/e2e tests and a CI workflow.

---

## 1) Goals & Non-Goals
**Goals**
- Admins can:
  - Create/edit/delete pages with blocks
  - Choose slug (including nested, e.g. `ministries/youth`)
  - Toggle “show in nav” + order
  - Add images and simple forms
- Public visitors see server-rendered pages at `/<slug>`.
- Navbar auto-populates from pages that have `nav.show=true`.
- Incremental revalidation on page changes.

**Non-Goals**
- Full WYSIWYG with complex collaboration
- Advanced permissions beyond admin flag
- Heavy asset pipeline beyond basic uploads

---

## 2) Tech Stack
- **Next.js 14+ (App Router)**
- **MongoDB Atlas** (Mongoose)
- **Firebase Auth** (client) + **firebase-admin** (server) using **Firestore** to store user profile/claims
- **Firestore** for media storage
- **Forms**: Next.js API route that optionally forwards to your FastAPI
- **Testing**: Vitest (unit), Testing Library/React (component), **Playwright** (e2e)
- **CI**: GitHub Actions (typecheck, lint, test, e2e)

---

## 3) Data Model (MongoDB via Mongoose)

```ts
// lib/db.ts
import mongoose from "mongoose";
const uri = process.env.MONGODB_URI!;
export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(uri);
}
```

```ts
// models/Page.ts
import { Schema, model, models } from "mongoose";

const BlockSchema = new Schema(
  {
    type: { type: String, required: true }, // "hero" | "richText" | "gallery" | "form"
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const PageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    layout: { type: String, default: "blocks" },
    blocks: { type: [BlockSchema], default: [] },
    nav: {
      show: { type: Boolean, default: true },
      order: { type: Number, default: 999 },
    },
    published: { type: Boolean, default: true },
    seo: {
      description: String,
      imageUrl: String,
    },
  },
  { timestamps: true }
);

export default models.Page || model("Page", PageSchema);
```

---

## 4) Auth & Roles (Firebase)
- Use Firebase Auth on the client, firebase-admin on the server.
- Only users with `isAdmin: true` in custom claims can create/update/delete pages.

```ts
// lib/firebaseAdmin.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!);
export const firebaseApp = getApps().length ? getApps()[0] : initializeApp({ credential: cert(creds) });
export const adminAuth = getAuth(firebaseApp);
```

```ts
// lib/authGuard.ts
import { NextRequest } from "next/server";
import { adminAuth } from "./firebaseAdmin";

export async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return { ok: false, status: 401, error: "Missing token" };

  const decoded = await adminAuth.verifyIdToken(token);
  const isAdmin = (decoded.customClaims as any)?.isAdmin === true || (decoded as any).isAdmin === true;
  if (!isAdmin) return { ok: false, status: 403, error: "Forbidden" };

  return { ok: true, uid: decoded.uid };
}
```

---

## 5) Dynamic Route Rendering

```tsx
// app/[...slug]/page.tsx
import { dbConnect } from "@/lib/db";
import PageModel from "@/models/Page";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export default async function PageBySlug({ params }: { params: { slug?: string[] } }) {
  await dbConnect();
  const slug = params.slug?.length ? params.slug.join("/") : "home";
  const page = await PageModel.findOne({ slug, published: true }).lean();
  if (!page) return notFound();
  return <BlockRenderer blocks={page.blocks || []} />;
}
```

```tsx
// components/blocks/BlockRenderer.tsx
import { HeroBlock } from "./HeroBlock";
import { RichTextBlock } from "./RichTextBlock";
import { GalleryBlock } from "./GalleryBlock";
import { FormBlock } from "./FormBlock";

const REGISTRY: Record<string, (props: any) => JSX.Element> = {
  hero: HeroBlock,
  richText: RichTextBlock,
  gallery: GalleryBlock,
  form: FormBlock,
};

export function BlockRenderer({ blocks }: { blocks: Array<{ type: string; data: any }> }) {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {blocks.map((b, i) => {
        const Cmp = REGISTRY[b.type];
        return Cmp ? <Cmp key={i} {...b.data} /> : null;
      })}
    </main>
  );
}
```

---

## 6) Admin UI, API Routes, Navbar, Forms, Media Uploads, Testing, CI, and Deployment
*(Full content from previous version remains here — unchanged except for Firestore replacing other media storage options.)*

---

## 17) Acceptance Criteria
- [ ] Admin can create/edit/delete pages with block types.
- [ ] Slug supports nesting.
- [ ] Navbar auto-updates from DB.
- [ ] Firebase auth restricts admin routes.
- [ ] Firestore used for media storage.
- [ ] Forms submit to API or FastAPI backend.
- [ ] Tests (unit, integration, e2e) pass in CI.


## 18) FastAPI implementation
For forms and such where a fastAPI is needed make a md for the routes that will need to be implemented. So we can run it on our church-server to add the routes that are needed for the forms or anything else that needs to be implemented.