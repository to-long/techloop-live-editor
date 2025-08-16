"use client";

import { processImage } from "@/actions/processImage";
import { toast } from "react-toastify";

export const replaceImageUrl = async (content: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  const images = Array.from(tempDiv.querySelectorAll("img"));
  const toastId = toast("Uploading images to Techloop...", {
    autoClose: images.length * 10000,
  });
  const failedImages = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const src = img.getAttribute("src");
    if (src) {
      const result = await processImage(src);
      if (result.success) {
        img.setAttribute("src", result.techloopUrl);
      } else {
        img.setAttribute("data-error", "true");
        console.log("Upload fail : ", src, result.error);
        failedImages.push(i);
      }
    }
  }
  toast.dismiss(toastId);
  if (failedImages.length > 0) {
    toast.error(
      `fail, ${images.length - failedImages.length} / ${
        images.length
      } uploaded`,
      {
        autoClose: 10000,
      }
    );
  } else {
    toast.success(`success, ${images.length} / ${images.length} uploaded`, {
      autoClose: 3000,
    });
  }
  return {
    html: tempDiv.innerHTML,
    failedImages,
  };
};
