'use client';

import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface MarkdownEditorProps {
  className?: string;
}

export const MyEditor: React.FC<MarkdownEditorProps> = ({
  className = '',
}) => {
  const [content, setContent] = useState('');

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  return (
    <div className={`tinymce-editor h-full flex flex-col ${className}`}>
      <div className="editor-container flex-1 min-h-0">
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
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
            skin: 'oxide',
            content_css: 'default',
            resize: false,
            branding: false,
            elementpath: false,
            statusbar: false,
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
