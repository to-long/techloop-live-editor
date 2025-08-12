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
    <div className="h-screen w-screen bg-gray-50">
      <div className="h-full w-full flex">
        {/* Left half - Editor */}
        <div className="w-1/2 h-full p-4 pr-2">
          <div className="h-full w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <MyEditor
              className="h-full"
              onContentChange={handleContentChange}
            />
          </div>
        </div>
        
        {/* Right half - Preview */}
        <div className="w-1/2 h-full p-4 pl-2">
          <div className="h-full w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <Preview content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
