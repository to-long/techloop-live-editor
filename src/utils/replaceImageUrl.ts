"use client";

import { processImage } from "@/actions/processImage";
import { toast } from "react-toastify";

export const replaceImageUrl = async (content: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  const images = tempDiv.querySelectorAll("img");
  const imageUrls: string[] = [];
  images.forEach((img) => {
    const src = img.getAttribute("src");
    if (src) {
      imageUrls.push(src);
    }
  });
  const toastId = toast("Uploading images to Techloop...", {
    autoClose: images.length * 10000,
  });
  const result = await processImage(imageUrls);
  if (result.success) {
    const mapUrl = result.mapUrl || {};
    console.log("mapUrl", mapUrl);
    images.forEach((img) => {
      const src = img.getAttribute("src");
      if (src) {
        img.setAttribute("src", mapUrl[src]);
      }
    });
  }
  toast.dismiss(toastId);
  toast("Images uploaded to Techloop", {
    type: "success",
    hideProgressBar: true,
  });
  return tempDiv.innerHTML;
};
