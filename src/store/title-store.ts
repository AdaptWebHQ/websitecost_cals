import { create } from 'zustand';

interface TitleState {
  title: string | null;
  setTitle: (title: string | null) => void;
}

export const useTitleStore = create<TitleState>((set) => ({
  title: null,
  setTitle: (title) => set({ title }),
}));
