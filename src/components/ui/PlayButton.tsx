'use client';

/**
 * PlayButton Component
 * 
 * A reusable play/pause button overlay for album covers.
 * Shows on hover and allows users to play/pause 30-second previews.
 * 
 * Features:
 * - Play/pause icon toggle
 * - Loading spinner state
 * - Disabled state (no preview available)
 * - Hover overlay on album cover
 */
interface PlayButtonProps {
  isPlaying: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onPlay: () => void;
  onPause: () => void;
  className?: string;
}

export function PlayButton({
  isPlaying,
  isLoading = false,
  disabled = false,
  onPlay,
  onPause,
  className = '',
}: PlayButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isLoading) return;
    
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  // Don't render if disabled (no preview available)
  if (disabled) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      onTouchStart={(e) => {
        // Prevent touch events on mobile - thumbnail handles them
        if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
          e.stopPropagation();
        }
      }}
      disabled={isLoading || disabled}
      className={`
        absolute inset-0 flex items-center justify-center
        rounded-[6px] bg-black/10
        transition-opacity duration-200
        opacity-0 group-hover:opacity-100
        ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
        ${disabled ? 'cursor-not-allowed opacity-0' : ''}
        ${className}
      `}
      style={{ 
        zIndex: 20,
        pointerEvents: typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches ? 'none' : 'auto'
      }}
      aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
    >
      {isLoading ? (
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {isPlaying ? (
            // Pause icon - two vertical bars
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="6" width="4" height="20" fill="white" />
              <rect x="18" y="6" width="4" height="20" fill="white" />
            </svg>
          ) : (
            // Play icon - triangle pointing right (white, no circle)
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.66602 4L25.3327 16L6.66602 28L6.66602 4Z" fill="white" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </>
      )}
    </button>
  );
}

