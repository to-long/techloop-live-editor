import TurndownService from "turndown";

const turndownService = new TurndownService({
  headingStyle: "atx",
});

turndownService.addRule("image", {
  filter: ["img", "picture", "figure"],
  replacement: function (content, node) {
    console.log("node", content);
    const div = document.createElement("div");
    div.appendChild(node);
    const img = div.querySelector("img");
    const src = img?.getAttribute("src") || "";
    return src ? `![](${src})` : content;
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
