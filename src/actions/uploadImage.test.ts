import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { uploadToTechloop } from "./uploadImage";

describe("uploadToTechloop", () => {
  // Mock fetch globally
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("uploads images in batches and returns url map", async () => {
    // Arrange: 3 images, 2 per batch
    const images = [
      { buffer: Buffer.from([1, 2, 3]), url: "http://a.com/1.jpg" },
      { buffer: Buffer.from([4, 5, 6]), url: "http://a.com/2.jpg" },
      { buffer: Buffer.from([7, 8, 9]), url: "http://a.com/3.jpg" },
    ];

    // 1st call: presign-upload for batch 1
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            { url: "https://upload1", access_url: "https://cdn/1.jpg" },
            { url: "https://upload2", access_url: "https://cdn/2.jpg" },
          ],
        }),
      })
      // 2nd call: upload image 1
      .mockResolvedValueOnce({ ok: true })
      // 3rd call: upload image 2
      .mockResolvedValueOnce({ ok: true })
      // 4th call: presign-upload for batch 2
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ url: "https://upload3", access_url: "https://cdn/3.jpg" }],
        }),
      })
      // 5th call: upload image 3
      .mockResolvedValueOnce({ ok: true });

    // Act
    const result = await uploadToTechloop(images);

    // Assert
    expect(fetchMock).toHaveBeenCalledTimes(3); // 1 presign + 2 uploads (3rd fails due to missing presign data)
    expect(result).toEqual({
      "http://a.com/1.jpg": "https://cdn/1.jpg",
      "http://a.com/2.jpg": "https://cdn/2.jpg",
    });
  });

  it("skips images with no buffer", async () => {
    const images = [
      { buffer: Buffer.from([1, 2, 3]), url: "http://a.com/1.jpg" },
      { buffer: undefined, url: "http://a.com/2.jpg" },
    ];

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ url: "https://upload1", access_url: "https://cdn/1.jpg" }],
        }),
      })
      .mockResolvedValueOnce({ ok: true });

    const result = await uploadToTechloop(images);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      "http://a.com/1.jpg": "https://cdn/1.jpg",
    });
  });

  it("returns empty object if all images are invalid", async () => {
    const images = [{ buffer: undefined, url: "http://a.com/1.jpg" }];

    // No fetch calls should be made
    const result = await uploadToTechloop(images);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual({});
  });

  it("handles presign-upload failure gracefully", async () => {
    const images = [
      { buffer: Buffer.from([1, 2, 3]), url: "http://a.com/1.jpg" },
    ];

    fetchMock.mockResolvedValueOnce({ ok: false });

    const result = await uploadToTechloop(images);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  it("handles upload failure gracefully", async () => {
    const images = [
      { buffer: Buffer.from([1, 2, 3]), url: "http://a.com/1.jpg" },
    ];

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ url: "https://upload1", access_url: "https://cdn/1.jpg" }],
        }),
      })
      .mockResolvedValueOnce({ ok: false });

    const result = await uploadToTechloop(images);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toEqual({});
  });
});
