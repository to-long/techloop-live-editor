"use server";

import { downloadImage } from "./downloadImage";
import { uploadToTechloop } from "./uploadImage";

export async function processImage(url: string) {
  try {
    const domain = new URL(url).hostname;
    if (domain !== "techloop.vn") {
      const buffer = await downloadImage(url);
      const techloopUrl = await uploadToTechloop({
        buffer,
        url,
      });
      return {
        success: true,
        techloopUrl,
      };
    }
    return {
      success: false,
      error: "Skip image from techloop.vn already",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
