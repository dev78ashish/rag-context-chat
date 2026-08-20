import { create } from 'zustand';

interface SessionState {
  sessionToken: string;
  setSessionToken: (sessionToken: string) => void;
  clearSession: () => void;
}

const useSession = create<SessionState>((set) => ({
  sessionToken: '',

  setSessionToken: (sessionToken) => set({ sessionToken }),

  clearSession: () => set({ sessionToken: '' }),
}));

export default useSession;