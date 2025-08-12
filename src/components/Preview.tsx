'use client';

import React from 'react';

interface PreviewProps {
  content: string;
}

export const Preview: React.FC<PreviewProps> = ({ content = 'Preview' }) => {
  return (
    <div className="preview-container h-100 d-flex flex-column">
      <div className="preview-content flex-fill p-4">
        <div 
          className="prose prose-sm"
          dangerouslySetInnerHTML={{ __html: content }}
                      style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: '14px',
              lineHeight: '1.6',
              padding: '24px',
              backgroundColor: '#ffffff',
              color: '#171717',
              minHeight: '100%'
            }}
        />
      </div>
    </div>
  );
};
