"use server";

import { ImageWithUrl } from "@/types/common";

const apiBaseUrl = process.env.API_BASE_URL || "https://api.techloop.vn/api/v1";
const token = process.env.TECHLOOP_TOKEN || "";

const headers = {
  accept: "application/json",
  "accept-language": "vi-VN",
  authorization: `Bearer ${token}`,
  "content-type": "application/json",
  origin: "https://techloop.vn",
  referer: "https://techloop.vn/",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
};

export const uploadToTechloop = async (image: ImageWithUrl) => {
  const presignUrl = await getPresignUrl(image);
  const uploadResponse = await fetch(presignUrl, {
    method: "PUT",
    headers: { "content-type": "*/*" },
    body: new Blob([image.buffer as unknown as ArrayBuffer]),
  });
  if (!uploadResponse.ok) {
    throw new Error(
      `❌ Error uploading image ${image.url}: ${uploadResponse.status}`
    );
  }
  return presignUrl;
};

const getPresignUrl = async (image: ImageWithUrl) => {
  const presignResponse = await fetch(`${apiBaseUrl}/files/presign-upload`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      target: "TOPIC",
      objects: [
        { key: `image_${image.url}.jpg`, length: image.buffer?.length || 0 },
      ],
    }),
  });
  if (!presignResponse.ok) {
    throw new Error(
      `❌ Error getting presign URL for image ${image.url}: ${presignResponse.status}`
    );
  }
  const presignData = await presignResponse.json();
  return presignData.data[0].url;
};
