'use client';

import { MyEditor } from '@/components/Editor';
import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className="vh-100 w-100 bg-light">
      <div className="h-100 w-100 d-flex">
        <div className=" h-100 m-auto " style={{ width: '80x%' }}>
          <div className="h-100 w-100 bg-white rounded shadow overflow-hidden">
            <MyEditor
              className="h-100"
              onContentChange={handleContentChange}
              content={content}
            />
          </div>
        </div>
        
        {/* Right half - Preview */}
        {/* <div className="w-50 h-100 ">
          <div className="h-100 w-100 bg-white rounded shadow overflow-auto">
            <Preview content={content} />
          </div>
        </div> */}
      </div>
    </div>
  );
}
