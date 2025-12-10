import React, { useState } from 'react';
import { Layers, Inbox, ChevronRight, ChevronDown, Settings, Search, Circle, Disc, AlertCircle, CheckCircle2, Moon, Sun } from 'lucide-react';
import { TaskNode } from '../types';

interface SidebarProps {
  tasks: TaskNode[];
  inboxCount: number;
  onSelectProject: (id: string | null) => void;
  activeProjectId: string | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onSearch: (query: string) => void;
}

const TreeNode: React.FC<{ 
  node: TaskNode; 
  level: number; 
  activeId: string | null;
  onSelect: (id: string) => void; 
}> = ({ node, level, activeId, onSelect }) => {
  const [expanded, setExpanded] = useState(node.expanded ?? true);
  const hasChildren = node.children && node.children.length > 0;

  const getStatusIcon = (status: TaskNode['status']) => {
    switch (status) {
      case 'active': return <Disc size={12} className="text-teal-800 dark:text-teal-400" fill="currentColor" />;
      case 'blocked': return <AlertCircle size={12} className="text-terracotta-500" fill="currentColor" />;
      case 'completed': return <CheckCircle2 size={12} className="text-green-600 dark:text-green-400" />;
      default: return <Circle size={12} className="text-stone-400 dark:text-stone-600" />;
    }
  };

  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-1.5 px-2 cursor-pointer transition-colors rounded-md group text-sm
          ${activeId === node.id 
            ? 'bg-white dark:bg-basalt-800 shadow-sm text-stone-900 dark:text-stone-100 font-medium' 
            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-basalt-800/50'}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(node.id)}
      >
        <div 
          className="mr-2 p-0.5 rounded hover:bg-stone-300 dark:hover:bg-basalt-700 text-stone-400 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {hasChildren ? (
            expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : <span className="w-[14px] inline-block" />}
        </div>
        
        <span className="mr-2 mt-0.5">{getStatusIcon(node.status)}</span>
        <span className="truncate">{node.title}</span>
      </div>
      
      {hasChildren && expanded && (
        <div className="relative">
          {/* Connecting line for tree structure */}
          <div 
            className="absolute border-l border-stone-300 dark:border-basalt-700 h-full top-0" 
            style={{ left: `${level * 16 + 15}px` }}
          />
          {node.children!.map(child => (
            <TreeNode 
              key={child.id} 
              node={child} 
              level={level + 1} 
              activeId={activeId}
              onSelect={onSelect} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ tasks, inboxCount, onSelectProject, activeProjectId, isDarkMode, toggleTheme, onSearch }) => {
  return (
    <div className="w-[260px] h-full bg-stone-100 dark:bg-basalt-950 border-r border-stone-300 dark:border-basalt-800 flex flex-col flex-shrink-0 transition-colors duration-300">
      {/* Header */}
      <div className="h-14 flex items-center px-4 border-b border-stone-200 dark:border-basalt-800">
        <Layers className="text-teal-800 dark:text-teal-400 mr-2" size={20} />
        <span className="text-lg font-serif font-bold text-stone-800 dark:text-stone-100 tracking-tight">STRATA</span>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative group">
          <Search className="absolute left-2.5 top-2 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200 transition-colors" size={14} />
          <input 
            type="text" 
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search layers... (⌘K)" 
            className="w-full bg-white dark:bg-basalt-900 border border-stone-300 dark:border-basalt-700 rounded-md py-1.5 pl-8 pr-3 text-sm text-stone-700 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-teal-800 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-800/20 dark:focus:ring-teal-400/20 transition-all"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {/* Inbox Section */}
        <div className="mb-6">
          <div className="px-2 text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-2">Incoming</div>
          <div 
            onClick={() => onSelectProject(null)}
            className={`flex items-center justify-between py-2 px-3 rounded-md cursor-pointer transition-all
              ${activeProjectId === null 
                ? 'bg-white dark:bg-basalt-800 shadow-sm text-teal-900 dark:text-teal-400' 
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-basalt-800/50'}
            `}
          >
            <div className="flex items-center">
              <Inbox size={16} className={activeProjectId === null ? "text-teal-800 dark:text-teal-400" : "text-stone-500"} />
              <span className="ml-3 text-sm font-medium">Inbox</span>
            </div>
            {inboxCount > 0 && (
              <span className="bg-terracotta-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {inboxCount}
              </span>
            )}
          </div>
        </div>

        {/* Projects Tree */}
        <div className="mb-2">
          <div className="px-2 text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-2">Projects & Theses</div>
          {tasks.map(task => (
            <TreeNode 
              key={task.id} 
              node={task} 
              level={0} 
              activeId={activeProjectId}
              onSelect={onSelectProject}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-stone-200 dark:border-basalt-800 bg-stone-100 dark:bg-basalt-950">
        <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-800 dark:bg-teal-400/20 dark:text-teal-400 flex items-center justify-center text-white text-xs font-serif">DR</div>
            <span className="text-xs font-medium dark:text-stone-300">Dr. Researcher</span>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={toggleTheme} className="hover:text-stone-800 dark:hover:text-stone-100 transition-colors p-1">
               {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
             </button>
             <Settings size={16} className="hover:text-stone-800 dark:hover:text-stone-100 cursor-pointer" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] uppercase font-bold tracking-wide text-stone-400 dark:text-stone-600">System Ready</span>
        </div>
      </div>
    </div>
  );
};
