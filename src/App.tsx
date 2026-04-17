/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './components/admin/Dashboard';
import { KnowledgeBase } from './components/admin/KnowledgeBase';
import { Skills } from './components/admin/Skills';
import { Memory } from './components/admin/Memory';
import { UserManagement } from './components/admin/UserManagement';
import { Params } from './components/admin/Params';
import { LoginModal } from './components/LoginModal';
import { useStore } from './store/chatStore';

function HomeWrapper() {
  const { setCurrentSession } = useStore();
  
  useEffect(() => {
    // Entering home page clears current session selection
    // @ts-ignore - passing null is allowed in store but might need explicit type
    setCurrentSession(null);
  }, [setCurrentSession]);

  return <ChatInterface />;
}

function ChatWrapper() {
  const { sessionId } = useParams();
  const { sessions, currentSessionId, setCurrentSession } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      const sessionExists = sessions.some(s => s.id === sessionId);
      if (sessionExists) {
        if (sessionId !== currentSessionId) {
          setCurrentSession(sessionId);
        }
      } else {
        // If session in URL doesn't exist (e.g. deleted), safety redirect to home
        console.warn(`Session ${sessionId} not found. Redirecting to home.`);
        navigate('/', { replace: true });
      }
    }
  }, [sessionId, currentSessionId, sessions, setCurrentSession, navigate]);

  return <ChatInterface />;
}

export default function App() {
  const { theme, isDarkMode, fetchMockData, sessions } = useStore();

  useEffect(() => {
    fetchMockData();
  }, [fetchMockData]);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme, isDarkMode]);

  if (!useStore.getState().user && sessions.length === 0) {
    return <div className="h-screen w-screen bg-background flex items-center justify-center text-foreground">Initializing Demo...</div>;
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LoginModal />
      <Routes>
        {/* Chat Interface Routes */}
        <Route path="/" element={
          <div id="app-root-container" className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
            <Sidebar />
            <HomeWrapper />
          </div>
        } />
        
        <Route path="/chat/:sessionId" element={
          <div id="app-root-container" className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
            <Sidebar />
            <ChatWrapper />
          </div>
        } />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
          <Route path="skills" element={<Skills />} />
          <Route path="memory" element={<Memory />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="params" element={<Params />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
