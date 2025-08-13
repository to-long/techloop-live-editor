export const cleanElement = (element: Element) => {
  // Keep only allowed tags
  const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'img', 'p', 'br', 'div', 'span', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'ul', 'ol', 'li', 'form', 'input', 'textarea', 'select', 'option', 'label', 'figure', 'figcaption', 'picture', 'blockquote', 'a'];
  const allowedAttributes = ['src', 'alt', 'style', 'type', 'name', 'value', 'placeholder', 'required', 'disabled', 'readonly'];
  
  // Remove ALL style attributes and classes
  element.removeAttribute('style');
  element.removeAttribute('class');
  element.removeAttribute('id');
  
  // Remove all other attributes except allowed ones
  const attributes = Array.from(element.attributes);
  attributes.forEach(attr => {
    if (!allowedAttributes.includes(attr.name)) {
      element.removeAttribute(attr.name);
    }
  });
  
  if (element.tagName.toLowerCase() === 'img') {
    let src = element.getAttribute('src');
    if (src) {
      src = src.split('?')[0]; // Example: image.jpg?v=123 -> image.jpg
      src = src.replace(/-\d+x\d+(?=\.[a-zA-Z0-9]+$)/, ''); // Example: image-1200x720.jpg -> image.jpg
    }
    const alt = element.getAttribute('alt') || 'Image';
    element.outerHTML = `<img src="${src}" alt="${alt}" />`;
    return;
  }
  
  // For bold text, convert to <strong> without styling
  if (element.tagName.toLowerCase() === 'strong') {
    element.outerHTML = `<b>${element.innerHTML}</b>`;
    return;
  }

  // Remove elements that are not allowed
  if (!allowedTags.includes(element.tagName.toLowerCase())) {
    // If it's a text node or allowed element, keep it
    if (element.nodeType === Node.TEXT_NODE || allowedTags.includes(element.tagName.toLowerCase())) {
      // Keep the content but clean children
      const children = Array.from(element.children);
      children.forEach(child => {
        if (!allowedTags.includes(child.tagName.toLowerCase())) {
          // Replace with just the text content
          child.outerHTML = child.textContent || '';
        } else {
          cleanElement(child);
        }
      });
    } else {
      // Replace with text content
      element.outerHTML = element.textContent || '';
    }
  } else {
    // Clean children of allowed elements
    const children = Array.from(element.children);
    children.forEach(child => cleanElement(child));
  }
}