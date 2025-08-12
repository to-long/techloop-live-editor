'use client';

import React from 'react';

interface PreviewProps {
  content: string;
}

export const Preview: React.FC<PreviewProps> = ({ content = 
  'Preview'
 }) => {
  return (
    <div className="preview-container h-full flex flex-col">
      <div className="preview-content flex-1">
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          />
      </div>
    </div>
  );
};
