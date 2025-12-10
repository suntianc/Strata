import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MessageStream } from './components/MessageStream';
import { RightPanel } from './components/RightPanel';
import { TaskNode, Message, Attachment } from './types';
import { suggestTaskForMessages } from './services/geminiService';

// Mock Data
const INITIAL_TASKS: TaskNode[] = [
  {
    id: 'p1',
    title: 'PhD Thesis: Neural Arch',
    status: 'active',
    children: [
      { id: 't1', title: 'Literature Review', status: 'completed' },
      { id: 't2', title: 'Exp 4: Latency Analysis', status: 'blocked' },
      { id: 't3', title: 'Drafting Chapter 3', status: 'active' },
    ]
  },
  {
    id: 'p2',
    title: 'Side Project: Strata',
    status: 'pending',
    children: [
      { id: 't4', title: 'UI Design', status: 'completed' },
      { id: 't5', title: 'Integration', status: 'pending' }
    ]
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-001',
    content: 'Reviewing the latest paper on Transformers. The attention mechanism implementation seems divergent from the standard protocol.',
    timestamp: new Date(Date.now() - 86400000),
    version: 1,
    author: 'user',
    tags: ['literature', 'transformers'],
    attachments: [{ id: 'a1', type: 'pdf', name: 'Attention_is_all_you_need.pdf', meta: '14 pages' }],
    projectId: 'p1'
  },
  {
    id: 'msg-002',
    content: 'Experimental results from run #402 show a 15% increase in throughput. Need to verify if this is due to the new caching layer.',
    timestamp: new Date(Date.now() - 3600000),
    version: 2,
    author: 'user',
    tags: ['experiment', 'data'],
    attachments: [{ id: 'a2', type: 'excel', name: 'run_402_metrics.xlsx', meta: '24KB' }],
    projectId: 'p1'
  },
  {
    id: 'msg-003',
    content: 'Need to research proper color palettes for the dark mode UI. The current basalt shades are too blue.',
    timestamp: new Date(),
    version: 1,
    author: 'user',
    tags: ['ui', 'design'],
    attachments: [],
    projectId: undefined // Inbox item
  }
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<TaskNode[]>(INITIAL_TASKS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [activeProjectId, setActiveProjectId] = useState<string | null>('p1');
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedContextMessage, setSelectedContextMessage] = useState<Message | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Inbox Organizing State
  const [isOrganizing, setIsOrganizing] = useState(false);

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
      // Logic for "Context Inheritance" - showing parent messages in child not implemented in mock completely, 
      // but simplistic view: show specific project messages.
      // Or if root project, show all children? For now strict match for demo clarity.
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
    setRightPanelOpen(true);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

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
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative min-w-0">
          <MessageStream 
            messages={displayedMessages}
            projectId={activeProjectId}
            tasks={tasks}
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
          isOpen={rightPanelOpen} 
          onClose={() => {
            setRightPanelOpen(false);
            setSelectedContextMessage(null);
          }}
          contextMessage={selectedContextMessage}
        />
      </div>
    </div>
  );
};

export default App;
