/**
 * Electron-enabled App Component
 * This version uses IPC APIs instead of mock data
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MessageStream } from './components/MessageStream';
import { RightPanel, RightPanelMode } from './components/RightPanel';
import { Message, Attachment } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { SettingsModal } from './components/SettingsModal';
import { useMessages, useTasks, useInboxOrganization } from './hooks/useStrataAPI';

const AppContent: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>('inbox');

  // Use IPC hooks
  const { tasks, loading: tasksLoading } = useTasks();
  const {
    messages,
    loading: messagesLoading,
    createMessage,
    updateMessage,
    archiveMessage,
  } = useMessages(activeProjectId === 'inbox' ? undefined : activeProjectId || undefined);

  const {
    suggestions,
    loading: organizingLoading,
    getSuggestions,
    applyOrganization,
  } = useInboxOrganization();

  // Right Panel State
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('collapsed');
  const [selectedContextMessage, setSelectedContextMessage] = useState<Message | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply suggestions to messages for UI display
  const messagesWithSuggestions = messages.map((msg) => {
    const suggestion = suggestions.find((s) => s.messageId === msg.id);
    return suggestion
      ? { ...msg, suggestedProjectId: suggestion.targetTaskId }
      : msg;
  });

  // Filter messages by search query
  const displayedMessages = searchQuery
    ? messagesWithSuggestions.filter(
        (m) =>
          m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : messagesWithSuggestions;

  const inboxCount = messages.filter((m) => !m.projectId).length;

  const handleSendMessage = async (
    content: string,
    tags: string[],
    attachments: Attachment[]
  ) => {
    try {
      // For now, attachments need to be file paths
      // TODO: Implement file picker in MessageStream
      await createMessage(content, tags, []);
    } catch (error) {
      console.error('Failed to create message:', error);
    }
  };

  const handleUpdateMessage = async (id: string, newContent: string) => {
    try {
      await updateMessage(id, newContent);
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  };

  const handleArchiveMessage = async (id: string) => {
    try {
      await archiveMessage(id);
    } catch (error) {
      console.error('Failed to archive message:', error);
    }
  };

  const handleOrganizeInbox = async () => {
    try {
      await getSuggestions();
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    }
  };

  const handleApplyOrganization = async () => {
    try {
      await applyOrganization();
    } catch (error) {
      console.error('Failed to apply organization:', error);
    }
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedContextMessage(message);
    setRightPanelMode('info');
  };

  const handleCitationClick = (id: string) => {
    setHighlightedMessageId(id);
    setTimeout(() => setHighlightedMessageId(null), 2000);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Show loading state
  if (tasksLoading || messagesLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50 dark:bg-basalt-900">
        <div className="text-xl text-stone-600 dark:text-stone-400">
          Loading Strata OS...
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex h-screen w-screen overflow-hidden bg-stone-50 dark:bg-basalt-900 transition-colors duration-300">
        {/* Sidebar */}
        <Sidebar
          tasks={tasks}
          inboxCount={inboxCount}
          activeProjectId={activeProjectId}
          onSelectProject={setActiveProjectId}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onSearch={setSearchQuery}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative min-w-0">
          <MessageStream
            messages={displayedMessages}
            projectId={activeProjectId}
            tasks={tasks}
            highlightedMessageId={highlightedMessageId}
            onSendMessage={handleSendMessage}
            onSelectMessage={handleSelectMessage}
            onUpdateMessage={handleUpdateMessage}
            onArchiveMessage={handleArchiveMessage}
            onOrganizeInbox={handleOrganizeInbox}
            onApplyOrganization={handleApplyOrganization}
            isOrganizing={organizingLoading || suggestions.length > 0}
            className="flex-1"
          />
        </main>

        {/* Right Panel (AI) */}
        <RightPanel
          mode={rightPanelMode}
          setMode={setRightPanelMode}
          contextMessage={selectedContextMessage}
          onCitationClick={handleCitationClick}
          messages={messages}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </LanguageProvider>
  );
};

export default App;
