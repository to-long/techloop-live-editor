import TurndownService from "turndown";

const turndownService = new TurndownService();

export const copyHtmlToMarkdown = async (htmlContent: string) => {
  let markdownContent = turndownService.turndown(htmlContent); // Convert to Markdown
  markdownContent = markdownContent.replace(
    /!\[[^\]]*\]\(([^)]+)\)/g,
    "![]($1)"
  ); // Replace all ![alt](image) with ![](image)

  try {
    await navigator.clipboard.writeText(markdownContent);
    console.log("Markdown copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy Markdown:", err);
    throw err;
  }
};
