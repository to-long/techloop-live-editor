'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import TinyMCE to avoid SSR issues
const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => ({ default: mod.Editor })), {
  ssr: false,
  loading: () => <div className="d-flex align-items-center justify-content-center h-100">Loading editor...</div>
});

interface MarkdownEditorProps {
  className?: string;
  onContentChange?: (content: string) => void;
}

export const MyEditor: React.FC<MarkdownEditorProps> = ({
  className = '',
  onContentChange,
}) => {
  const [content, setContent] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEditorChange = (content: string) => {
    setContent(content);
    onContentChange?.(content);
  };

  if (!isClient) {
    return (
      <div className={`tinymce-editor h-100 d-flex flex-column ${className}`}>
        <div className="editor-container flex-fill d-flex align-items-center justify-content-center">
          <div className="text-muted">Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`tinymce-editor h-100 d-flex flex-column ${className}`}>
      <div className="editor-container flex-fill">
        <Editor
          apiKey="rxsu0ox8enqzvhq1utetup9eh9z2y5fh5o42jbe29ppkg4n9"
          value={content}
          onEditorChange={handleEditorChange}
                      init={{
              height: '100%',
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                'paste', 'textpattern', 'nonbreaking',
                'emoticons', 'hr', 'pagebreak', 'quickbars', 'save', 'template'
              ],
              toolbar: [
                'alignleft aligncenter alignright alignjustify',
                'bullist numlist',
                'outdent indent',
                'link image media table insertimageurl | code '
              ].join(' '),
              toolbar_mode: 'wrap',
                            toolbar_sticky: true,
              toolbar_sticky_offset: 0,
              content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; padding: 8px; }',
              skin: 'oxide',
              content_css: 'default',
              resize: false,
              branding: false,
              elementpath: false,
              statusbar: true,
              statusbar_items: 'wordcount | charactercount',
              min_height: 300,
              max_height: 800,
              contextmenu: 'link image table configurepermanentpen',
              quickbars_selection_toolbar: 'bold underline h1 h2 h3 quicklink blockquote',
              quickbars_insert_toolbar: 'h1 h2 h3 insertimageurl',
              textpattern_patterns: [
                {start: '*', end: '*', format: 'italic'},
                {start: '**', end: '**', format: 'bold'},
                {start: '#', format: 'h1'},
                {start: '##', format: 'h2'},
                {start: '###', format: 'h3'},
                {start: '####', format: 'h4'},
                {start: '#####', format: 'h5'},
                {start: '######', format: 'h6'},
                {start: '1. ', cmd: 'InsertOrderedList'},
                {start: '* ', cmd: 'InsertUnorderedList'},
                {start: '- ', cmd: 'InsertUnorderedList'}
              ],
              setup: function(editor) {
                // Add custom button for inserting image from URL
                editor.ui.registry.addButton('insertimageurl', {
                  text: '📷',
                  tooltip: 'Insert Image from URL',
                  onAction: function() {
                    const url = prompt('Enter image URL:');
                    if (url) {
                      editor.insertContent('<img src="' + url + '" alt="Image" style="max-width: 100%; height: auto;" />');
                    }
                  }
                });
              },
            paste_data_images: true,
            paste_as_text: false,
            paste_enable_default_filters: true,
            paste_word_valid_elements: 'b,strong,i,em,h1,h2,h3,h4,h5,h6',
            paste_retain_style_properties: 'color background-color font-size font-weight font-style text-decoration',
            paste_remove_styles_if_webkit: false,
            paste_remove_styles: false,
            paste_auto_cleanup_on_paste: false,
            paste_convert_word_fake_lists: false,
            paste_use_dialog: false,
            paste_merge_formats: true,
            paste_convert_unsafe_svg: true,
            paste_webkit_styles: 'color background-color font-size font-weight font-style text-decoration'
          }}
        />
      </div>
    </div>
  );
};
