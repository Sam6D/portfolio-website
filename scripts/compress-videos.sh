#!/bin/bash

# Video compression script for UI product videos
# Converts MOV files to MP4 (H.264), removes audio, preserves framerate and resolution

# Get the project root directory (parent directory of scripts folder)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root to ensure we're in the right directory
cd "$PROJECT_ROOT" || exit 1

echo "📍 Project root: $PROJECT_ROOT"
echo ""

# Define the video files to compress (relative to project root)
videos=(
  "public/images/Studocu/studocu-ask-ai-full-flow.mov"
  "public/images/carv/carv-video-typing.mov"
  "public/images/ticketswap/ticketswap-checkout-video.mov"
)

# Settings explanation:
# -c:v libx264        : Use H.264 video codec
# -crf 23             : Constant Rate Factor (18-28, lower = better quality but larger file)
#                      23 is a good balance for web. For UI videos, we use 23 to keep quality high.
# -preset medium      : Encoding speed vs compression efficiency (slow/medium/fast)
#                       Medium is a good balance
# -pix_fmt yuv420p    : Pixel format for maximum compatibility
# -an                 : Remove audio (no audio stream)
# -movflags +faststart: Optimize for web streaming (allows playback while downloading)

for video in "${videos[@]}"; do
  # Build absolute path
  video_path="$PROJECT_ROOT/$video"
  
  # Verify the file is within the project directory (security check)
  if [[ ! "$video_path" == "$PROJECT_ROOT"/* ]]; then
    echo "⚠️  Security: Skipping $video (outside project directory)"
    continue
  fi
  
  # Check if video file exists
  if [ ! -f "$video_path" ]; then
    echo "⚠️  Warning: $video not found, skipping..."
    continue
  fi
  
  # Get the directory and filename without extension
  dir=$(dirname "$video_path")
  filename=$(basename "$video_path" .mov)
  
  # Output filename (change extension to .mp4)
  output="$dir/${filename}.mp4"
  
  echo "🎬 Compressing: $video"
  echo "   Output: $output"
  
  # Get original file size
  original_size=$(du -h "$video_path" | cut -f1)
  
  # Run ffmpeg compression
  ffmpeg -i "$video_path" \
    -c:v libx264 \
    -crf 23 \
    -preset medium \
    -pix_fmt yuv420p \
    -an \
    -movflags +faststart \
    -y \
    "$output" 2>&1 | grep -E "(Duration|Stream|video|Output)"
  
  # Check if compression was successful
  if [ $? -eq 0 ] && [ -f "$output" ]; then
    # Get compressed file size
    compressed_size=$(du -h "$output" | cut -f1)
    
    echo "✅ Success!"
    echo "   Original: $original_size → Compressed: $compressed_size"
    echo ""
    
    # Ask if user wants to replace original (we'll make this optional)
    echo "💡 Tip: Original file preserved. You can delete it manually if you're happy with the compressed version."
  else
    echo "❌ Error compressing $video"
    echo ""
  fi
done

echo "🎉 Compression complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Review the compressed videos"
echo "   2. Update your markdown files to use .mp4 instead of .mov"
echo "   3. Delete original .mov files if you're satisfied"

