import Image from 'next/image';
import Link from 'next/link';
import { Button } from './Button';
import { CustomLink } from './Link';

export interface FeedEntryProps {
  year: string;
  title: string;
  contentBlocks: {
    type: 'text' | 'media';
    content: string | {
      type: 'image' | 'video';
      src: string;
      alt: string;
    };
  }[];
  button?: {
    text: string;
    href: string;
  };
  layout?: 'horizontal' | 'vertical';
}

export function FeedEntry({ year, title, contentBlocks, button, layout = 'horizontal' }: FeedEntryProps) {
  return (
    <article className="w-full flex flex-col gap-[8px] items-start">
      {/* Entry Content */}
      <div className="flex flex-col gap-[8px] items-start w-full">
        {/* Year and Title Group */}
        <div className="flex flex-col gap-[8px] items-start w-full">
          <p className="text-primary text-label-small">
            {year}
          </p>
          <h3 className="text-foreground text-title-small">
            {title}
          </h3>
        </div>
      </div>
      
      {/* Content Blocks */}
      <div className="w-full space-y-6">
        {contentBlocks.map((block, index) => (
          <div key={index}>
            {block.type === 'text' ? (
              <p className="text-foreground-muted text-body-medium w-full whitespace-pre-line">
                {block.content as string}
              </p>
            ) : (
              <div className="relative w-full rounded-[12px] overflow-hidden bg-surface border border-outline">
                {typeof block.content === 'object' && block.content.type === 'image' ? (
                  <>
                    {/* Mobile: Fixed width equal to content column, dynamic height, no cropping */}
                    <div className="relative w-full md:hidden">
                      <Image
                        src={block.content.src}
                        alt={block.content.alt}
                        width={672}
                        height={400}
                        className="w-full h-auto object-contain"
                        sizes="(max-width: 768px) 100vw, 672px"
                      />
                    </div>
                    {/* Desktop: Fixed height proportional to new width, fill, no cropping */}
                    <div className="hidden md:block relative h-[378px]">
                      <Image
                        src={block.content.src}
                        alt={block.content.alt}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </>
                ) : typeof block.content === 'object' && block.content.type === 'video' ? (
                  <video
                    src={block.content.src}
                    className="w-full h-auto object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Optional Button */}
      {button && (
        <CustomLink 
          href={button.href}
          className="text-button-label"
        >
          {button.text} →
        </CustomLink>
      )}
    </article>
  );
}
