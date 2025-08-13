import { describe, it, expect, vi, beforeEach } from "vitest";
import { replaceImageUrl } from "./replaceImageUrl";

vi.mock("@/actions/processImage", () => ({
  processImage: vi.fn(),
}));

import { processImage } from "@/actions/processImage";

describe("replaceImageUrl", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("replaces image src attributes with mapped URLs from processImage", async () => {
    // Arrange
    const html = `
      <div>
        <img src="foo.jpg" alt="foo" />
        <img src="bar.png" alt="bar" />
      </div>
    `;
    vi.mocked(processImage).mockResolvedValue({
      success: true,
      mapUrl: {
        "foo.jpg": "foo-processed.jpg",
        "bar.png": "bar-processed.png",
      },
    });

    // Act
    const result = await replaceImageUrl(html);

    // Assert
    expect(result).toContain('src="foo-processed.jpg"');
    expect(result).toContain('src="bar-processed.png"');
    expect(processImage).toHaveBeenCalledWith(["foo.jpg", "bar.png"]);
  });

  it("does not change src if processImage returns success: false", async () => {
    const html = `<img src="baz.jpg" alt="baz" />`;
    vi.mocked(processImage).mockResolvedValue({
      success: false,
      mapUrl: {},
    });

    const result = await replaceImageUrl(html);

    expect(result).toContain('src="baz.jpg"');
  });

  it("does not throw or change anything if there are no images", async () => {
    const html = `<p>No images here</p>`;
    vi.mocked(processImage).mockResolvedValue({
      success: true,
      mapUrl: {},
    });

    const result = await replaceImageUrl(html);

    expect(result).toBe("<p>No images here</p>");
    expect(processImage).toHaveBeenCalledWith([]);
  });

  it("ignores images with no src attribute", async () => {
    const html = `<img alt="no src" /><img src="has-src.jpg" />`;
    vi.mocked(processImage).mockResolvedValue({
      success: true,
      mapUrl: {
        "has-src.jpg": "new-src.jpg",
      },
    });

    const result = await replaceImageUrl(html);

    expect(result).toContain('<img alt="no src">');
    expect(result).toContain('src="new-src.jpg"');
  });

  it("handles empty input", async () => {
    vi.mocked(processImage).mockResolvedValue({
      success: true,
      mapUrl: {},
    });

    const result = await replaceImageUrl("");

    expect(result).toBe("");
    expect(processImage).toHaveBeenCalledWith([]);
  });
});
