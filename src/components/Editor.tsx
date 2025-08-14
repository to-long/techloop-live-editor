/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { replaceImageUrl } from "@/utils/replaceImageUrl";
import { cleanElement } from "@/utils/cleanElement";
import { useLayoutStore } from "@/store/layoutStore";
import { toast, ToastContainer } from "react-toastify";
import { copyHtmlToMarkdown } from "@/utils/copyAsMarkdown";

// Dynamically import TinyMCE to avoid SSR issues
const Editor = dynamic(
  () =>
    import("@tinymce/tinymce-react").then((mod) => ({ default: mod.Editor })),
  {
    ssr: false,
    loading: () => (
      <div className="d-flex align-items-center justify-content-center h-100">
        Loading editor...
      </div>
    ),
  }
);

interface MarkdownEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  className?: string;
}

export const MyEditor: React.FC<MarkdownEditorProps> = ({
  onContentChange,
  content,
  className = "",
}) => {
  const [isClient, setIsClient] = useState(false);
  const { layout, toggleLayout } = useLayoutStore();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      onContentChange(localStorage.getItem("content") || "");
    }
  }, [onContentChange]);

  const handleEditorChange = (content: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("content", content);
    }
    onContentChange(content);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div
      className={`tinymce-editor h-100 d-flex flex-column ${className} m-auto border`}
      style={{ maxWidth: "1200px" }}
    >
      <div className="editor-container flex-fill">
        <Editor
          apiKey="rxsu0ox8enqzvhq1utetup9eh9z2y5fh5o42jbe29ppkg4n9"
          value={content}
          onEditorChange={handleEditorChange}
          init={{
            height: "100%",
            menubar: false,
            plugins: [
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
              "nonbreaking",
              "emoticons",
              "pagebreak",
              "quickbars",
              "save",
              "markdown",
            ],
            toolbar: [
              "blocks align bullist numlist outdent indent link image media table",
              "keepLinks code",
              "techloop copyToMarkdown showChat",
            ].join(" | "),
            toolbar_mode: "wrap",
            toolbar_sticky: true,
            toolbar_sticky_offset: 0,
            content_style:
              'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; padding: 8px; } img { max-width: 100%; height: auto }',
            skin: "snow",
            icons: "thin",
            content_css: "default",
            resize: false,
            branding: false,
            elementpath: false,
            statusbar: false,
            statusbar_items: "wordcount | charactercount",
            min_height: 300,
            max_height: 800,
            contextmenu: "",
            quickbars_selection_toolbar: "bold blocks quicklink blockquote",
            quickbars_insert_toolbar: "",

            setup: function (editor: any) {
              // Add custom button for inserting image from URL
              editor.ui.registry.addButton("techloop", {
                icon: "upload",
                tooltip: "Upload Image to Techloop",
                onAction: function () {
                  const id = toast("Uploading images to Techloop...", {
                    autoClose: 15000,
                  });
                  replaceImageUrl(editor.getContent()).then((newContent) => {
                    editor.setContent(newContent);
                    toast.dismiss(id);
                    toast("Images uploaded to Techloop", {
                      type: "success",
                      hideProgressBar: true,
                    });
                  });
                },
              });

              editor.ui.registry.addButton("copyToMarkdown", {
                icon: "copy",
                tooltip: "Copy to Markdown",
                onAction: function () {
                  copyHtmlToMarkdown(editor.getContent());
                },
              });

              editor.ui.registry.addToggleButton("keepLinks", {
                icon: "unlink",
                tooltip: "Not remove links",
                onAction: (api: any) => {
                  const nextState = !api.isActive();
                  api.setActive(nextState);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("keepLinks", nextState.toString());
                  }
                },
                onSetup: (api: any) => {
                  if (typeof window !== "undefined") {
                    api.setActive(localStorage.getItem("keepLinks") === "true");
                  }
                },
              });

              editor.ui.registry.addToggleButton("showChat", {
                icon: "language",
                tooltip: "Show chat",
                onAction: (api: any) => {
                  toggleLayout();
                  api.setActive(!api.isActive());
                },
                onSetup: (api: any) => {
                  api.setActive(layout === "chat");
                },
              });

              // Custom paste handler to clean content
              editor.on("PastePreProcess", function (e: any) {
                const content = e.content;
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = content;
                cleanElement(tempDiv);
                e.content = tempDiv.innerHTML;
              });
            },
            paste_data_images: true,
            paste_as_text: false,
            paste_enable_default_filters: true,
            paste_word_valid_elements:
              "h1,h2,h3,h4,h5,h6,strong,b,img,table,thead,tbody,tr,th,td,ul,ol,li,form,input,textarea,select,option,button,label",
            paste_retain_style_properties: "",
            paste_remove_styles_if_webkit: true,
            paste_remove_styles: true,
            paste_auto_cleanup_on_paste: true,
            paste_convert_word_fake_lists: false,
            paste_use_dialog: false,
            paste_merge_formats: false,
            paste_convert_unsafe_svg: true,
            paste_webkit_styles: "",
          }}
        />
        <ToastContainer autoClose={3000} position="bottom-right" />
      </div>
    </div>
  );
};
