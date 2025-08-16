export const getOriginImage = (src: string) => {
  if (src) {
    src = yahoo(src);
    src = cnet(src);
    src = src.split("?")[0]; // Example: image.jpg?v=123 -> image.jpg
    src = src.replace(/-\d+x\d+(?=\.[a-zA-Z0-9]+$)/, ""); // Example: image-1200x720.jpg -> image.jpg
  }
  return src;
};

const yahoo = (src: string) => {
  const httpsCount = (src.match(/https:\/\//g) || []).length;
  // If there are more than 2 "https://" in the src, keep only the last one
  if (httpsCount >= 2) {
    const lastHttpsIndex = src.lastIndexOf("https://");
    if (lastHttpsIndex !== -1) {
      src = src.substring(lastHttpsIndex);
    }
  }
  return src;
};

const cnet = (src: string) => {
  try {
    const url = new URL(src);
    if (url.hostname.endsWith("cnet.com")) {
      const resizeIdx = url.pathname.indexOf("/resize/");
      const hubIdx = url.pathname.indexOf("/hub/");
      if (resizeIdx !== -1 && hubIdx !== -1 && hubIdx > resizeIdx) {
        url.pathname =
          url.pathname.substring(0, resizeIdx) + url.pathname.substring(hubIdx);
      }
      // Remove query string
      url.search = "";
      return url.toString();
    }
  } catch (e) {
    // If src is not a valid URL, do nothing
  }
  return src;
};
