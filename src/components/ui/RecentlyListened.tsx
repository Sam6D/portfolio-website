'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import type { LastFmAlbum } from '@/types/lastfm';
import type { SpotifyAlbumMatch } from '@/types/spotify';
import { PlayButton } from './PlayButton';

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
 * - Spotify integration for preview playback
 * - Mobile touch handlers for play/pause
 * - Disc animation on hover/play
 */
export function RecentlyListened() {
  // State to store the albums data
  const [albums, setAlbums] = useState<LastFmAlbum[]>([]);
  // State to track if we're currently loading data
  const [isLoading, setIsLoading] = useState(true);
  // State to track if there was an error fetching data
  const [hasError, setHasError] = useState(false);
  // State to track which album is being hovered (by index) - for image hover
  const [hoveredAlbumIndex, setHoveredAlbumIndex] = useState<number | null>(null);
  // State to track which album text is being hovered (by index) - for text hover only
  const [hoveredTextIndex, setHoveredTextIndex] = useState<number | null>(null);
  // State to store Spotify matches for each album
  const [spotifyMatches, setSpotifyMatches] = useState<(SpotifyAlbumMatch | null)[]>([]);
  // State to track which album is currently playing
  const [playingAlbumIndex, setPlayingAlbumIndex] = useState<number | null>(null);
  // State to track if audio is playing
  const [isPlaying, setIsPlaying] = useState(false);
  // State to track loading state for Spotify data
  const [spotifyLoading, setSpotifyLoading] = useState<boolean[]>([]);
  // Ref to store HTML5 Audio instance
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Ref to track if touch was handled to prevent click from firing
  const touchHandledRef = useRef<number | null>(null);

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
          throw new Error(`Failed to fetch albums: ${response.status} ${response.statusText}`);
        }
        
        // Parse the JSON response
        const data: LastFmAlbum[] = await response.json();
        
        // Update state with the albums data
        setAlbums(data);
        setHasError(false);
      } catch (error) {
        // If something goes wrong, set error state
        // This will hide the component gracefully
        setHasError(true);
      } finally {
        // Always set loading to false when done (success or error)
        setIsLoading(false);
      }
    }

    // Call the fetch function
    fetchAlbums();
  }, []); // Empty array means this only runs once when component mounts

  // Fetch Spotify matches when albums are loaded
  useEffect(() => {
    if (albums.length === 0) return;

    async function fetchSpotifyMatches() {
      const matches: (SpotifyAlbumMatch | null)[] = [];
      const loadingStates: boolean[] = [];

      // Fetch Spotify matches for each album in parallel
      const searchPromises = albums.map(async (album, index) => {
        loadingStates[index] = true;
        try {
          const searchUrl = new URL('/api/spotify/search', window.location.origin);
          searchUrl.searchParams.set('albumName', album.name);
          searchUrl.searchParams.set('artistName', album.artist.name);

          const response = await fetch(searchUrl.toString());
          if (response.ok) {
            const match: SpotifyAlbumMatch | null = await response.json();
            matches[index] = match;
          } else {
            matches[index] = null;
          }
        } catch (error) {
          matches[index] = null;
        } finally {
          loadingStates[index] = false;
        }
      });

      await Promise.all(searchPromises);
      setSpotifyMatches(matches);
      setSpotifyLoading(loadingStates);
    }

    fetchSpotifyMatches();
  }, [albums]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

  // Handle play button click
  async function handlePlay(index: number) {
    const match = spotifyMatches[index];
    if (!match?.previewUrl) return;

    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      // Create new audio instance
      const audio = new Audio(match.previewUrl);
      audioRef.current = audio;

      // Set up event listeners before playing
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setPlayingAlbumIndex(null);
        audioRef.current = null;
      });

      audio.addEventListener('error', () => {
        setIsPlaying(false);
        setPlayingAlbumIndex(null);
        audioRef.current = null;
      });

      // Play the preview - handle the promise properly
      try {
        await audio.play();
        setPlayingAlbumIndex(index);
        setIsPlaying(true);
      } catch (playError) {
        // Handle play interruption (e.g., user clicked pause quickly)
        // Also suppress NotAllowedError - browser autoplay policy (expected on first interaction)
        // These are expected and not real errors
        if (playError instanceof Error && playError.name !== 'AbortError' && playError.name !== 'NotAllowedError') {
          console.error('Error playing audio:', playError);
        }
        setIsPlaying(false);
        setPlayingAlbumIndex(null);
        audioRef.current = null;
      }
    } catch (error) {
      setIsPlaying(false);
      setPlayingAlbumIndex(null);
      audioRef.current = null;
    }
  }

  // Handle play for mobile - must be called synchronously within user gesture
  // This ensures Chrome recognizes it as a user gesture (not autoplay)
  function handlePlayMobile(index: number) {
    const match = spotifyMatches[index];
    if (!match?.previewUrl) return;

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Create new audio instance synchronously within user gesture
    const audio = new Audio(match.previewUrl);
    audioRef.current = audio;

    // Set up event listeners before playing
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setPlayingAlbumIndex(null);
      audioRef.current = null;
    });

    audio.addEventListener('error', () => {
      setIsPlaying(false);
      setPlayingAlbumIndex(null);
      audioRef.current = null;
    });

    // CRITICAL: Call play() synchronously within user gesture handler
    // This ensures Chrome recognizes it as user-initiated, not autoplay
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Autoplay started successfully
          setPlayingAlbumIndex(index);
          setIsPlaying(true);
        })
        .catch((playError) => {
          // Handle play interruption or autoplay policy
          // Suppress NotAllowedError - browser autoplay policy
          if (playError instanceof Error && playError.name !== 'AbortError' && playError.name !== 'NotAllowedError') {
            console.error('Error playing audio:', playError);
          }
          setIsPlaying(false);
          setPlayingAlbumIndex(null);
          audioRef.current = null;
        });
    }
  }

  // Handle pause button click
  function handlePause() {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (error) {
        // Ignore pause errors (audio might already be paused)
      }
      audioRef.current = null;
    }
    setIsPlaying(false);
    setPlayingAlbumIndex(null);
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-start w-full overflow-visible">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-[40px] w-full md:max-w-full overflow-visible">
        {/* Album Covers Container - sized to contain both rotated artworks */}
        <div className="relative shrink-0 overflow-visible" style={{ width: '178px', height: '120px', paddingLeft: '10px', paddingTop: '10px' }}>
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
            const isHovered = hoveredAlbumIndex === index;
            // On hover: left album (index 1) rotates more negative (left), right album (index 0) rotates more positive (right)
            const hoverRotation = isHovered 
              ? (isFirst ? baseRotation + 5 : baseRotation - 5)
              : baseRotation;
            // When playing, keep the hover rotation (don't revert to base)
            const currentRotation = (playingAlbumIndex === index && isPlaying) 
              ? hoverRotation 
              : (isHovered ? hoverRotation : baseRotation);
            const left = isFirst ? 80 : 10; // Adjusted for 10px padding
            const top = isFirst ? 23.11 : 10.11; // Adjusted for 10px padding
            
            return (
              <div
                key={`${album.artist.name}-${album.name}-${index}`}
                data-album-index={index}
                className="absolute flex items-center justify-center transition-transform duration-300 ease-in-out"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  width: '88px',
                  height: '88px',
                  transform: `rotate(${currentRotation}deg)`,
                  zIndex: isFirst ? 10 : 0,
                  cursor: typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches ? 'pointer' : 'default',
                }}
                onMouseEnter={() => {
                  // Only trigger hover on desktop (fine pointer)
                  if (window.matchMedia('(pointer: fine)').matches) {
                    setHoveredAlbumIndex(index);
                  }
                }}
                onMouseLeave={() => {
                  // Only clear hover on desktop
                  if (window.matchMedia('(pointer: fine)').matches) {
                    setHoveredAlbumIndex(null);
                  }
                }}
                onTouchStart={(e) => {
                  // On mobile touch, directly play/pause
                  // Stop propagation to prevent PlayButton from also handling it
                  e.stopPropagation();
                  const match = spotifyMatches[index];
                  if (match?.previewUrl) {
                    // Mark that we handled this touch to prevent click from firing
                    touchHandledRef.current = index;
                    if (playingAlbumIndex === index && isPlaying) {
                      handlePause();
                    } else {
                      // Use handlePlayMobile to ensure Chrome recognizes it as user gesture
                      handlePlayMobile(index);
                    }
                    // Clear the touch handled flag after a short delay
                    setTimeout(() => {
                      touchHandledRef.current = null;
                    }, 300);
                  }
                }}
                onClick={(e) => {
                  // On mobile, prevent click from firing after touch
                  if (!window.matchMedia('(pointer: fine)').matches) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  // On desktop (any width), let PlayButton handle it (don't prevent propagation)
                }}
              >
                {/* Album Cover Container - contains both image and disc */}
                <div 
                  className="relative rounded-[6px] bg-white transition-shadow duration-300 group overflow-visible"
                  style={{ 
                    width: '88px', 
                    height: '88px',
                    boxShadow: (isHovered && window.matchMedia('(pointer: fine)').matches) || (playingAlbumIndex === index && isPlaying)
                      ? '0px 2px 4px 0px rgba(0,0,0,0.4), 0px 4px 8px 2px rgba(0,0,0,0.2)'
                      : '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)'
                  }}
                >
                  {/* CD Disc - starts centered, moves up 38px on hover, positioned below thumbnail */}
                  <div
                    className="absolute flex items-center justify-center pointer-events-none"
                    style={{
                      width: '100px',
                      height: '100px',
                      top: '50%', // Center vertically
                      left: '50%', // Center horizontally
                      zIndex: 0, // Behind the image and play button
                      transform: isHovered || (playingAlbumIndex === index && isPlaying)
                        ? `translate(-50%, calc(-50% - 38px)) rotate(${-currentRotation}deg)` // Move up 38px and counter-rotate to stay upright
                        : 'translate(-50%, -50%)', // Centered
                      opacity: isHovered || (playingAlbumIndex === index && isPlaying) ? 1 : 0,
                      transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                    }}
                  >
                    {/* CD Disc Image - spins around its own center, independent of parent rotation */}
                    <Image
                      src="/images/disc.png"
                      alt="CD Disc"
                      width={100}
                      height={100}
                      className="rounded-full"
                      style={{
                        objectFit: 'contain',
                        animation: playingAlbumIndex === index && isPlaying
                          ? 'spin 3s linear infinite'
                          : 'none',
                        transformOrigin: 'center center', // Rotate around its own center
                      }}
                    />
                  </div>
                  
                  <Image
                    src={imageUrl}
                    alt={`${album.name} by ${album.artist.name}`}
                    fill
                    className="object-cover rounded-[6px] relative z-10"
                    sizes="88px"
                    style={{ zIndex: 10 }}
                  />
                  
                  {/* Mobile Gradient Overlay - bottom of thumbnail, only visible on touch devices */}
                  {spotifyMatches[index]?.previewUrl && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 rounded-b-[6px] z-15 pointer-events-none"
                      style={{
                        display: typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches ? 'block' : 'none',
                        height: '30px',
                        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)'
                      }}
                    />
                  )}
                  
                  {/* Mobile Play/Pause Icon - bottom left, only visible on touch devices, visual indicator only */}
                  {spotifyMatches[index]?.previewUrl && (
                    <div 
                      className="absolute bottom-0 left-0 flex items-center justify-center z-20 pointer-events-none"
                      style={{
                        display: typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches ? 'flex' : 'none',
                        padding: '4px'
                      }}
                    >
                      {playingAlbumIndex === index && isPlaying ? (
                        <svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="10" y="6" width="4" height="20" fill="white" />
                          <rect x="18" y="6" width="4" height="20" fill="white" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.66602 4L25.3327 16L6.66602 28L6.66602 4Z" fill="white" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  )}
                  
                  {/* Play Button Overlay - only show if preview is available */}
                  {spotifyMatches[index]?.previewUrl && (
                    <PlayButton
                      isPlaying={playingAlbumIndex === index && isPlaying}
                      isLoading={spotifyLoading[index] || false}
                      disabled={!spotifyMatches[index]?.previewUrl}
                      onPlay={() => handlePlay(index)}
                      onPause={handlePause}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Text Section - Title and Album Names */}
        <div className="flex flex-col gap-[4px] items-start shrink-0 min-w-0 w-full md:w-auto overflow-visible" style={{ maxWidth: '456px' }}>
          {/* Title */}
          <h3 className="text-foreground text-label-medium pb-1">
          🎵 Albums on rotation this month
          </h3>
          
          {/* Album Names - Format: [Album name] [8px gap] [Artist name] */}
          {albums.slice(0, 2).map((album, index) => {
            const isHovered = hoveredAlbumIndex === index;
            const isTextHovered = hoveredTextIndex === index;
            const isCurrentlyPlaying = playingAlbumIndex === index && isPlaying;
            const hasPreview = spotifyMatches[index]?.previewUrl;
            // Album title should be primary when hovering thumbnail, hovering text, or playing
            const shouldHighlightTitle = isHovered || isTextHovered || isCurrentlyPlaying;
            
            // Handle click on text - toggle play/pause like the play button
            function handleTextClick() {
              if (!hasPreview) return; // Don't do anything if no preview available
              
              if (isCurrentlyPlaying) {
                handlePause();
              } else {
                handlePlay(index);
              }
            }
            
            return (
              <div 
                key={`${album.artist.name}-${album.name}-wrapper`}
                className="relative"
                style={{ overflow: 'visible' }}
              >
                {/* Play icon that appears on text hover only - positioned to the left - hidden on mobile */}
                {hasPreview && (
                  <span 
                    className="hidden md:flex absolute items-center justify-center shrink-0 transition-opacity duration-300 pointer-events-none"
                    style={{
                      opacity: isTextHovered ? 1 : 0,
                      width: '16px',
                      height: '16px',
                      left: '-24px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                    }}
                  >
                    {isCurrentlyPlaying ? (
                      <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="6" width="4" height="20" fill="currentColor" />
                        <rect x="18" y="6" width="4" height="20" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.66602 4L25.3327 16L6.66602 28L6.66602 4Z" fill="currentColor" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                )}
                <div 
                  className={`text-body-medium md:truncate w-full transition-colors duration-300 flex flex-col md:flex-row md:items-center relative ${
                    hasPreview ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  title={`${album.name} · ${album.artist.name}`}
                  onMouseEnter={() => {
                    // Text hover triggers same effects as image hover (desktop only)
                    if (window.matchMedia('(pointer: fine)').matches) {
                      setHoveredAlbumIndex(index);
                      setHoveredTextIndex(index);
                    }
                  }}
                  onMouseLeave={() => {
                    // Only clear hover on desktop
                    if (window.matchMedia('(pointer: fine)').matches) {
                      setHoveredTextIndex(null);
                      // Clear image hover when leaving text
                      setHoveredAlbumIndex(null);
                    }
                  }}
                  onTouchStart={(e) => {
                    // On mobile touch, prevent hover states and directly play
                    if (hasPreview) {
                      // Mark that we handled this touch to prevent click from firing
                      touchHandledRef.current = index;
                      if (isCurrentlyPlaying) {
                        handlePause();
                      } else {
                        // Use handlePlayMobile to ensure Chrome recognizes it as user gesture
                        handlePlayMobile(index);
                      }
                      // Clear the touch handled flag after a short delay
                      setTimeout(() => {
                        touchHandledRef.current = null;
                      }, 300);
                    }
                  }}
                  onClick={(e) => {
                    // On desktop, use normal click handler
                    // On mobile, prevent click from firing after touch
                    if (!window.matchMedia('(pointer: fine)').matches && touchHandledRef.current === index) {
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                    if (window.matchMedia('(pointer: fine)').matches) {
                      handleTextClick();
                    }
                  }}
                >
                  <span className={`transition-colors duration-300 ${
                    shouldHighlightTitle ? 'text-primary' : 'text-foreground'
                  }`}>
                    {album.name}
                  </span>
                  <span className="hidden md:inline" style={{ marginLeft: '8px' }} />
                  <span className="text-foreground-subtle transition-colors duration-300">
                    {album.artist.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
