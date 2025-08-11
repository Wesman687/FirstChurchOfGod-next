import { HeroBlock } from './HeroBlock';
import { RichTextBlock } from './RichTextBlock';
import { GalleryBlock } from './GalleryBlock';
import { FormBlock } from './FormBlock';
import { ImageBlock } from './ImageBlock';
import { VideoBlock } from './VideoBlock';
import { SpacerBlock } from './SpacerBlock';
import { DividerBlock } from './DividerBlock';

const BLOCK_REGISTRY = {
  hero: HeroBlock,
  richText: RichTextBlock,
  gallery: GalleryBlock,
  form: FormBlock,
  image: ImageBlock,
  video: VideoBlock,
  spacer: SpacerBlock,
  divider: DividerBlock,
};

export function BlockRenderer({ blocks = [] }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500 text-center">No content blocks found.</p>
      </div>
    );
  }

  return (
    <main className="cms-page-content">
      {blocks.map((block, index) => {
        const BlockComponent = BLOCK_REGISTRY[block.type];
        
        if (!BlockComponent) {
          console.warn(`Unknown block type: ${block.type}`);
          return null;
        }

        return (
          <div key={block.id || index} className={`cms-block cms-block-${block.type}`}>
            <BlockComponent {...(block.data || {})} />
          </div>
        );
      })}
    </main>
  );
}

export default BlockRenderer;
