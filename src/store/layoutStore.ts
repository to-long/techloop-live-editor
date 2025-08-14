"use client";

import { create } from "zustand";

type Layout = "editor" | "chat";

interface LayoutState {
  layout: Layout;
  setLayout: (layout: Layout) => void;
  toggleLayout: () => void;
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  layout:
    (typeof window !== "undefined"
      ? (localStorage.getItem("layout") as Layout)
      : null) ?? "editor",
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
