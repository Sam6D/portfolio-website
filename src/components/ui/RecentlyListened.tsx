'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { LastFmAlbum } from '@/types/lastfm';

/**
 * RecentlyListened Component
 * 
 * Displays the top 2 albums from the past month using Last.fm API data.
 * Shows a "Recent Listen" title and two album artwork thumbnails.
 * 
 * Features:
 * - Fetches data from our API route (/api/lastfm)
 * - Handles loading and error states gracefully
 * - Uses Next.js Image component for optimized image loading
 * - Hides the section if API fails (graceful degradation)
 */
export function RecentlyListened() {
  // State to store the albums data
  const [albums, setAlbums] = useState<LastFmAlbum[]>([]);
  // State to track if we're currently loading data
  const [isLoading, setIsLoading] = useState(true);
  // State to track if there was an error fetching data
  const [hasError, setHasError] = useState(false);
  // State to track which album is being hovered (by index)
  const [hoveredAlbumIndex, setHoveredAlbumIndex] = useState<number | null>(null);

  // useEffect runs after the component mounts (appears on screen)
  // This is where we fetch the data from our API
  useEffect(() => {
    // Define an async function to fetch the data
    async function fetchAlbums() {
      try {
        setIsLoading(true);
        // Make a request to our API route
        const response = await fetch('/api/lastfm');
        
        // Check if the response was successful
        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }
        
        // Parse the JSON response
        const data: LastFmAlbum[] = await response.json();
        
        // Update state with the albums data
        setAlbums(data);
        setHasError(false);
      } catch (error) {
        // If something goes wrong, set error state
        // This will hide the component gracefully
        console.error('Error fetching Last.fm albums:', error);
        setHasError(true);
      } finally {
        // Always set loading to false when done (success or error)
        setIsLoading(false);
      }
    }

    // Call the fetch function
    fetchAlbums();
  }, []); // Empty array means this only runs once when component mounts

  // If loading or error, don't show anything (graceful degradation)
  // This ensures the footer doesn't break if the API is down
  if (isLoading || hasError || albums.length === 0) {
    return null;
  }

  // Helper function to get the best available image URL
  // Last.fm provides images in different sizes: small, medium, large, extralarge
  // We prefer 'large' or 'extralarge' for better quality thumbnails
  function getAlbumImageUrl(album: LastFmAlbum): string {
    // Try to find extralarge first (best quality)
    const extralarge = album.image.find(img => img.size === 'extralarge');
    if (extralarge && extralarge['#text']) {
      return extralarge['#text'];
    }
    
    // Fall back to large if extralarge isn't available
    const large = album.image.find(img => img.size === 'large');
    if (large && large['#text']) {
      return large['#text'];
    }
    
    // Fall back to medium if large isn't available
    const medium = album.image.find(img => img.size === 'medium');
    if (medium && medium['#text']) {
      return medium['#text'];
    }
    
    // Last resort: use small or first available image
    return album.image.find(img => img['#text'])?.['#text'] || '';
  }

  return (
    <div className="flex items-center justify-start w-full">
      <div className="flex items-center gap-[38px] max-w-full">
        {/* Album Covers Container - sized to contain both rotated artworks */}
        {/* For rotated square: bounding box = side × (|cos(θ)| + |sin(θ)|) */}
        {/* For 15deg: 88 × (0.966 + 0.259) ≈ 107.8px bounding box */}
        {/* Each square extends ~53.9px from its center in all directions */}
        {/* Left album center: (44, 44.11) → extends to left: -9.9px, right: 97.9px, top: -9.79px, bottom: 98.01px */}
        {/* Right album center: (114, 57.11) → extends to left: 60.1px, right: 167.9px, top: 3.21px, bottom: 111.01px */}
        {/* Container needs: width 168px (rightmost), height 111px (bottommost), with padding for negative values */}
        <div className="relative shrink-0 overflow-visible" style={{ width: '178px', height: '121px', paddingLeft: '10px', paddingTop: '10px' }}>
          {albums.slice(0, 2).map((album, index) => {
            const imageUrl = getAlbumImageUrl(album);
            
            // Skip albums without artwork
            if (!imageUrl) {
              return null;
            }
            
            // First album (index 0) → right position: left-[70px], top-[13.11px], rotated 15deg
            // Second album (index 1) → left position: left-0, top-[0.11px], rotated -15deg
            const isFirst = index === 0;
            const baseRotation = isFirst ? 15 : -15;
            // On hover: left album (index 1) rotates more negative (left), right album (index 0) rotates more positive (right)
            const hoverRotation = hoveredAlbumIndex === index 
              ? (isFirst ? baseRotation + 5 : baseRotation - 5)
              : baseRotation;
            const left = isFirst ? 80 : 10; // Adjusted for 10px padding
            const top = isFirst ? 23.11 : 10.11; // Adjusted for 10px padding
            const isHovered = hoveredAlbumIndex === index;
            
            return (
              <div
                key={`${album.artist.name}-${album.name}-${index}`}
                className="absolute flex items-center justify-center cursor-pointer transition-transform duration-300 ease-in-out"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  width: '88px',
                  height: '88px',
                  transform: `rotate(${hoverRotation}deg)`,
                  zIndex: isFirst ? 10 : 0,
                }}
                onMouseEnter={() => setHoveredAlbumIndex(index)}
                onMouseLeave={() => setHoveredAlbumIndex(null)}
              >
                <div 
                  className="relative rounded-[6px] bg-white transition-shadow duration-300"
                  style={{ 
                    width: '88px', 
                    height: '88px',
                    boxShadow: isHovered 
                      ? '0px 2px 4px 0px rgba(0,0,0,0.4), 0px 4px 8px 2px rgba(0,0,0,0.2)'
                      : '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)'
                  }}
                >
                  <Image
                    src={imageUrl}
                    alt={`${album.name} by ${album.artist.name}`}
                    fill
                    className="object-cover rounded-[6px]"
                    sizes="88px"
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Text Section - Title and Album Names */}
        {/* Max width: footer width (672px) - covers (178px) - gap (38px) = 456px */}
        <div className="flex flex-col gap-[4px] items-start shrink-0 min-w-0" style={{ maxWidth: '456px' }}>
          {/* Title */}
          <h3 className="text-foreground text-label-medium pb-1">
          🎵 On rotation this month
          </h3>
          
          {/* Album Names - Format: [Album name] [8px gap] [Artist name] */}
          {/* Truncate if too long, highlight on hover, trigger image rotation */}
          {albums.slice(0, 2).map((album, index) => {
            const isHovered = hoveredAlbumIndex === index;
            return (
              <p 
                key={`${album.artist.name}-${album.name}`} 
                className="text-body-medium truncate w-full cursor-pointer"
                title={`${album.name} · ${album.artist.name}`}
                onMouseEnter={() => setHoveredAlbumIndex(index)}
                onMouseLeave={() => setHoveredAlbumIndex(null)}
              >
                <span className={`transition-colors duration-300 ${
                  isHovered ? 'text-primary' : 'text-foreground'
                }`}>
                  {album.name}
                </span>
                <span style={{ marginLeft: '8px' }} />
                <span className={`transition-colors duration-300 ${
                  isHovered ? 'text-primary' : 'text-foreground-subtle'
                }`}>
                  {album.artist.name}
                </span>
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

