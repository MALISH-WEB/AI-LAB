'use client';

import { create } from 'zustand';

interface SessionState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken })
}));
