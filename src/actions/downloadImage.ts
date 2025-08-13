'use server';
import sharp from 'sharp';

const minDimension = parseInt(process.env.IMAGE_MIN_DIMENSION || '1200', 10);

export const downloadImage = async (imageUrl: string): Promise<Buffer | undefined> => {
  try {
    // Ensure unique filename to avoid duplication
    const urlParts = imageUrl.split('/');
    let filename = urlParts.pop() || 'image.jpg';
    // If filename is generic, add a hash of the URL to make it unique
    if (filename === 'image.jpg' || filename === '' || filename.startsWith('?')) {
      const hash = Buffer.from(imageUrl).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
      filename = `image_${hash}.jpg`;
    }
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return undefined;
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await resizeImage(Buffer.from(arrayBuffer));
    return buffer;
  } catch (error) {
    console.error(`❌ Failed to download ${imageUrl}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return undefined;
  }
};

const resizeImage = async (buffer: Buffer<ArrayBuffer>) => {
  let image = sharp(buffer);
  // Use sharp to get image metadata
  const metadata = await image.metadata();
  const { width, height } = metadata;

  if (width && height && (width < minDimension || height < minDimension)) {
    // Scale up so that the smallest dimension is 1200, maintaining aspect ratio
    const targetSize = minDimension
    const resizeOptions: { width?: number; height?: number; } = {};
    if (width < height) {
      resizeOptions.width = targetSize;
    } else {
      resizeOptions.height = targetSize;
    }
    image = image.resize(resizeOptions);

  // Optimize image for web: convert to JPEG, set quality, enable progressive, strip metadata
  image = image
    .jpeg({
      quality: 80, 
      progressive: true,
      mozjpeg: true,
    })
    .withMetadata(); 
  }
  return image.toBuffer();
};
