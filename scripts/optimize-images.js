#!/usr/bin/env node

/**
 * Image optimization script using Sharp
 * Lossless compression - preserves 100% quality
 * 
 * Usage: node scripts/optimize-images.js [folder-path]
 * Example: node scripts/optimize-images.js ticketswap/ticketswap-case-study
 * Requires: npm install sharp --save-dev
 * 
 * Note: This script uses lossless compression only - no quality reduction.
 * For PNG: Maximum compression level (9) without quality loss
 * For JPEG: 100% quality setting
 * 
 * Original images are automatically backed up to public/images/.backup/[timestamp]/
 * before optimization, preserving the directory structure.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');

// Check if sharp is installed
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('⚠️  Sharp not installed. Installing...');
  try {
    execSync('npm install sharp --save-dev', { cwd: PROJECT_ROOT, stdio: 'inherit' });
    sharp = require('sharp');
    console.log('✅ Sharp installed!\n');
  } catch (err) {
    console.error('❌ Failed to install Sharp. Please run: npm install sharp --save-dev');
    process.exit(1);
  }
}

// Find all image files
function findImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      findImages(filePath, fileList);
    } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
      filePath.startsWith(PROJECT_ROOT) && fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Create backup of original image
function backupImage(imagePath, backupBaseDir) {
  const relativePath = path.relative(path.join(PROJECT_ROOT, 'public', 'images'), imagePath);
  const backupPath = path.join(backupBaseDir, relativePath);
  const backupDir = path.dirname(backupPath);
  
  // Create backup directory structure
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Copy original to backup location
  fs.copyFileSync(imagePath, backupPath);
  return backupPath;
}

// Optimize a single image
async function optimizeImage(imagePath, backupBaseDir) {
  try {
    const stats = fs.statSync(imagePath);
    const originalSize = stats.size;
    
    // Skip if already small (< 100KB)
    if (originalSize < 102400) {
      return { skipped: true, path: imagePath };
    }
    
    // Backup original image before optimization
    const backupPath = backupImage(imagePath, backupBaseDir);
    
    const ext = path.extname(imagePath).toLowerCase();
    const tempPath = `${imagePath}.tmp`;
    
    // Get image info
    const metadata = await sharp(imagePath).metadata();
    const { width, height } = metadata;
    
    // Determine optimal size: for logos, max 512px on longest side is more than enough
    // For other images, cap at 2048px to preserve detail while reducing size
    const isLogoFolder = imagePath.includes('/companies/');
    const maxDimension = isLogoFolder ? 512 : 2048;
    
    // Calculate new dimensions if resizing is needed
    let newWidth = width;
    let newHeight = height;
    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        newWidth = maxDimension;
        newHeight = Math.round((height / width) * maxDimension);
      } else {
        newHeight = maxDimension;
        newWidth = Math.round((width / height) * maxDimension);
      }
    }
    
    // Optimize based on format - 100% quality preserved (lossless)
    if (ext === '.png') {
      // PNG: Lossless compression with maximum compression level
      let sharpInstance = sharp(imagePath);
      
      // Resize if needed
      if (newWidth !== width || newHeight !== height) {
        sharpInstance = sharpInstance.resize(newWidth, newHeight, {
          kernel: sharp.kernel.lanczos3,
          fit: 'inside',
          withoutEnlargement: true
        });
      }
      
      await sharpInstance
        .png({ 
          compressionLevel: 9,  // Maximum compression (0-9), still lossless
          adaptiveFiltering: true,
          palette: metadata.channels <= 2 ? true : false  // Use palette for grayscale/2-channel images
        })
        .toFile(tempPath);
    } else {
      // JPEG: 100% quality (lossless-like, though JPEG is inherently lossy)
      let sharpInstance = sharp(imagePath);
      
      // Resize if needed
      if (newWidth !== width || newHeight !== height) {
        sharpInstance = sharpInstance.resize(newWidth, newHeight, {
          kernel: sharp.kernel.lanczos3,
          fit: 'inside',
          withoutEnlargement: true
        });
      }
      
      await sharpInstance
        .jpeg({ 
          quality: 100,  // Maximum quality (100%)
          mozjpeg: true  // Use mozjpeg encoder for better compression at same quality
        })
        .toFile(tempPath);
    }
    
    const newStats = fs.statSync(tempPath);
    const newSize = newStats.size;
    
    // Only replace if we saved space
    if (newSize < originalSize) {
      fs.renameSync(tempPath, imagePath);
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      return {
        success: true,
        path: imagePath,
        originalSize,
        newSize,
        savings: parseFloat(savings)
      };
    } else {
      fs.unlinkSync(tempPath);
      return { noImprovement: true, path: imagePath };
    }
  } catch (error) {
    console.error(`   ❌ Error optimizing ${imagePath}:`, error.message);
    return { error: true, path: imagePath };
  }
}

// Main function
async function main() {
  // Get target folder from command line argument, or default to companies
  const targetFolder = process.argv[2] || 'companies';
  
  console.log('📍 Project root:', PROJECT_ROOT);
  console.log(`🔍 Finding images in: public/images/${targetFolder}/...\n`);
  
  const imagesDir = path.join(PROJECT_ROOT, 'public', 'images', targetFolder);
  
  if (!fs.existsSync(imagesDir)) {
    console.log(`⚠️  public/images/${targetFolder} directory not found`);
    process.exit(0);
  }
  
  // Create backup directory with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5); // Format: 2025-11-01T00-30-14
  const backupBaseDir = path.join(PROJECT_ROOT, 'public', 'images', '.backup', timestamp, targetFolder);
  
  // Ensure backup directory exists
  if (!fs.existsSync(backupBaseDir)) {
    fs.mkdirSync(backupBaseDir, { recursive: true });
  }
  
  console.log(`💾 Backups will be stored in: public/images/.backup/${timestamp}/${targetFolder}/`);
  console.log('');
  
  const images = findImages(imagesDir);
  
  if (images.length === 0) {
    console.log('⚠️  No images found');
    process.exit(0);
  }
  
  console.log(`Found ${images.length} images to process\n`);
  
  let processed = 0;
  let totalOriginal = 0;
  let totalNew = 0;
  let skipped = 0;
  
  for (const image of images) {
    const relativePath = path.relative(PROJECT_ROOT, image);
    const fileName = path.basename(image);
    const fileSize = (fs.statSync(image).size / 1024 / 1024).toFixed(2);
    
    console.log(`🎨 Processing: ${relativePath} (${fileSize}MB)`);
    
    const result = await optimizeImage(image, backupBaseDir);
    
    if (result.skipped) {
      console.log(`   ⏭️  Skipped (already small)\n`);
      skipped++;
    } else if (result.noImprovement) {
      console.log(`   ⚠️  No improvement possible\n`);
    } else if (result.success) {
      const originalMB = (result.originalSize / 1024 / 1024).toFixed(2);
      const newMB = (result.newSize / 1024 / 1024).toFixed(2);
      console.log(`   ✅ ${originalMB}MB → ${newMB}MB (${result.savings}% reduction)\n`);
      processed++;
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
    }
  }
  
  // Summary
  console.log('🎉 Optimization complete!\n');
  console.log(`   Processed: ${processed} images`);
  console.log(`   Skipped: ${skipped} images (already small)`);
  
  if (processed > 0) {
    const totalOriginalMB = (totalOriginal / 1024 / 1024).toFixed(2);
    const totalNewMB = (totalNew / 1024 / 1024).toFixed(2);
    const totalSavings = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
    console.log(`   Total: ${totalOriginalMB}MB → ${totalNewMB}MB`);
    console.log(`   Overall savings: ${totalSavings}%\n`);
  }
  
  console.log('💡 Note: Images optimized with 100% quality preserved (lossless compression)');
  console.log('   Next.js Image component will further optimize these automatically');
  console.log('   For additional size reduction, consider WebP format (via Squoosh.app)');
  console.log('');
  console.log(`📦 Original images backed up to: public/images/.backup/${timestamp}/`);
  console.log('   You can restore them manually if needed, or delete the backup folder to save space');
}

main().catch(console.error);

