import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThinkingLevel } from '@google/genai';

const THEMES = [
  'default', 'technical', 'editorial', 'brutalist',
  'glass', 'hardware', 'organic', 'minimal',
  'terminal', 'luxury'
];
export { THEMES };

export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

export type StoreState = {
  user: User | null;
  theme: string;
  isDarkMode: boolean;
  model: string;
  thinkingLevel: ThinkingLevel;
  sessions: ChatSession[];
  currentSessionId: string | null;
  isSidebarOpen: boolean;
  isLoginModalOpen: boolean;
  
  // Actions
  setTheme: (theme: string) => void;
  toggleDarkMode: () => void;
  setModel: (model: string) => void;
  setThinkingLevel: (level: ThinkingLevel) => void;
  setUser: (user: User | null) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setLoginModalOpen: (isOpen: boolean) => void;
  
  // Chat Actions
  createNewSession: () => void;
  setCurrentSession: (id: string) => void;
  addMessageToCurrent: (message: Omit<Message, 'id'>) => void;
  updateLastMessage: (content: string) => void;
  deleteSession: (id: string) => void;
  
  // Fake backend fetch
  fetchMockData: () => Promise<void>;
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: { id: 'demo1', name: '张小明', avatar: '' },
      theme: 'default',
      isDarkMode: false,
      model: 'qwen-max',
      thinkingLevel: ThinkingLevel.LOW,
      sessions: [],
      currentSessionId: null,
      isSidebarOpen: true,
      isLoginModalOpen: false,

      setTheme: (theme) => set({ theme }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setModel: (model) => set({ model }),
      setThinkingLevel: (thinkingLevel) => set({ thinkingLevel }),
      setUser: (user) => set({ user }),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      setLoginModalOpen: (isOpen) => set({ isLoginModalOpen: isOpen }),

      createNewSession: () => {
        const newSession: ChatSession = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: 'New Chat',
          messages: [],
          updatedAt: Date.now()
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id
        }));
      },

      setCurrentSession: (id) => set({ currentSessionId: id }),

      addMessageToCurrent: (message) => set((state) => {
        const { currentSessionId, sessions } = state;
        if (!currentSessionId) return state;

        const newMessage: Message = { ...message, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
        const updatedSessions = sessions.map(session => {
          if (session.id === currentSessionId) {
            let newTitle = session.title;
            if (session.messages.length === 0 && message.role === 'user') {
              newTitle = message.content.substring(0, 24) + (message.content.length > 24 ? '...' : '');
            }

            return {
              ...session,
              title: newTitle,
              messages: [...session.messages, newMessage],
              updatedAt: Date.now()
            };
          }
          return session;
        }).sort((a, b) => b.updatedAt - a.updatedAt);

        return { sessions: updatedSessions };
      }),

      updateLastMessage: (content) => set((state) => {
        const { currentSessionId, sessions } = state;
        if (!currentSessionId) return state;

        const updatedSessions = sessions.map(session => {
          if (session.id === currentSessionId) {
            const _messages = [...session.messages];
            if (_messages.length > 0) {
              _messages[_messages.length - 1].content += content;
            }
            return { ...session, messages: _messages, updatedAt: Date.now() };
          }
          return session;
        });

        return { sessions: updatedSessions };
      }),

      deleteSession: (id) => set((state) => {
        const newSessions = state.sessions.filter(s => s.id !== id);
        let newCurrent = state.currentSessionId;
        if (newCurrent === id) {
          newCurrent = null; // Always back to home on delete current
        }
        return { sessions: newSessions, currentSessionId: newCurrent };
      }),

      fetchMockData: async () => {
        // Now mostly handled by persist, but can sync user if needed
      }
    }),
    {
      name: 'kiko-chat-storage', // localStorage key
    }
  )
);
