#!/bin/bash

# Image compression script for web optimization
# Converts PNG/JPG to optimized formats while preserving quality

# Get the project root directory (parent directory of scripts folder)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root to ensure we're in the right directory
cd "$PROJECT_ROOT" || exit 1

echo "📍 Project root: $PROJECT_ROOT"
echo ""

# Check if required tools are installed
if ! command -v sharp-cli &> /dev/null && ! command -v imagemin &> /dev/null && ! command -v convert &> /dev/null; then
  echo "⚠️  No image optimization tools found."
  echo ""
  echo "📦 Install options:"
  echo "   1. Sharp CLI (recommended, fastest):"
  echo "      npm install -g sharp-cli"
  echo ""
  echo "   2. ImageMagick (good alternative):"
  echo "      brew install imagemagick"
  echo ""
  echo "   3. Or use online tools like:"
  echo "      - https://squoosh.app/ (browser-based)"
  echo "      - https://tinypng.com/"
  echo ""
  exit 1
fi

# Find all PNG and JPG files in public/images
echo "🔍 Finding images to optimize..."
echo ""

images=$(find public/images -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.PNG" -o -name "*.JPG" -o -name "*.JPEG" \) | grep -v ".git")

if [ -z "$images" ]; then
  echo "⚠️  No images found in public/images/"
  exit 0
fi

echo "Found $(echo "$images" | wc -l | tr -d ' ') images to process"
echo ""

# Function to compress with sharp-cli
compress_sharp() {
  local input="$1"
  local output="$2"
  
  sharp -i "$input" -o "$output" --webp --avif --png --quality 85 2>/dev/null
}

# Function to compress with ImageMagick
compress_imagemagick() {
  local input="$1"
  local output="$2"
  local ext="${input##*.}"
  
  if [ "$ext" = "png" ] || [ "$ext" = "PNG" ]; then
    # PNG optimization
    convert "$input" -strip -quality 85 -define png:compression-level=9 "$output"
  else
    # JPEG optimization
    convert "$input" -strip -quality 85 -sampling-factor 4:2:0 -interlace JPEG "$output"
  fi
}

# Determine which tool to use
if command -v sharp-cli &> /dev/null; then
  COMPRESS_CMD="sharp"
elif command -v convert &> /dev/null; then
  COMPRESS_CMD="imagemagick"
else
  COMPRESS_CMD="none"
fi

# Process each image
total_original=0
total_compressed=0
processed=0

for image in $images; do
  # Build absolute path and verify it's within project
  image_path="$PROJECT_ROOT/$image"
  
  if [[ ! "$image_path" == "$PROJECT_ROOT"/* ]]; then
    echo "⚠️  Security: Skipping $image (outside project directory)"
    continue
  fi
  
  if [ ! -f "$image_path" ]; then
    continue
  fi
  
  # Get original size
  original_size=$(stat -f%z "$image_path" 2>/dev/null || stat -c%s "$image_path" 2>/dev/null)
  original_size_mb=$(echo "scale=2; $original_size / 1024 / 1024" | bc)
  
  # Skip if already small (< 100KB)
  if [ "$original_size" -lt 102400 ]; then
    echo "⏭️  Skipping $image (already small: ${original_size_mb}MB)"
    continue
  fi
  
  echo "🎨 Compressing: $image"
  echo "   Original: ${original_size_mb}MB"
  
  # Create backup
  backup="${image_path}.backup"
  cp "$image_path" "$backup"
  
  # Compress based on available tool
  if [ "$COMPRESS_CMD" = "sharp" ]; then
    # Sharp creates WebP/AVIF, but we'll use it to optimize the original
    # For now, we'll use ImageMagick fallback or manual optimization
    echo "   ⚠️  Sharp CLI detected but needs manual WebP conversion"
    echo "   💡 Tip: Use Squoosh.app or update script for Sharp"
    continue
  elif [ "$COMPRESS_CMD" = "imagemagick" ]; then
    compress_imagemagick "$backup" "$image_path"
  else
    echo "   ⚠️  No compression tool available, skipping"
    rm "$backup"
    continue
  fi
  
  # Get compressed size
  if [ -f "$image_path" ]; then
    compressed_size=$(stat -f%z "$image_path" 2>/dev/null || stat -c%s "$image_path" 2>/dev/null)
    compressed_size_mb=$(echo "scale=2; $compressed_size / 1024 / 1024" | bc)
    
    # Calculate savings
    savings=$(echo "scale=1; ($original_size - $compressed_size) * 100 / $original_size" | bc)
    
    if [ "$compressed_size" -lt "$original_size" ]; then
      echo "   ✅ Compressed: ${compressed_size_mb}MB (${savings}% reduction)"
      total_original=$((total_original + original_size))
      total_compressed=$((total_compressed + compressed_size))
      processed=$((processed + 1))
      rm "$backup"
    else
      echo "   ⚠️  No improvement, restoring original"
      mv "$backup" "$image_path"
    fi
  else
    echo "   ❌ Error, restoring backup"
    mv "$backup" "$image_path"
  fi
  
  echo ""
done

if [ $processed -gt 0 ]; then
  total_original_mb=$(echo "scale=2; $total_original / 1024 / 1024" | bc)
  total_compressed_mb=$(echo "scale=2; $total_compressed / 1024 / 1024" | bc)
  total_savings=$(echo "scale=1; ($total_original - $total_compressed) * 100 / $total_original" | bc)
  
  echo "🎉 Compression complete!"
  echo "   Processed: $processed images"
  echo "   Total: ${total_original_mb}MB → ${total_compressed_mb}MB"
  echo "   Savings: ${total_savings}%"
else
  echo "ℹ️  No images were compressed (may already be optimized or tools missing)"
fi

echo ""
echo "📝 Note: Next.js Image component will further optimize these on-the-fly"
echo "   Consider using WebP/AVIF formats for even better compression"

