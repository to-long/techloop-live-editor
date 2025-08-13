'use server';

import { ImageWithUrl } from '@/types/common';


const apiBaseUrl = process.env.API_BASE_URL || 'https://api.techloop.vn/api/v1'
const chunkSize = parseInt(process.env.UPLOAD_MAX_FILES || '30', 10)
const token = process.env.TECHLOOP_TOKEN || ''
const coolDownBetweenBatches = parseInt(process.env.UPLOAD_COOL_DOWN || '60', 10)*1000

export const uploadToTechloop = async (images: ImageWithUrl[]) => {
  const headers = {
    'accept': 'application/json',
    'accept-language': 'vi-VN',
    'authorization': `Bearer ${token}`,
    'content-type': 'application/json',
    'origin': 'https://techloop.vn',
    'referer': 'https://techloop.vn/',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
  };

  const chunkSize = parseInt(process.env.UPLOAD_MAX_FILES || '30', 10);
  const chunks: ImageWithUrl[][] = [];
  
  // Split images into chunks
  for (let i = 0; i < images.length; i += chunkSize) {
    chunks.push(images.slice(i, i + chunkSize));
  }

  const result: Record<string, string> = {};

  // Process each chunk
  for (let batchNum = 0; batchNum < chunks.length; batchNum++) {
    const chunk = chunks[batchNum];
    console.log(`🔄 Processing batch ${batchNum + 1}/${chunks.length} (${chunk.length} images)`);

    // Get file info for batch
    const objects = chunk.map((image, index) => ({
      key: `image_${batchNum}_${index}.jpg`,
      length: image.buffer?.length || 0
    })).filter(obj => obj.length > 0);

    if (objects.length === 0) {
      console.log(`❌ No valid images found in batch ${batchNum + 1}`);
      continue;
    }

    try {
      // Get presign URLs for batch
      console.log(`🔄 Getting presign URLs for batch ${batchNum + 1}...`);
      const presignResponse = await fetch(`${apiBaseUrl}/files/presign-upload`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ target: 'TOPIC', objects })
      });

      if (!presignResponse.ok) {
        console.error(`❌ Error getting presign URLs for batch ${batchNum + 1}: ${presignResponse.status}`);
        continue;
      }

      const presignData = await presignResponse.json();
      console.log(`✅ Presign URLs received for batch ${batchNum + 1}`);

      // Upload files in batch
      for (let i = 0; i < chunk.length; i++) {
        const image = chunk[i];
        const presignItem = presignData.data[i];

        if (!image.buffer) {
          console.log(`❌ No buffer for image ${i + 1} in batch ${batchNum + 1}`);
          continue;
        }

        console.log(`📤 Uploading ${i + 1}/${chunk.length} in batch ${batchNum + 1}`);

        try {
          const uploadResponse = await fetch(presignItem.url, {
            method: 'PUT',
            headers: { 'content-type': '*/*' },
            body: image.buffer
          });

          if (uploadResponse.ok) {
            result[image.url] = presignItem.access_url;
            console.log(`✅ Uploaded: ${image.url} -> ${presignItem.access_url}`);
          } else {
            console.log(`❌ Failed to upload: ${image.url}`);
          }
        } catch (error) {
          console.error(`❌ Error uploading ${image.url}:`, error instanceof Error ? error.message : 'Unknown error');
        }
      }
    } catch (error) {
      console.error(`❌ Error in batch ${batchNum + 1}:`, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  return result;
}

