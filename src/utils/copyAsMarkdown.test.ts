import { describe, it, expect, vi, beforeEach } from "vitest";
import { copyHtmlToMarkdown } from "./copyAsMarkdown";

describe("copyHtmlToMarkdown", () => {
  beforeEach(() => {
    // Reset the clipboard mock before each test
    vi.resetAllMocks();
  });

  it("converts simple HTML to Markdown and copies to clipboard", async () => {
    const html = "<h1>Hello</h1><p>This is <b>bold</b> text.</p>";
    const expectedMarkdown = "# Hello\n\nThis is **bold** text.";

    const writeTextMock = global.navigator.clipboard.writeText as ReturnType<
      typeof vi.fn
    >;

    // Make writeText resolve
    writeTextMock.mockResolvedValue(undefined);

    await copyHtmlToMarkdown(html);

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    // The markdown may have extra newlines, so check for substring
    expect(writeTextMock.mock.calls[0][0]).toContain("Hello");
    expect(writeTextMock.mock.calls[0][0]).toContain("**bold** text.");
  });

  it("replaces image alt text with empty alt in Markdown", async () => {
    const html = '<img src="foo.jpg" alt="desc" />';
    // Turndown would produce: ![desc](foo.jpg), but our code replaces with ![](foo.jpg)
    const expectedMarkdown = "![](foo.jpg)";

    const writeTextMock = global.navigator.clipboard.writeText as ReturnType<
      typeof vi.fn
    >;
    writeTextMock.mockResolvedValue(undefined);

    await copyHtmlToMarkdown(html);

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock.mock.calls[0][0]).toBe(expectedMarkdown);
  });

  it("logs success message on successful copy", async () => {
    const html = "<p>Test</p>";
    const writeTextMock = global.navigator.clipboard.writeText as ReturnType<
      typeof vi.fn
    >;
    writeTextMock.mockResolvedValue(undefined);

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await copyHtmlToMarkdown(html);

    expect(logSpy).toHaveBeenCalledWith("Markdown copied to clipboard!");
    logSpy.mockRestore();
  });

  it("logs error message on failed copy", async () => {
    const html = "<p>Test</p>";
    const writeTextMock = global.navigator.clipboard.writeText as ReturnType<
      typeof vi.fn
    >;
    const error = new Error("Clipboard error");
    writeTextMock.mockRejectedValue(error);

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(copyHtmlToMarkdown(html)).rejects.toThrow("Clipboard error");

    expect(errorSpy).toHaveBeenCalledWith("Failed to copy Markdown:", error);
    errorSpy.mockRestore();
  });
});
