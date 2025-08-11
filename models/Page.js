import { Schema, model, models } from 'mongoose';

const BlockSchema = new Schema(
  {
    id: { type: String, required: true }, // Unique identifier for each block
    type: { 
      type: String, 
      required: true,
      enum: ['hero', 'richText', 'gallery', 'form', 'image', 'video', 'spacer', 'divider']
    },
    data: { type: Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 }, // For ordering blocks
  },
  { _id: false }
);

const PageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    layout: { type: String, default: 'blocks' },
    blocks: { type: [BlockSchema], default: [] },
    nav: {
      show: { type: Boolean, default: true },
      order: { type: Number, default: 999 },
      label: { type: String }, // Optional custom nav label (defaults to title)
    },
    published: { type: Boolean, default: false },
    seo: {
      description: { type: String, maxlength: 160 },
      imageUrl: String,
      keywords: [String],
    },
    author: {
      uid: String, // Firebase UID of the creator
      name: String,
      email: String,
    },
  },
  { 
    timestamps: true,
    toJSON: { 
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for better performance
PageSchema.index({ slug: 1 });
PageSchema.index({ published: 1 });
PageSchema.index({ 'nav.show': 1, 'nav.order': 1 });
PageSchema.index({ createdAt: -1 });

// Middleware to ensure slug is URL-friendly
PageSchema.pre('save', function(next) {
  if (this.isModified('slug')) {
    this.slug = this.slug
      .toLowerCase()
      .replace(/[^a-z0-9\/\-]/g, '-')
      .replace(/\-+/g, '-')
      .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
      .replace(/^\-+|\-+$/g, ''); // Remove leading/trailing dashes
  }
  next();
});

// Virtual for generating full URL path
PageSchema.virtual('path').get(function() {
  return `/${this.slug}`;
});

export default models.Page || model('Page', PageSchema);
