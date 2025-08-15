"use client";

import { create } from "zustand";

type Layout = "editor" | "chat";

interface LayoutState {
  layout: Layout;
  setLayout: (layout: Layout) => void;
  toggleLayout: () => void;
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  layout: "editor",
  setLayout: (layout: Layout) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("layout", layout);
    }
    set({ layout });
  },
  toggleLayout: () => {
    const currentLayout = get().layout;
    const newLayout: Layout = currentLayout === "editor" ? "chat" : "editor";
    get().setLayout(newLayout);
  },
}));

// Hydrate layout from localStorage on client
if (typeof window !== "undefined") {
  // Use a microtask to ensure zustand store is created before running
  Promise.resolve().then(() => {
    const storedLayout = localStorage.getItem("layout") as Layout | null;
    if (storedLayout === "chat") {
      useLayoutStore.getState().setLayout(storedLayout);
    }
  });
}
