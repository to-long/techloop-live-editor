import { describe, it, expect } from "vitest";
import { cleanElement } from "./cleanElement";

describe("cleanElement", () => {
  function createElementFromHTML(html: string): Element {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild!;
  }

  it("removes disallowed attributes and classes", () => {
    const el = createElementFromHTML(
      `<p style="color:red;" class="foo" id="bar" data-test="baz">Hello</p>`
    );
    cleanElement(el);
    expect(el.hasAttribute("style")).toBe(false);
    expect(el.hasAttribute("class")).toBe(false);
    expect(el.hasAttribute("id")).toBe(false);
    expect(el.hasAttribute("data-test")).toBe(false);
    expect(el.outerHTML).toBe("<p>Hello</p>");
  });

  it("keeps allowed attributes", () => {
    const el = createElementFromHTML(
      `<input type="text" name="username" value="foo" placeholder="Enter" required="true" />`
    );
    cleanElement(el);
    expect(el.hasAttribute("type")).toBe(true);
    expect(el.hasAttribute("name")).toBe(true);
    expect(el.hasAttribute("value")).toBe(true);
    expect(el.hasAttribute("placeholder")).toBe(true);
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("style")).toBe(false);
    expect(el.hasAttribute("class")).toBe(false);
  });

  it("removes disallowed tags and keeps text", () => {
    const el = createElementFromHTML(
      `<script>alert("xss")</script><p>Safe</p>`
    );
    // Wrap in a parent to test removal
    const parent = document.createElement("div");
    parent.appendChild(el);
    cleanElement(el);
    // script should be replaced with its text content (empty), p should remain
    expect(parent.innerHTML).toBe('alert("xss")');
  });

  it("cleans children recursively", () => {
    const el = createElementFromHTML(
      `<div><span style="color:blue;" class="foo">Text</span><b>Bold</b></div>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe("<div><span>Text</span><b>Bold</b></div>");
  });

  it("converts <strong> to <b> and removes styling", () => {
    const el = createElementFromHTML(
      `<strong style="font-weight:bold;">Bold Text</strong>`
    );
    // Wrap in a parent to check outerHTML replacement
    const parent = document.createElement("div");
    parent.appendChild(el);
    cleanElement(el);
    expect(parent.innerHTML).toBe("<b>Bold Text</b>");
  });

  it("cleans <img> src and alt, removes query and size", () => {
    const el = createElementFromHTML(
      `<img src="image-1200x720.jpg?v=123" alt="desc" style="width:100px;" class="img" />`
    );
    // Wrap in a parent to check outerHTML replacement
    const parent = document.createElement("div");
    parent.appendChild(el);
    cleanElement(el);
    expect(parent.innerHTML).toBe('<img src="image.jpg" alt="desc">');
  });

  it("sets default alt for <img> if missing", () => {
    const el = createElementFromHTML(`<img src="photo-800x600.png" />`);
    const parent = document.createElement("div");
    parent.appendChild(el);
    cleanElement(el);
    expect(parent.innerHTML).toBe('<img src="photo.png" alt="Image">');
  });

  it("removes not allowed elements but keeps children text", () => {
    const el = createElementFromHTML(`<div><foo>Bar</foo><p>Keep</p></div>`);
    cleanElement(el);
    expect(el.outerHTML).toBe("<div>Bar<p>Keep</p></div>");
  });

  it("handles deeply nested disallowed elements", () => {
    const el = createElementFromHTML(
      `<div><foo><bar>Deep</bar></foo><span>Shallow</span></div>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe("<div>Deep<span>Shallow</span></div>");
  });

  it("does not throw on text nodes", () => {
    const div = document.createElement("div");
    div.innerHTML = "Just text";
    expect(() => cleanElement(div)).not.toThrow();
    expect(div.outerHTML).toBe("<div>Just text</div>");
  });

  // Additional tests for the recursive child cleaning logic
  it("handles mixed allowed and disallowed children", () => {
    const el = createElementFromHTML(
      `<div><p>Allowed</p><script>Disallowed</script><span>Allowed</span><iframe>Disallowed</iframe></div>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe(
      "<div><p>Allowed</p>Disallowed<span>Allowed</span>Disallowed</div>"
    );
  });

  it("handles nested allowed elements with disallowed children", () => {
    const el = createElementFromHTML(
      `<div><p>Text <script>script</script> more text</p><span>Clean</span></div>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe(
      "<div><p>Text script more text</p><span>Clean</span></div>"
    );
  });

  it("handles empty disallowed elements", () => {
    const el = createElementFromHTML(
      `<div><script></script><p>Content</p></div>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe("<div><p>Content</p></div>");
  });

  it("handles disallowed elements with only whitespace", () => {
    const el = createElementFromHTML(
      `<div><script>   </script><p>Content</p></div>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe("<div>   <p>Content</p></div>");
  });

  it("handles multiple levels of nested disallowed elements", () => {
    const el = createElementFromHTML(
      `<div><foo><bar><baz>Deep nested</baz></bar></foo><p>Content</p></div>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe("<div>Deep nested<p>Content</p></div>");
  });

  it("handles disallowed elements with complex content", () => {
    const el = createElementFromHTML(
      `<div><script>alert("test"); console.log("test");</script><p>Safe content</p></div>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe(
      '<div>alert("test"); console.log("test");<p>Safe content</p></div>'
    );
  });

  it("handles allowed elements with mixed content", () => {
    const el = createElementFromHTML(
      `<div><p>Text <strong>bold</strong> <em>italic</em> <script>script</script> end</p></div>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe(
      "<div><p>Text <b>bold</b> italic script end</p></div>"
    );
  });

  it("handles self-closing allowed elements", () => {
    const el = createElementFromHTML(
      `<div><br /><hr /><img src="test.jpg" /></div>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe(
      '<div><br><img src="test.jpg" alt="Image"></div>'
    );
  });

  it("handles form elements with allowed attributes", () => {
    const el = createElementFromHTML(
      `<form><input type="text" name="test" value="value" required /><textarea placeholder="Enter text"></textarea></form>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe(
      '<form><input type="text" name="test" value="value" required=""><textarea placeholder="Enter text"></textarea></form>'
    );
  });

  it("handles table elements correctly", () => {
    const el = createElementFromHTML(
      `<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe(
      "<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table>"
    );
  });

  it("handles list elements correctly", () => {
    const el = createElementFromHTML(
      `<ul><li>Item 1</li><li>Item 2</li></ul><ol><li>Ordered 1</li></ol>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe("<ul><li>Item 1</li><li>Item 2</li></ul>");
  });

  it("handles elements with no children", () => {
    const el = createElementFromHTML(`<div></div>`);
    cleanElement(el);
    expect(el.outerHTML).toBe("<div></div>");
  });

  it("handles elements with only text children", () => {
    const el = createElementFromHTML(`<div>Only text content</div>`);
    cleanElement(el);
    expect(el.outerHTML).toBe("<div>Only text content</div>");
  });

  it("handles elements with mixed text and element children", () => {
    const el = createElementFromHTML(
      `<div>Text <p>Paragraph</p> more text</div>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe("<div>Text <p>Paragraph</p> more text</div>");
  });

  it("handles elements with attributes that should be removed", () => {
    const el = createElementFromHTML(
      `<div onclick="alert('test')" data-test="value" style="color: red;" class="test-class">Content</div>`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe("<div>Content</div>");
  });

  it("handles elements with allowed attributes mixed with disallowed ones", () => {
    const el = createElementFromHTML(
      `<input type="text" name="test" value="value" onclick="alert('test')" data-test="value" style="color: red;" class="test-class" />`
    );
    cleanElement(el);
    expect(el.outerHTML).toBe('<input type="text" name="test" value="value">');
  });
});
