/**
 * React Hook for Strata API
 * Provides typed access to Electron IPC APIs
 */

import { useCallback, useEffect, useState } from 'react';
import type { Message, TaskNode } from '../types';
import type { IStrataAPI, InboxSuggestion } from '../electron/types/ipc';

// Safe API accessor with fallback for development
function getAPI(): IStrataAPI | null {
  if (typeof window !== 'undefined' && 'strataAPI' in window) {
    return window.strataAPI;
  }
  return null;
}

/**
 * Hook for message operations
 */
export function useMessages(taskId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    const api = getAPI();
    if (!api) {
      setError('API not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.getMessages(taskId);
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const createMessage = useCallback(
    async (content: string, tags: string[], files?: string[]) => {
      const api = getAPI();
      if (!api) throw new Error('API not available');

      const newMessage = await api.createMessage({
        content,
        tags,
        files,
        taskId,
      });

      setMessages((prev) => [newMessage, ...prev]);
      return newMessage;
    },
    [taskId]
  );

  const updateMessage = useCallback(async (id: string, content: string) => {
    const api = getAPI();
    if (!api) throw new Error('API not available');

    const updatedMessage = await api.updateMessage({ id, content });
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? updatedMessage : msg))
    );
  }, []);

  const archiveMessage = useCallback(async (id: string) => {
    const api = getAPI();
    if (!api) throw new Error('API not available');

    await api.archiveMessage(id);
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  return {
    messages,
    loading,
    error,
    createMessage,
    updateMessage,
    archiveMessage,
    refresh: loadMessages,
  };
}

/**
 * Hook for task operations
 */
export function useTasks() {
  const [tasks, setTasks] = useState<TaskNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    const api = getAPI();
    if (!api) {
      setError('API not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = useCallback(
    async (title: string, description?: string, parentId?: string) => {
      const api = getAPI();
      if (!api) throw new Error('API not available');

      const newTask = await api.createTask({
        title,
        description,
        parentId,
      });

      await loadTasks(); // Reload to get proper tree structure
      return newTask;
    },
    [loadTasks]
  );

  const updateTaskStatus = useCallback(
    async (id: string, status: TaskNode['status']) => {
      const api = getAPI();
      if (!api) throw new Error('API not available');

      await api.updateTaskStatus(id, status);
      await loadTasks();
    },
    [loadTasks]
  );

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTaskStatus,
    refresh: loadTasks,
  };
}

/**
 * Hook for AI chat
 */
export function useChat() {
  const [isStreaming, setIsStreaming] = useState(false);

  const chat = useCallback(
    async (
      query: string,
      context: { taskId?: string; fileIds?: string[] },
      onToken: (token: string) => void
    ) => {
      const api = getAPI();
      if (!api) throw new Error('API not available');

      setIsStreaming(true);
      try {
        await api.chat(query, context, onToken);
      } finally {
        setIsStreaming(false);
      }
    },
    []
  );

  return { chat, isStreaming };
}

/**
 * Hook for inbox organization
 */
export function useInboxOrganization() {
  const [suggestions, setSuggestions] = useState<InboxSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = useCallback(async () => {
    const api = getAPI();
    if (!api) throw new Error('API not available');

    setLoading(true);
    try {
      const data = await api.getInboxSuggestions();
      setSuggestions(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyOrganization = useCallback(async () => {
    const api = getAPI();
    if (!api) throw new Error('API not available');

    for (const suggestion of suggestions) {
      await api.moveMessage({
        messageId: suggestion.messageId,
        targetTaskId: suggestion.targetTaskId,
      });
    }

    setSuggestions([]);
  }, [suggestions]);

  return {
    suggestions,
    loading,
    getSuggestions,
    applyOrganization,
  };
}

/**
 * Hook for search
 */
export function useSearch() {
  const [results, setResults] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string, taskId?: string) => {
    const api = getAPI();
    if (!api) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = await api.searchMessages(query, { taskId });
      setResults(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, search };
}
