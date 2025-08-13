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
      <div className="h-100 w-100 m-auto bg-white rounded shadow overflow-hidden" style={{ maxWidth: '1000px' }}>
        <MyEditor
          className="h-100"
          onContentChange={handleContentChange}
          content={content}
        />
      </div>
    </div>
  );
}
