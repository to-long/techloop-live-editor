import { describe, it, expect } from "vitest";
import { getOriginImage } from "./getOriginImage";

describe("getOriginImage", () => {
  it("removes both query and size suffix", () => {
    const url = "https://example.com/image-1200x720.jpg?foo=bar";
    expect(getOriginImage(url)).toBe("https://example.com/image.jpg");
  });

  it("returns the same URL if no changes are needed", () => {
    const url = "https://example.com/image.jpg";
    expect(getOriginImage(url)).toBe("https://example.com/image.jpg");
  });

  it("handles URLs with multiple https:// and keeps only the last", () => {
    const url = "https://foo.com/redirect?url=https://bar.com/image.jpg";
    expect(getOriginImage(url)).toBe("https://bar.com/image.jpg");
  });

  it("returns empty string if input is empty", () => {
    expect(getOriginImage("")).toBe("");
  });

  it("handles non-URL strings gracefully", () => {
    expect(getOriginImage("not a url")).toBe("not a url");
  });

  it("handles CNET resize URLs", () => {
    const url =
      "https://www.cnet.com/a/img/resize/50cb5059a898ccfb4b5bde738ff162b664af035c/hub/2025/08/01/95dc749c-917b-4ebc-8a54-7a333981d40b/applewatchsweries10promo.jpg?auto=webp&fit=crop&height=675&width=1200";
    // The cnet() function is not exported, but getOriginImage should call it if integrated.
    // If not, this test will just check the default getOriginImage behavior.
    expect(getOriginImage(url)).toBe(
      "https://www.cnet.com/a/img/hub/2025/08/01/95dc749c-917b-4ebc-8a54-7a333981d40b/applewatchsweries10promo.jpg"
    );
  });
});
