/**
 * useSession Hook
 * Manages chat sessions with persistent storage
 */

import { useState, useEffect, useCallback } from 'react';
import { sessionApi } from '../services/sessionApi';
import type { ChatSession, ChatMessage, ContextType } from '../types';

export function useSession(contextType: ContextType | null, contextId: string | null) {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load or create session when context changes
   */
  useEffect(() => {
    if (!contextType || !contextId) {
      setCurrentSession(null);
      setMessages([]);
      return;
    }

    const loadSession = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get or create session for this context
        const session = await sessionApi.getOrCreateSession(contextType, contextId);
        setCurrentSession(session);

        // Load messages for this session
        const sessionMessages = await sessionApi.getSessionMessages(session.id);
        setMessages(sessionMessages);

        // Load all sessions for this context
        const allSessions = await sessionApi.listSessions(contextType, contextId);
        setSessions(allSessions);
      } catch (err) {
        console.error('[useSession] Failed to load session:', err);
        setError(err instanceof Error ? err.message : 'Failed to load session');
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [contextType, contextId]);

  /**
   * Add a message to the current session
   */
  const addMessage = useCallback(async (
    role: 'user' | 'model',
    content: string,
    citations?: string[]
  ): Promise<ChatMessage | null> => {
    if (!currentSession) {
      console.error('[useSession] No active session');
      return null;
    }

    try {
      const message = await sessionApi.addMessage(
        currentSession.id,
        role,
        content,
        citations
      );

      // Update local state
      setMessages(prev => [...prev, message]);

      return message;
    } catch (err) {
      console.error('[useSession] Failed to add message:', err);
      setError(err instanceof Error ? err.message : 'Failed to add message');
      return null;
    }
  }, [currentSession]);

  /**
   * Switch to a different session
   */
  const switchSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const session = await sessionApi.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      setCurrentSession(session);

      const sessionMessages = await sessionApi.getSessionMessages(sessionId);
      setMessages(sessionMessages);
    } catch (err) {
      console.error('[useSession] Failed to switch session:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new session for the current context
   */
  const createNewSession = useCallback(async (title?: string) => {
    if (!contextType || !contextId) {
      console.error('[useSession] No context available');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create new session (always creates a new one)
      const session = await sessionApi.createSession(contextType, contextId, title);
      setCurrentSession(session);
      setMessages([]);

      // Reload sessions list
      const allSessions = await sessionApi.listSessions(contextType, contextId);
      setSessions(allSessions);

      return session;
    } catch (err) {
      console.error('[useSession] Failed to create session:', err);
      setError(err instanceof Error ? err.message : 'Failed to create session');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [contextType, contextId]);

  /**
   * Delete a session
   */
  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await sessionApi.deleteSession(sessionId);

      // If deleting current session, switch to another or create new
      if (currentSession?.id === sessionId) {
        const remainingSessions = sessions.filter(s => s.id !== sessionId);
        if (remainingSessions.length > 0) {
          await switchSession(remainingSessions[0].id);
        } else if (contextType && contextId) {
          await createNewSession();
        }
      }

      // Update sessions list
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error('[useSession] Failed to delete session:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete session');
    }
  }, [currentSession, sessions, contextType, contextId, switchSession, createNewSession]);

  /**
   * Clear messages in current session
   */
  const clearMessages = useCallback(async () => {
    if (!currentSession) return;

    try {
      await sessionApi.clearSessionMessages(currentSession.id);
      setMessages([]);
    } catch (err) {
      console.error('[useSession] Failed to clear messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear messages');
    }
  }, [currentSession]);

  /**
   * Update session title
   */
  const updateTitle = useCallback(async (sessionId: string, title: string) => {
    try {
      await sessionApi.updateSessionTitle(sessionId, title);

      // Update local state
      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => prev ? { ...prev, title } : null);
      }
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title } : s));
    } catch (err) {
      console.error('[useSession] Failed to update title:', err);
      setError(err instanceof Error ? err.message : 'Failed to update title');
    }
  }, [currentSession]);

  return {
    currentSession,
    sessions,
    messages,
    isLoading,
    error,
    addMessage,
    switchSession,
    createNewSession,
    deleteSession,
    clearMessages,
    updateTitle
  };
}
