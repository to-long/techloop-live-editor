'use client';

import { useState } from 'react';
import { MarkdownEditor } from '@/components/MarkdownEditor';

export default function Home() {
  const [content, setContent] = useState(`# Welcome to TechLoop Live Editor

This is a **powerful** markdown editor with custom paste control.

## Features

- ✨ **Custom Paste Handling**: Automatically converts HTML to Markdown
- 📝 **Live Preview**: See your markdown rendered in real-time
- 🎨 **Syntax Highlighting**: Beautiful code highlighting
- 📱 **Responsive Design**: Works on all devices

## Try Pasting Content

Copy some formatted text from a website or document and paste it here. The editor will automatically convert HTML formatting to markdown!

### Example HTML to Markdown Conversion

When you paste content like:
\`\`\`html
<h1>Title</h1>
<p>This is <strong>bold</strong> and <em>italic</em> text.</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
\`\`\`

It will be converted to:
\`\`\`markdown
# Title

This is **bold** and *italic* text.

- Item 1
- Item 2
\`\`\`

---

*Start typing or paste content below to see the magic happen!*`);

  return (
    <div className="h-screen w-screen bg-gray-50">
      <div className="h-full w-full p-4">
        <div className="h-full w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Start writing your markdown or paste formatted content..."
            height="100%"
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
