/**
 * SessionList Component
 * Displays and manages chat sessions
 */

import React, { useState } from 'react';
import { ChatSession } from '../types';
import { MessageSquare, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface SessionListProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onSessionCreate: () => void;
  onSessionDelete: (sessionId: string) => void;
  onSessionRename: (sessionId: string, newTitle: string) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onSessionCreate,
  onSessionDelete,
  onSessionRename
}) => {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (session: ChatSession) => {
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveEdit = (sessionId: string) => {
    if (editTitle.trim()) {
      onSessionRename(sessionId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('justNow') || 'Just now';
    if (diffMins < 60) return `${diffMins}${t('minutesAgo') || 'm ago'}`;
    if (diffHours < 24) return `${diffHours}${t('hoursAgo') || 'h ago'}`;
    if (diffDays < 7) return `${diffDays}${t('daysAgo') || 'd ago'}`;

    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-700">
        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          {t('sessions') || 'Sessions'} ({sessions.length})
        </h3>
        <button
          onClick={onSessionCreate}
          className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          title={t('newSession') || 'New Session'}
        >
          <Plus size={16} className="text-stone-600 dark:text-stone-400" />
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <MessageSquare size={32} className="text-stone-400 dark:text-stone-600 mb-2" />
            <p className="text-sm text-stone-500 dark:text-stone-500">
              {t('noSessions') || 'No sessions yet'}
            </p>
            <button
              onClick={onSessionCreate}
              className="mt-3 px-3 py-1.5 text-xs rounded-lg bg-terracotta-500 text-white hover:bg-terracotta-600 transition-colors"
            >
              {t('createFirst') || 'Create First Session'}
            </button>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {sessions.map(session => (
              <div
                key={session.id}
                className={`
                  group relative rounded-lg transition-all
                  ${session.id === currentSessionId
                    ? 'bg-terracotta-50 dark:bg-terracotta-900/20 border border-terracotta-200 dark:border-terracotta-800'
                    : 'hover:bg-stone-50 dark:hover:bg-stone-800/50 border border-transparent'
                  }
                `}
              >
                <div
                  onClick={() => onSessionSelect(session.id)}
                  className="flex items-start gap-3 px-3 py-2.5 cursor-pointer"
                >
                  {/* Icon */}
                  <div className={`
                    mt-0.5 p-1.5 rounded-md flex-shrink-0
                    ${session.id === currentSessionId
                      ? 'bg-terracotta-100 dark:bg-terracotta-900/40'
                      : 'bg-stone-100 dark:bg-stone-800'
                    }
                  `}>
                    <MessageSquare size={14} className={
                      session.id === currentSessionId
                        ? 'text-terracotta-600 dark:text-terracotta-400'
                        : 'text-stone-500 dark:text-stone-500'
                    } />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {editingId === session.id ? (
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveEdit(session.id);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          className="flex-1 px-2 py-1 text-xs rounded border border-terracotta-300 dark:border-terracotta-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(session.id)}
                          className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/30"
                        >
                          <Check size={14} className="text-green-600 dark:text-green-400" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <X size={14} className="text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">
                          {session.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-stone-500 dark:text-stone-500">
                          <span>{session.messageCount || 0} {t('messages') || 'messages'}</span>
                          <span>•</span>
                          <span>{formatDate(session.lastActivity)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  {editingId !== session.id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleStartEdit(session);
                        }}
                        className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700"
                        title={t('rename') || 'Rename'}
                      >
                        <Edit2 size={12} className="text-stone-600 dark:text-stone-400" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (confirm(t('confirmDeleteSession') || 'Delete this session?')) {
                            onSessionDelete(session.id);
                          }
                        }}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                        title={t('delete') || 'Delete'}
                      >
                        <Trash2 size={12} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
