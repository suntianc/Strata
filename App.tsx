import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MessageStream } from './components/MessageStream';
import { RightPanel, RightPanelMode } from './components/RightPanel';
import { TaskNode, Message, Attachment } from './types';
import { suggestTaskForMessages } from './services/geminiService';
import { LanguageProvider } from './contexts/LanguageContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { SettingsModal } from './components/SettingsModal';

// Demo Data - Keep one example to guide users
const INITIAL_TASKS: TaskNode[] = [
  {
    id: 'demo-project',
    title: '📚 Welcome to Strata - Demo Project',
    status: 'active',
    children: [
      { id: 'demo-task-1', title: 'Click here to see how tasks work', status: 'pending' },
      { id: 'demo-task-2', title: 'Right-click to see more options', status: 'pending' }
    ]
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'demo-msg-001',
    content: '👋 Welcome to Strata! This is a demo message to help you get started.\n\n**Quick Tips:**\n- Click the "+" button to create new messages\n- Use tags to organize your notes\n- Try the AI Copilot on the right panel\n- Configure your LLM in Settings (⚙️)\n\nYou can delete this message once you\'re familiar with Strata.',
    timestamp: new Date(),
    version: 1,
    author: 'user',
    tags: ['demo', 'getting-started'],
    attachments: [],
    projectId: 'demo-project',
    relatedIds: []
  }
];

const AppContent: React.FC = () => {
  // Load data from localStorage or use initial data
  const [tasks, setTasks] = useState<TaskNode[]>(() => {
    try {
      const stored = localStorage.getItem('strata_tasks');
      return stored ? JSON.parse(stored) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem('strata_messages');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Parse date strings back to Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      return INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    const stored = localStorage.getItem('strata_activeProject');
    return stored || (tasks.length > 0 ? tasks[0].id : null);
  });

  // Right Panel State
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('collapsed');
  const [selectedContextMessage, setSelectedContextMessage] = useState<Message | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('strata_darkMode');
    return stored === 'true';
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Inbox Organizing State
  const [isOrganizing, setIsOrganizing] = useState(false);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persist tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('strata_tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('[App] Failed to save tasks:', error);
    }
  }, [tasks]);

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('strata_messages', JSON.stringify(messages));
    } catch (error) {
      console.error('[App] Failed to save messages:', error);
    }
  }, [messages]);

  // Persist active project
  useEffect(() => {
    try {
      if (activeProjectId) {
        localStorage.setItem('strata_activeProject', activeProjectId);
      } else {
        localStorage.removeItem('strata_activeProject');
      }
    } catch (error) {
      console.error('[App] Failed to save active project:', error);
    }
  }, [activeProjectId]);

  // Persist dark mode
  useEffect(() => {
    try {
      localStorage.setItem('strata_darkMode', isDarkMode.toString());
    } catch (error) {
      console.error('[App] Failed to save dark mode:', error);
    }
  }, [isDarkMode]);

  // Derived state for filtering
  const displayedMessages = messages.filter(m => {
    // 1. Archive filter
    if (m.isArchived) return false;

    // 2. Search filter
    if (searchQuery) {
      return m.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
             m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 3. Project filter
    if (activeProjectId) {
      return m.projectId === activeProjectId || (activeProjectId === 'p1' && m.projectId?.startsWith('p')); 
    } else {
      // Inbox View
      return !m.projectId;
    }
  });

  const inboxCount = messages.filter(m => !m.projectId && !m.isArchived).length;

  const handleSendMessage = (content: string, tags: string[], attachments: Attachment[]) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date(),
      version: 1,
      author: 'user',
      tags,
      attachments,
      projectId: activeProjectId || undefined,
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const handleUpdateMessage = (id: string, newContent: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === id && msg.content !== newContent) {
        return {
          ...msg,
          content: newContent,
          version: msg.version + 1
        };
      }
      return msg;
    }));
  };

  const handleArchiveMessage = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, isArchived: true } : msg
    ));
  };

  const handleOrganizeInbox = async () => {
    setIsOrganizing(true);
    // Simulate AI Latency
    setTimeout(async () => {
      const inboxMessages = messages.filter(m => !m.projectId && !m.isArchived);
      const ids = inboxMessages.map(m => m.content);
      // Simulate AI suggestions
      const suggestions = await suggestTaskForMessages(ids, tasks);
      
      setMessages(prev => prev.map((msg, idx) => {
         const inboxIdx = inboxMessages.findIndex(im => im.id === msg.id);
         if (inboxIdx !== -1 && suggestions[inboxIdx.toString()]) {
           return { ...msg, suggestedProjectId: suggestions[inboxIdx.toString()] };
         }
         return msg;
      }));
    }, 1000);
  };

  const handleApplyOrganization = () => {
    setMessages(prev => prev.map(msg => {
      if (msg.suggestedProjectId) {
        return { 
          ...msg, 
          projectId: msg.suggestedProjectId, 
          suggestedProjectId: undefined 
        };
      }
      return msg;
    }));
    setIsOrganizing(false);
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedContextMessage(message);
    setRightPanelMode('info'); // Open Info Mode on select
  };

  const handleCitationClick = (id: string) => {
    setHighlightedMessageId(id);
    // Clear highlight after animation usually, but keeping it selected is fine for now
    // Or we could auto-clear after 2 seconds
    setTimeout(() => setHighlightedMessageId(null), 2000);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleAddProject = (title: string) => {
    const newProject: TaskNode = {
      id: `project-${Date.now()}`,
      title,
      status: 'active',
      children: []
    };
    setTasks(prev => [...prev, newProject]);
  };

  const handleAddTask = (parentId: string, title: string) => {
    const newTask: TaskNode = {
      id: `task-${Date.now()}`,
      title,
      status: 'pending',
      children: []
    };

    const addTaskToNode = (node: TaskNode): TaskNode => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newTask]
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(addTaskToNode)
        };
      }
      return node;
    };

    setTasks(prev => prev.map(addTaskToNode));
  };

  const handleDeleteProject = (id: string) => {
    const deleteFromNode = (node: TaskNode): TaskNode | null => {
      if (node.id === id) {
        return null; // Mark for deletion
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(deleteFromNode).filter(n => n !== null) as TaskNode[]
        };
      }
      return node;
    };

    setTasks(prev => prev.map(deleteFromNode).filter(n => n !== null) as TaskNode[]);

    // Clear selection if deleted project was active
    if (activeProjectId === id) {
      setActiveProjectId(null);
    }
  };

  const handleUpdateProject = (id: string, updates: Partial<TaskNode>) => {
    const updateNode = (node: TaskNode): TaskNode => {
      if (node.id === id) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNode)
        };
      }
      return node;
    };

    setTasks(prev => prev.map(updateNode));
  };

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
          onAddProject={handleAddProject}
          onAddTask={handleAddTask}
          onDeleteProject={handleDeleteProject}
          onUpdateProject={handleUpdateProject}
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
            isOrganizing={isOrganizing}
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
