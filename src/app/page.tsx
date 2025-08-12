'use client';

import { MyEditor } from '@/components/Editor';

export default function Home() {
  return (
    <div className="h-screen w-screen bg-gray-50">
      <div className="h-full w-full p-4">
        <div className="h-full w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <MyEditor
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
