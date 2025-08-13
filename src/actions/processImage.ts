'use server';

import { ImageWithUrl } from '@/types/common';
import { downloadImage } from './downloadImage';
import { uploadToTechloop } from './uploadImage';

export async function processImage(imageUrls: string[]) {
  try {
    console.log(imageUrls);
    const imageBuffers: ImageWithUrl[] = [];
    for (const url of imageUrls) {
      const domain = new URL(url).hostname;
      let buffer = undefined;
      if (domain !== 'techloop.vn') {
        buffer = await downloadImage(url);
      }
      imageBuffers.push({
        buffer,
        url
      });
    }
    const mapUrl = await uploadToTechloop(imageBuffers.filter(image => image.buffer !== undefined));
    return {
      success: true,
      mapUrl,
    }
  } catch (error) {    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
