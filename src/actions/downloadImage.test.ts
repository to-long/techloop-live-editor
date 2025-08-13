import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadImage } from "./downloadImage";

// Mock sharp module
vi.mock("sharp", () => {
  return {
    default: vi.fn(() => ({
      metadata: vi.fn().mockResolvedValue({ width: 1000, height: 1000 }),
      jpeg: vi.fn().mockReturnThis(),
      withMetadata: vi.fn().mockReturnThis(),
      resize: vi.fn().mockReturnThis(),
      toBuffer: vi.fn().mockResolvedValue(Buffer.from([9, 8, 7])),
    })),
  };
});

describe("downloadImage", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("downloads and resizes a valid image", async () => {
    // Arrange: mock fetch to return a fake image buffer
    const fakeArrayBuffer = new Uint8Array([1, 2, 3, 4]).buffer;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => fakeArrayBuffer,
    });

    const result = await downloadImage("https://example.com/image.jpg");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(Buffer.from([9, 8, 7]));
  });

  it("returns undefined if fetch fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network error"));
    const result = await downloadImage("https://example.com/image.jpg");
    expect(result).toBeUndefined();
  });

  it("returns undefined if response is not ok", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false });
    const result = await downloadImage("https://example.com/image.jpg");
    expect(result).toBeUndefined();
  });

  it("generates a unique filename for generic image URLs", async () => {
    // Arrange: mock fetch to return a fake image buffer
    const fakeArrayBuffer = new Uint8Array([1, 2, 3, 4]).buffer;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => fakeArrayBuffer,
    });

    const result = await downloadImage("https://example.com/image.jpg?foo=bar");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(Buffer.from([9, 8, 7]));
  });

  it("returns undefined if sharp throws", async () => {
    const fakeArrayBuffer = new Uint8Array([1, 2, 3, 4]).buffer;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => fakeArrayBuffer,
    });

    // Override the module mock to throw
    const { default: sharp } = await import("sharp");
    vi.mocked(sharp).mockImplementationOnce(() => {
      throw new Error("Sharp error");
    });

    const result = await downloadImage("https://example.com/image.jpg");
    expect(result).toBeUndefined();
  });
});
