'use client';

import React, { useRef, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number | string;
  className?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing your markdown...',
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Custom paste handler
  const handlePaste = useCallback((event: ClipboardEvent) => {
    event.preventDefault();
    
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const text = clipboardData.getData('text/plain');
    const html = clipboardData.getData('text/html');
    
    // You can customize this logic based on your needs
    let processedText = text;
    
    // Example: Convert HTML to markdown if HTML is available
    if (html && text !== html) {
      // Simple HTML to markdown conversion
      processedText = html
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
        .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
        .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
          return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
        })
        .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
          let index = 1;
          return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${index++}. $1\n`);
        })
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
        .trim();
    }
    
    // Insert the processed text at cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(processedText));
    }
  }, []);

  // Attach paste event listener
  React.useEffect(() => {
    const editorElement = editorRef.current;
    if (editorElement) {
      editorElement.addEventListener('paste', handlePaste);
      return () => {
        editorElement.removeEventListener('paste', handlePaste);
      };
    }
  }, [handlePaste]);

  return (
    <div className={`markdown-editor h-full flex flex-col ${className}`} ref={editorRef}>
      <div className="editor-container flex-1 min-h-0">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          preview={'live'}
          height="100%"
          className="h-full"
          data-color-mode="light"
          textareaProps={{
            style: { fontSize: '14px' }
          }}
        />
      </div>
    </div>
  );
};
