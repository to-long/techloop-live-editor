export const collectImageUrls = async (content: string) => {
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
  console.log('run here', imageUrls);
  return imageUrls;
};
