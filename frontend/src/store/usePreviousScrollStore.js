import { create } from "zustand";

const usePreviousScrollStore = create((set) => ({
  previousScrollPosition: 0,
  setPreviousScrollPosition: (pos) => set({ previousScrollPosition: pos }),
}));

export default usePreviousScrollStore;