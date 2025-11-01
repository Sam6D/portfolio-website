import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ReactNode, ComponentProps } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          // Custom heading components
          h1: ({ children, ...props }: ComponentProps<'h1'>) => (
            <h1 className="text-title-medium text-foreground mb-6 mt-24 first:mt-4" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }: ComponentProps<'h2'>) => (
            <h2 className="text-title-medium text-foreground mb-4 mt-6 first:mt-0" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }: ComponentProps<'h3'>) => (
            <h3 className="text-title-small text-foreground mb-3 mt-4 first:mt-0" {...props}>
              {children}
            </h3>
          ),
          
          // Bold text
          strong: ({ children, ...props }: ComponentProps<'strong'>) => (
            <strong className="font-semibold text-foreground" {...props}>
              {children}
            </strong>
          ),
          
          // Paragraphs with proper styling
          p: ({ children, ...props }: ComponentProps<'p'>) => (
            <p className="text-body-medium text-foreground-muted mb-4 last:mb-0" {...props}>
              {children}
            </p>
          ),
          
          // Unordered lists (bullet points)
          ul: ({ children, ...props }: ComponentProps<'ul'>) => (
            <ul className="text-body-medium text-foreground-muted mb-4 space-y-3" style={{ lineHeight: '1.75rem' }} {...props}>
              {children}
            </ul>
          ),
          
          // List items with custom bullet styling
          li: ({ children, ...props }: ComponentProps<'li'>) => {
            // Use custom bullet styling for all list items
            // The parent ul/ol styling will handle the differences
            return (
              <li className="flex items-start gap-2" {...props}>
                <span className="text-primary flex-shrink-0" style={{ lineHeight: '1.75rem' }}>•</span>
                <span className="flex-1" style={{ lineHeight: '1.75rem' }}>{children}</span>
              </li>
            );
          },
          
          // Ordered lists (numbered)
          ol: ({ children, ...props }: ComponentProps<'ol'>) => (
            <ol className="text-body-medium text-foreground-muted mb-4 space-y-3 list-decimal list-inside ml-4" style={{ lineHeight: '1.75rem' }} {...props}>
              {children}
            </ol>
          ),
          
          // Images with proper styling
          img: ({ src, alt, ...props }: ComponentProps<'img'>) => (
            <span className="block my-6">
              <span className="block relative rounded-lg overflow-hidden">
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-auto object-cover"
                  {...props}
                />
              </span>
              {alt && (
                <span className="block text-body-medium text-foreground-muted text-left mt-2 italic">
                  {alt}
                </span>
              )}
            </span>
          ),

          // Videos with proper styling
          video: ({ children, ...props }: ComponentProps<'video'>) => (
            <span className="block my-6">
              <span className="block relative rounded-lg overflow-hidden">
                <video
                  className="w-full h-auto"
                  loop
                  muted
                  autoPlay
                  playsInline
                  preload="metadata"
                  {...props}
                >
                  {children}
                </video>
              </span>
            </span>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
