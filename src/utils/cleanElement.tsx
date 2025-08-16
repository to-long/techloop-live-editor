"use client";

import { getOriginImage } from "./getOriginImage";

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
    let src = element.getAttribute("src") || "";
    src = getOriginImage(src);
    element.outerHTML = `<img src="${src}" />`;
    return;
  }

  if (element.hasChildNodes() && element.childNodes.length > 0) {
    Array.from(element.children).forEach((child) => cleanElement(child));
  }

  // Remove the tag if not allowed, replacing it with a fragment (its children)
  if (!allowedTags.includes(element.tagName.toLowerCase())) {
    const parent = element.parentNode as Element;
    if (parent && parent.tagName.toLowerCase() === "p") {
      // Move all children out of the element, preserving their order
      const fragment = document.createDocumentFragment();
      while (element.firstChild) {
        fragment.appendChild(element.firstChild);
      }
      parent.replaceChild(fragment, element);
    }
    return;
  }
};
