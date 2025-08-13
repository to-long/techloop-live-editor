'use server';

export async function processImage(imageUrls: string[]) {
  try {
    console.log(imageUrls);
    // const response = await fetch('https://techloop.ai/api/v1/images', {
    //   method: 'POST',
    //   body: JSON.stringify({ imageUrls }),
    // });
    // const data = await response.json();
    // return data;

  } catch (error) {
    console.error('Error collecting image URLs:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      imageUrls: [],
      count: 0
    };
  }
}
