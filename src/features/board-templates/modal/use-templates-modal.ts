import { create } from "zustand";

interface TemplatesModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useTemplatesModal = create<TemplatesModalStore>((set) => ({
  isOpen: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
