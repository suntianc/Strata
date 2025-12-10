import React, { useState } from 'react';
import { Layers, Inbox, ChevronRight, ChevronDown, Settings, Search, Circle, Disc, AlertCircle, CheckCircle2, Moon, Sun, LayoutGrid, Globe } from 'lucide-react';
import { TaskNode } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';

interface SidebarProps {
  tasks: TaskNode[];
  inboxCount: number;
  onSelectProject: (id: string | null) => void;
  activeProjectId: string | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onSearch: (query: string) => void;
  onOpenSettings: () => void;
}

const TreeNode: React.FC<{ 
  node: TaskNode; 
  level: number; 
  activeId: string | null;
  onSelect: (id: string) => void; 
}> = ({ node, level, activeId, onSelect }) => {
  const [expanded, setExpanded] = useState(node.expanded ?? true);
  const hasChildren = node.children && node.children.length > 0;
  const isActive = activeId === node.id;

  const getStatusIcon = (status: TaskNode['status']) => {
    switch (status) {
      case 'active': return <Disc size={12} className="text-teal-800 dark:text-teal-400" fill="currentColor" />;
      case 'blocked': return <AlertCircle size={12} className="text-terracotta-500" fill="currentColor" />;
      case 'completed': return <CheckCircle2 size={12} className="text-stone-400 dark:text-stone-500" />;
      default: return <Circle size={12} className="text-stone-300 dark:text-basalt-600" />;
    }
  };

  return (
    <div className="select-none relative">
      <div 
        className={`flex items-center py-1.5 px-2 cursor-pointer transition-all duration-200 text-sm border-l-[3px]
          ${isActive 
            ? 'bg-white dark:bg-basalt-800 border-terracotta-500 text-stone-900 dark:text-stone-100 font-medium shadow-sm' 
            : 'border-transparent text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-basalt-800/50 hover:text-stone-900 dark:hover:text-stone-200'}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(node.id)}
      >
        <div 
          className={`mr-2 p-0.5 rounded transition-colors ${isActive ? 'text-stone-600 dark:text-stone-300' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'}`}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {hasChildren ? (
            expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : <span className="w-[14px] inline-block" />}
        </div>
        
        <span className="mr-2 mt-0.5 opacity-80">{getStatusIcon(node.status)}</span>
        <span className="truncate">{node.title}</span>
      </div>
      
      {hasChildren && expanded && (
        <div className="relative">
          {/* Vein/Root line */}
          <div 
            className="absolute border-l border-stone-200 dark:border-basalt-800 h-full top-0 pointer-events-none" 
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

export const Sidebar: React.FC<SidebarProps> = ({ tasks, inboxCount, onSelectProject, activeProjectId, isDarkMode, toggleTheme, onSearch, onOpenSettings }) => {
  const { t, language, setLanguage } = useTranslation();
  const { settings } = useSettings();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <div className="w-[280px] h-full bg-stone-100 dark:bg-basalt-950 border-r border-stone-200 dark:border-basalt-800 flex flex-col flex-shrink-0 transition-colors duration-300 font-sans">
      {/* Header - Bedrock */}
      <div className="h-14 flex items-center px-5 border-b border-stone-200 dark:border-basalt-800 bg-stone-100 dark:bg-basalt-950">
        <div className="w-8 h-8 bg-stone-800 dark:bg-stone-200 rounded-lg flex items-center justify-center text-stone-100 dark:text-basalt-900 mr-3 shadow-sm">
          <Layers size={18} strokeWidth={2.5} />
        </div>
        <span className="text-lg font-serif font-bold text-stone-800 dark:text-stone-100 tracking-tight">STRATA</span>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative group">
          <Search className="absolute left-2.5 top-2.5 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors" size={14} />
          <input 
            type="text" 
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-white dark:bg-basalt-900 border border-stone-200 dark:border-basalt-700 rounded-md py-2 pl-9 pr-3 text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-terracotta-500 dark:focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-0 py-2 custom-scrollbar">
        {/* Inbox Section */}
        <div className="mb-8">
          <div className="px-5 text-[10px] font-bold text-stone-400 dark:text-stone-600 uppercase tracking-widest mb-3">{t('surface')}</div>
          <div 
            onClick={() => onSelectProject(null)}
            className={`flex items-center justify-between py-2 px-5 cursor-pointer transition-all border-l-[3px]
              ${activeProjectId === null 
                ? 'bg-white dark:bg-basalt-800 border-terracotta-500 text-stone-900 dark:text-stone-100 shadow-sm font-medium' 
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-basalt-800/50 hover:text-stone-900 dark:hover:text-stone-200'}
            `}
          >
            <div className="flex items-center">
              <Inbox size={16} className={activeProjectId === null ? "text-terracotta-500" : "text-stone-400"} strokeWidth={activeProjectId === null ? 2.5 : 2} />
              <span className="ml-3 text-sm">{t('inbox')}</span>
            </div>
            {inboxCount > 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center
                ${activeProjectId === null 
                  ? 'bg-terracotta-500 text-white' 
                  : 'bg-stone-200 dark:bg-basalt-800 text-stone-500 dark:text-stone-400'}
              `}>
                {inboxCount}
              </span>
            )}
          </div>
        </div>

        {/* Projects Tree */}
        <div className="mb-2">
          <div className="px-5 flex items-center justify-between mb-3 group cursor-pointer">
             <div className="text-[10px] font-bold text-stone-400 dark:text-stone-600 uppercase tracking-widest">{t('deepStrata')}</div>
             <LayoutGrid size={12} className="text-stone-300 dark:text-basalt-700 group-hover:text-stone-500 transition-colors" />
          </div>
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-basalt-800 border border-stone-300 dark:border-basalt-700 flex items-center justify-center text-stone-600 dark:text-stone-300 text-xs font-serif font-bold overflow-hidden">
              {settings.profile.avatarUrl ? (
                <img src={settings.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(settings.profile.name)
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-200 truncate max-w-[100px]">{settings.profile.name}</span>
              <span className="text-[10px] text-stone-400 truncate max-w-[100px]">{settings.profile.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
             <button onClick={toggleLanguage} className="hover:bg-stone-200 dark:hover:bg-basalt-800 rounded p-1.5 text-stone-500 dark:text-stone-400 transition-colors font-bold text-[10px] w-7 text-center">
                {language === 'en' ? 'EN' : '中'}
             </button>
             <button onClick={toggleTheme} className="hover:bg-stone-200 dark:hover:bg-basalt-800 rounded p-1.5 text-stone-500 dark:text-stone-400 transition-colors">
               {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
             </button>
             <button onClick={onOpenSettings} className="hover:bg-stone-200 dark:hover:bg-basalt-800 rounded p-1.5 text-stone-500 dark:text-stone-400 transition-colors">
               <Settings size={16} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
