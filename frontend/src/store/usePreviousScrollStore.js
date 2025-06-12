import { create } from 'zustand';

const usePreviousScrollStore = create((set) => ({
  previousScrollPosition: 0,
  setPreviousScrollPosition: (position) => set({ previousScrollPosition: position }),
  clearScrollPosition: () => set({ previousScrollPosition: 0 }),
}));

export default usePreviousScrollStore;
