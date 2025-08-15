"use client";

const defaultAllowedTags = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "b",
  "p",
  "span",

  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "ul",
  "ol",
  "li",

  "form",
  "input",
  "textarea",
  "select",
  "option",
  "label",

  "img",
  "blockquote",
];
const defaultAllowedAttributes = [
  "src",
  "type",
  "name",
  "value",
  "placeholder",
  "required",
  "disabled",
  "readonly",
];

export const cleanElement = (element: Element) => {
  const keepLinks = localStorage.getItem("keepLinks") === "true";

  const allowedTags = [...defaultAllowedTags];
  const allowedAttributes = [...defaultAllowedAttributes];

  if (keepLinks) {
    allowedTags.push("a");
    allowedAttributes.push("href");
  }

  // Remove all other attributes except allowed ones
  Array.from(element.attributes).forEach((attr) => {
    if (!allowedAttributes.includes(attr.name)) {
      element.removeAttribute(attr.name);
    }
  });

  if (element.tagName.toLowerCase() === "img") {
    let src = element.getAttribute("src");
    if (src) {
      const httpsCount = (src.match(/https:\/\//g) || []).length;
      // If there are more than 2 "https://" in the src, keep only the last one
      if (httpsCount >= 2) {
        const lastHttpsIndex = src.lastIndexOf("https://");
        if (lastHttpsIndex !== -1) {
          src = src.substring(lastHttpsIndex);
        }
      }
      src = src.split("?")[0]; // Example: image.jpg?v=123 -> image.jpg
      src = src.replace(/-\d+x\d+(?=\.[a-zA-Z0-9]+$)/, ""); // Example: image-1200x720.jpg -> image.jpg
    }
    element.outerHTML = `<img src="${src}" />`;
    return;
  }

  if (element.hasChildNodes() && element.childNodes.length > 0) {
    Array.from(element.children).forEach((child) => cleanElement(child));
  }

  // Remove the tag if not allowed, keeping its innerHTML
  if (!allowedTags.includes(element.tagName.toLowerCase())) {
    const parent = element.parentNode;
    if (parent) {
      // Replace the element with its children (preserving innerHTML)
      while (element.firstChild) {
        parent.insertBefore(element.firstChild, element);
      }
      parent.removeChild(element);
    }
    return;
  }
};
