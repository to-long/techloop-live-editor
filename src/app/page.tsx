"use client";

import { MyEditor } from "@/components/Editor";
import { useLayoutStore } from "@/store/layoutStore";
import { useEffect, useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const { layout } = useLayoutStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  console.log("change layout", layout);
  return (
    <div className="vh-100 w-100 overflow-hidden">
      <div
        className={`h-100 d-flex ${
          layout === "chat" && isClient ? "w-100" : "w-200"
        }`}
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
