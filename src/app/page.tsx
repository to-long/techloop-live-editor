"use client";

import { MyEditor } from "@/components/Editor";
import { useLayoutStore } from "@/store/layoutStore";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const { layout } = useLayoutStore();

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className="vh-100 w-100 overflow-hidden">
      <div
        className={`h-100 d-flex ${layout === "chat" ? "w-100" : "w-200"}`}
        style={{ width: "200%", transition: "width 200ms" }}
      >
        <div className="h-100 w-50">
          <MyEditor
            className="h-100"
            onContentChange={handleContentChange}
            content={content}
          />
        </div>
        <div className="h-100 w-50">
          <iframe
            src="https://www.getmerlin.in/chat/9fa7d9f0-b90f-42b2-b6aa-4e0eeb865d28"
            className="h-100 w-100"
            allow="clipboard-read; clipboard-write"
          />
        </div>
      </div>
    </div>
  );
}
