'use client';

import { processImage } from "@/actions/processImage";

export const replaceImageUrl = async (content: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const images = tempDiv.querySelectorAll('img');
  const imageUrls: string[] = [];
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src) {
      imageUrls.push(src);
    }
  });
  const result = await processImage(imageUrls);
  if (result.success) {
    const mapUrl = result.mapUrl || {};
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        img.setAttribute('src', mapUrl[src]);
      }
    });
  }
  return tempDiv.innerHTML;
};
