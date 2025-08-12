'use client';

import { MyEditor } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className="vh-100 w-100 bg-light">
      <div className="h-100 w-100 d-flex">
        {/* Left half - Editor */}
        <div className="w-50 h-100 pe-1">
          <div className="h-100 w-100 bg-white rounded shadow overflow-hidden">
            <MyEditor
              className="h-100"
              onContentChange={handleContentChange}
            />
          </div>
        </div>
        
        {/* Right half - Preview */}
        <div className="w-50 h-100 ps-1">
          <div className="h-100 w-100 bg-white rounded shadow overflow-hidden">
            <Preview content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
