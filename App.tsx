import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { MessageStream } from './components/MessageStream';
import { RightPanel, RightPanelMode } from './components/RightPanel';
import { TaskNode, Message, Attachment, CopilotContext } from './types';
import { suggestTaskForMessages } from './services/geminiService';
import { generateTaskTitle } from './services/llmService';
import { LanguageProvider } from './contexts/LanguageContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { SettingsModal } from './components/SettingsModal';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { db } from './services/database.v2';
import { useKeyboardShortcuts, useShortcutHelp, ShortcutConfig } from './hooks/useKeyboardShortcuts';
import { X, Keyboard } from 'lucide-react';

// Keyboard Shortcuts Help Panel Component
const ShortcutHelpPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { formatShortcut } = useShortcutHelp();

  const shortcuts: ShortcutConfig[] = [
    { key: 'k', ctrl: true, description: 'Quick search (focus search box)', handler: () => {} },
    { key: 'n', ctrl: true, description: 'New note (focus message input)', handler: () => {} },
    { key: ',', ctrl: true, description: 'Open settings', handler: () => {} },
    { key: '/', ctrl: true, description: 'Toggle sidebar visibility', handler: () => {} },
    { key: 'b', ctrl: true, description: 'Toggle dark/light mode', handler: () => {} },
    { key: '?', shift: true, description: 'Show/hide keyboard shortcuts help', handler: () => {} },
    { key: 'Escape', description: 'Close modals and panels', handler: () => {} },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-basalt-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-basalt-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <Keyboard size={24} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">
                Keyboard Shortcuts
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Navigate Strata faster with these shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 dark:hover:bg-basalt-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-stone-50 dark:bg-basalt-900 rounded-lg hover:bg-stone-100 dark:hover:bg-basalt-800 transition-colors"
              >
                <span className="text-sm text-stone-700 dark:text-stone-300">
                  {shortcut.description}
                </span>
                <kbd className="px-3 py-1.5 bg-white dark:bg-basalt-700 border border-stone-300 dark:border-basalt-600 rounded-md text-xs font-mono font-bold text-stone-600 dark:text-stone-300 shadow-sm">
                  {formatShortcut(shortcut)}
                </kbd>
              </div>
            ))}
          </div>

          {/* Additional Tips */}
          <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
            <h3 className="text-sm font-bold text-teal-800 dark:text-teal-300 mb-2">
              💡 Pro Tips
            </h3>
            <ul className="text-xs text-teal-700 dark:text-teal-400 space-y-1">
              <li>• Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-teal-900 rounded text-[10px] font-mono">Enter</kbd> to send messages</li>
              <li>• Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-teal-900 rounded text-[10px] font-mono">Shift + Enter</kbd> for new line in message input</li>
              <li>• Drag messages to tasks to convert them</li>
              <li>• Right-click on tasks for more options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const { settings } = useSettings();

  // DnD Sensors for global drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // State with initial values
  const [tasks, setTasks] = useState<TaskNode[]>(INITIAL_TASKS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('collapsed');
  const [selectedContextMessage, setSelectedContextMessage] = useState<Message | null>(null);
  const [copilotContext, setCopilotContext] = useState<CopilotContext | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);

  // Refs for focusing elements
  const searchInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Load data from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if running in Electron mode
        const isElectron = typeof window !== 'undefined' && window.electron !== undefined;

        if (isElectron) {
          console.log('[App] 🖥️  Running in Electron mode - skipping PGlite initialization');
          console.log('[App] Using localStorage for tasks/messages (chat sessions managed via IPC)');

          // In Electron mode, load from localStorage
          const storedTasks = localStorage.getItem('strata_tasks');
          const storedMessages = localStorage.getItem('strata_messages');
          const storedActiveProject = localStorage.getItem('strata_activeProject');
          const storedDarkMode = localStorage.getItem('strata_darkMode');

          if (storedTasks) {
            const tasks = JSON.parse(storedTasks) as TaskNode[];
            console.log(`[App] Loaded ${tasks.length} tasks from localStorage`);
            setTasks(tasks);
            if (!storedActiveProject && tasks.length > 0) {
              setActiveProjectId(tasks[0].id);
            }
          }

          if (storedMessages) {
            const messages = JSON.parse(storedMessages).map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })) as Message[];
            console.log(`[App] Loaded ${messages.length} messages from localStorage`);
            setMessages(messages);
          }

          if (storedActiveProject) {
            setActiveProjectId(storedActiveProject);
          }

          if (storedDarkMode === 'true') {
            setIsDarkMode(true);
          }

          setIsLoaded(true);
          console.log('[App] ✅ Electron mode data loaded successfully');
          return;
        }

        // Browser mode: use PGlite
        console.log('[App] 🌐 Running in Browser mode - initializing PGlite...');
        await db.init();

        if (db.isDatabaseAvailable()) {
          console.log('[App] ✅ Database available, loading from PGlite...');
          console.log('[App] Running migration from localStorage...');
          await db.migrateFromLocalStorage();

          console.log('[App] Loading data from database...');
          const dbTasks = await db.getTasks();
          const dbMessages = await db.getMessages();
          const dbActiveProject = await db.getAppState('activeProject');
          const dbDarkMode = await db.getAppState('darkMode');

          if (dbTasks.length > 0) {
            console.log(`[App] Loaded ${dbTasks.length} tasks from database`);
            setTasks(dbTasks);
          }

          if (dbMessages.length > 0) {
            console.log(`[App] Loaded ${dbMessages.length} messages from database`);
            setMessages(dbMessages);
          }

          if (dbActiveProject) {
            setActiveProjectId(dbActiveProject);
          } else if (dbTasks.length > 0) {
            setActiveProjectId(dbTasks[0].id);
          }

          if (dbDarkMode) {
            setIsDarkMode(dbDarkMode === 'true');
          }
        } else {
          console.log('[App] ⚠️ Database not available, falling back to localStorage...');
          const storedTasks = localStorage.getItem('strata_tasks');
          const storedMessages = localStorage.getItem('strata_messages');
          const storedActiveProject = localStorage.getItem('strata_activeProject');
          const storedDarkMode = localStorage.getItem('strata_darkMode');

          if (storedTasks) {
            const tasks = JSON.parse(storedTasks);
            setTasks(tasks);
            console.log(`[App] Loaded ${tasks.length} tasks from localStorage`);
          }

          if (storedMessages) {
            const messages = JSON.parse(storedMessages);
            setMessages(messages);
            console.log(`[App] Loaded ${messages.length} messages from localStorage`);
          }

          if (storedActiveProject) {
            setActiveProjectId(storedActiveProject);
          }

          if (storedDarkMode) {
            setIsDarkMode(storedDarkMode === 'true');
          }
        }

        setIsLoaded(true);
        console.log('[App] ✅ Browser mode data loaded successfully');
      } catch (error) {
        console.error('[App] ❌ Failed to load data:', error);
        setIsLoaded(true); // Still mark as loaded to show UI
      }
    };
    loadData();
  }, []);

  // Save tasks to database (only after initial load)
  useEffect(() => {
    if (!isLoaded) return;

    const saveTasks = async () => {
      try {
        // Check if database is available (Electron mode with SQLite)
        if (db.isDatabaseAvailable()) {
          await db.saveTasks(tasks);
          console.log('[App] ✅ Tasks saved to database');
        } else {
          // Browser mode: save to localStorage
          localStorage.setItem('strata_tasks', JSON.stringify(tasks));
          console.log('[App] ✅ Tasks saved to localStorage');
        }
      } catch (error) {
        console.error('[App] ❌ Failed to save tasks:', error);
      }
    };
    saveTasks();
  }, [tasks, isLoaded]);

  // Save messages to database (only after initial load)
  useEffect(() => {
    if (!isLoaded) return;

    const saveMessages = async () => {
      try {
        // Check if database is available (Electron mode with SQLite)
        if (db.isDatabaseAvailable()) {
          await db.saveMessages(messages);
          console.log('[App] ✅ Messages saved to database');
        } else {
          // Browser mode: save to localStorage
          localStorage.setItem('strata_messages', JSON.stringify(messages));
          console.log('[App] ✅ Messages saved to localStorage');
        }
      } catch (error) {
        console.error('[App] ❌ Failed to save messages:', error);
      }
    };
    saveMessages();
  }, [messages, isLoaded]);

  // Save active project to database (only after initial load)
  useEffect(() => {
    if (!isLoaded) return;

    const saveActiveProject = async () => {
      try {
        // Check if database is available (Electron mode with SQLite)
        if (db.isDatabaseAvailable()) {
          if (activeProjectId) {
            await db.setAppState('activeProject', activeProjectId);
          }
        } else {
          // Browser mode: save to localStorage
          if (activeProjectId) {
            localStorage.setItem('strata_activeProject', activeProjectId);
          }
        }
      } catch (error) {
        console.error('[App] ❌ Failed to save active project:', error);
      }
    };
    saveActiveProject();
  }, [activeProjectId, isLoaded]);

  // Save dark mode to database (only after initial load)
  useEffect(() => {
    if (!isLoaded) return;

    const saveDarkMode = async () => {
      try {
        // Check if database is available (Electron mode with SQLite)
        if (db.isDatabaseAvailable()) {
          await db.setAppState('darkMode', isDarkMode.toString());
        } else {
          // Browser mode: save to localStorage
          localStorage.setItem('strata_darkMode', isDarkMode.toString());
        }
      } catch (error) {
        console.error('[App] ❌ Failed to save dark mode:', error);
      }
    };
    saveDarkMode();
  }, [isDarkMode, isLoaded]);

  // ... (rest of the component code - same as App.tsx but without database calls)
  // For brevity, I'll include just the key handlers

  const displayedMessages = messages.filter(m => {
    if (m.isArchived) return false;
    if (searchQuery) {
      return m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
             m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (activeProjectId) {
      return m.projectId === activeProjectId || (activeProjectId === 'p1' && m.projectId?.startsWith('p'));
    } else {
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
        return { ...msg, content: newContent, version: msg.version + 1 };
      }
      return msg;
    }));
  };

  const handleArchiveMessage = (id: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, isArchived: true } : msg
    ));
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleOrganizeInbox = async () => {
    setIsOrganizing(true);
    setTimeout(async () => {
      const inboxMessages = messages.filter(m => !m.projectId && !m.isArchived);
      const ids = inboxMessages.map(m => m.content);
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
        return { ...msg, projectId: msg.suggestedProjectId, suggestedProjectId: undefined };
      }
      return msg;
    }));
    setIsOrganizing(false);
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedContextMessage(message);
    setCopilotContext({
      type: 'message',
      id: message.id,
      content: message.content,
      data: message
    });
    setRightPanelMode('info');
  };

  const handleCitationClick = (id: string) => {
    setHighlightedMessageId(id);
    setTimeout(() => setHighlightedMessageId(null), 2000);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Global keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      description: 'Quick search (focus search box)',
      handler: () => {
        searchInputRef.current?.focus();
      }
    },
    {
      key: 'n',
      ctrl: true,
      description: 'New note (focus message input)',
      handler: () => {
        messageInputRef.current?.focus();
      }
    },
    {
      key: ',',
      ctrl: true,
      description: 'Open settings',
      handler: () => {
        setIsSettingsOpen(true);
      }
    },
    {
      key: '/',
      ctrl: true,
      description: 'Toggle sidebar visibility',
      handler: () => {
        setIsSidebarVisible(prev => !prev);
      }
    },
    {
      key: 'b',
      ctrl: true,
      description: 'Toggle dark/light mode',
      handler: () => {
        toggleTheme();
      }
    },
    {
      key: '?',
      shift: true,
      description: 'Show keyboard shortcuts help',
      handler: () => {
        setShowShortcutHelp(prev => !prev);
      },
      preventDefault: true
    },
    {
      key: 'Escape',
      description: 'Close modals and panels',
      handler: () => {
        if (showShortcutHelp) {
          setShowShortcutHelp(false);
        } else if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else if (rightPanelMode !== 'collapsed') {
          setRightPanelMode('collapsed');
        }
      },
      preventDefault: false
    }
  ], !isSettingsOpen && !showShortcutHelp); // Disable when modals are open

  const handleAddProject = (title: string, description?: string, attachments?: Attachment[]) => {
    const newProject: TaskNode = {
      id: `project-${Date.now()}`,
      title,
      status: 'active',
      children: []
    };

    if ((description && description.trim()) || (attachments && attachments.length > 0)) {
      const firstMessage: Message = {
        id: `msg-${Date.now()}`,
        content: description?.trim() || '(Project created with attachments)',
        timestamp: new Date(),
        version: 1,
        author: 'user',
        tags: [],
        attachments: attachments || [],
        projectId: newProject.id,
        relatedIds: []
      };
      setMessages(prev => [firstMessage, ...prev]);
    }

    setTasks(prev => [...prev, newProject]);
  };

  const handleAddTask = (parentId: string, title: string, description?: string, attachments?: Attachment[]) => {
    const newTask: TaskNode = {
      id: `task-${Date.now()}`,
      title,
      status: 'pending',
      children: []
    };

    if ((description && description.trim()) || (attachments && attachments.length > 0)) {
      const firstMessage: Message = {
        id: `msg-${Date.now()}`,
        content: description?.trim() || '(Task created with attachments)',
        timestamp: new Date(),
        version: 1,
        author: 'user',
        tags: [],
        attachments: attachments || [],
        projectId: newTask.id,
        relatedIds: []
      };
      setMessages(prev => [firstMessage, ...prev]);
    }

    const addTaskToNode = (node: TaskNode): TaskNode => {
      if (node.id === parentId) {
        return { ...node, children: [...(node.children || []), newTask] };
      }
      if (node.children) {
        return { ...node, children: node.children.map(addTaskToNode) };
      }
      return node;
    };

    setTasks(prev => prev.map(addTaskToNode));
  };

  const handleDeleteProject = (id: string) => {
    const deleteFromNode = (node: TaskNode): TaskNode | null => {
      if (node.id === id) return null;
      if (node.children) {
        return { ...node, children: node.children.map(deleteFromNode).filter(n => n !== null) as TaskNode[] };
      }
      return node;
    };

    setTasks(prev => prev.map(deleteFromNode).filter(n => n !== null) as TaskNode[]);
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
        return { ...node, children: node.children.map(updateNode) };
      }
      return node;
    };

    setTasks(prev => prev.map(updateNode));
  };

  const handleReorderTasks = (reorderedTasks: TaskNode[]) => {
    setTasks(reorderedTasks);
  };

  const handleMessageToTask = async (messageId: string, targetTaskId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    let title = message.content.trim();

    if (title.length > 30) {
      try {
        title = await generateTaskTitle(title, settings.llm);
      } catch (error) {
        console.error('[App] Title generation failed:', error);
        title = title.substring(0, 30) + '...';
      }
    }

    const newTask: TaskNode = {
      id: `task-${Date.now()}`,
      title,
      status: 'pending',
      children: []
    };

    if (message.attachments.length > 0 || message.content.length > 30) {
      const firstMessage: Message = {
        id: `msg-${Date.now()}`,
        content: message.content,
        timestamp: new Date(),
        version: 1,
        author: 'user',
        tags: message.tags,
        attachments: message.attachments,
        projectId: newTask.id,
        relatedIds: []
      };
      setMessages(prev => [firstMessage, ...prev]);
    }

    const addTaskToNode = (node: TaskNode): TaskNode => {
      if (node.id === targetTaskId) {
        return { ...node, children: [...(node.children || []), newTask], expanded: true };
      }
      if (node.children) {
        return { ...node, children: node.children.map(addTaskToNode) };
      }
      return node;
    };

    setTasks(prev => prev.map(addTaskToNode));

    setTimeout(() => {
      const element = document.querySelector(`[data-task-id="${newTask.id}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        element.classList.add('highlight-new-task');
        setTimeout(() => element.classList.remove('highlight-new-task'), 2000);
      }
    }, 300);

    handleArchiveMessage(messageId);
  };

  const handleAddMessage = (message: Message) => {
    setMessages(prev => [message, ...prev]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId.startsWith('msg-')) {
      if (activeId !== overId) {
        handleMessageToTask(activeId, overId);
      }
    } else if (activeId.startsWith('task-') || activeId.startsWith('project-')) {
      if (activeId !== overId) {
        const oldIndex = tasks.findIndex((t) => t.id === activeId);
        const newIndex = tasks.findIndex((t) => t.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = [...tasks];
          const [moved] = reordered.splice(oldIndex, 1);
          reordered.splice(newIndex, 0, moved);
          handleReorderTasks(reordered);
        }
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="flex h-screen w-screen overflow-hidden bg-stone-50 dark:bg-basalt-900 transition-colors duration-300">
          {isSidebarVisible && (
            <Sidebar
              tasks={tasks}
              messages={messages}
              inboxCount={inboxCount}
              activeProjectId={activeProjectId}
              onSelectProject={(id, task) => {
                setActiveProjectId(id);
                if (task) {
                  const isProject = task.id.startsWith('project-') || !task.id.startsWith('task-');
                  setCopilotContext({
                    type: isProject ? 'project' : 'task',
                    id: task.id,
                    title: task.title,
                    data: task
                  });
                } else {
                  setCopilotContext(null);
                }
              }}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              onSearch={setSearchQuery}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onAddProject={handleAddProject}
              onAddTask={handleAddTask}
              onAddMessage={handleAddMessage}
              onDeleteProject={handleDeleteProject}
              onUpdateProject={handleUpdateProject}
              onReorderTasks={handleReorderTasks}
              searchInputRef={searchInputRef}
            />
          )}

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
              onDeleteMessage={handleDeleteMessage}
              onOrganizeInbox={handleOrganizeInbox}
              onApplyOrganization={handleApplyOrganization}
              isOrganizing={isOrganizing}
              className="flex-1"
              messageInputRef={messageInputRef}
            />
          </main>

          <RightPanel
            mode={rightPanelMode}
            setMode={setRightPanelMode}
            contextMessage={selectedContextMessage}
            context={copilotContext}
            onCitationClick={handleCitationClick}
            messages={messages}
            tasks={tasks}
          />
        </div>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

        {/* Keyboard Shortcuts Help Panel */}
        {showShortcutHelp && <ShortcutHelpPanel onClose={() => setShowShortcutHelp(false)} />}
      </div>
    </DndContext>
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
