import TurndownService from "turndown";

const turndownService = new TurndownService({
  headingStyle: "atx",
});

turndownService.addRule("image", {
  filter: ["img"],
  replacement: function (content, node) {
    const src = (node as HTMLElement).getAttribute("src");
    return src ? `![](${src})` : "";
  },
});

export const copyHtmlToMarkdown = async (htmlContent: string) => {
  const markdownContent = turndownService.turndown(htmlContent); // Convert to Markdown

  try {
    await navigator.clipboard.writeText(markdownContent);
    console.log("Markdown copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy Markdown:", err);
    throw err;
  }
};
