import React, { useState, useEffect, useRef } from 'react';
import { Layers, Inbox, ChevronRight, ChevronDown, Settings, Search, Circle, Disc, AlertCircle, CheckCircle2, Moon, Sun, LayoutGrid, Globe, Plus, X, Trash2, Edit3, Archive, GripVertical } from 'lucide-react';
import { TaskNode } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SidebarProps {
  tasks: TaskNode[];
  inboxCount: number;
  onSelectProject: (id: string | null) => void;
  activeProjectId: string | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onSearch: (query: string) => void;
  onOpenSettings: () => void;
  onAddProject: (title: string) => void;
  onAddTask: (parentId: string, title: string) => void;
  onDeleteProject: (id: string) => void;
  onUpdateProject: (id: string, updates: Partial<TaskNode>) => void;
  onReorderTasks: (reorderedTasks: TaskNode[]) => void;
}

const TreeNode: React.FC<{
  node: TaskNode;
  level: number;
  activeId: string | null;
  onSelect: (id: string) => void;
  onAddTask: (parentId: string, title: string) => void;
  onDeleteProject: (id: string) => void;
  onUpdateProject: (id: string, updates: Partial<TaskNode>) => void;
}> = ({ node, level, activeId, onSelect, onAddTask, onDeleteProject, onUpdateProject }) => {
  const [expanded, setExpanded] = useState(node.expanded ?? true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(node.title);
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

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(node.id, newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAddingTask(false);
      setExpanded(true); // Auto-expand when adding task
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskTitle('');
    }
  };

  const handleDelete = () => {
    onDeleteProject(node.id);
    setShowDeleteConfirm(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleRename = () => {
    setIsRenaming(true);
    setShowContextMenu(false);
  };

  const handleRenameSubmit = () => {
    if (renameValue.trim() && renameValue !== node.title) {
      onUpdateProject(node.id, { title: renameValue.trim() });
    }
    setIsRenaming(false);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setRenameValue(node.title);
    }
  };

  const handleChangeStatus = (status: TaskNode['status']) => {
    onUpdateProject(node.id, { status });
    setShowContextMenu(false);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu]);

  return (
    <div className="select-none relative">
      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-lg shadow-xl py-1 z-50 min-w-[180px]"
          style={{ left: `${contextMenuPos.x}px`, top: `${contextMenuPos.y}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Rename */}
          <button
            onClick={handleRename}
            className="w-full px-3 py-2 text-left text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-basalt-700 flex items-center gap-2 transition-colors"
          >
            <Edit3 size={14} />
            <span>Rename</span>
          </button>

          {/* Status submenu */}
          <div className="border-t border-stone-100 dark:border-basalt-700 my-1" />
          <div className="px-3 py-1 text-xs font-bold text-stone-400 dark:text-stone-600 uppercase">Status</div>

          <button
            onClick={() => handleChangeStatus('pending')}
            className="w-full px-3 py-2 text-left text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-basalt-700 flex items-center gap-2 transition-colors"
          >
            <Circle size={12} className="text-stone-300 dark:text-basalt-600" />
            <span>Pending</span>
            {node.status === 'pending' && <CheckCircle2 size={12} className="ml-auto text-teal-600 dark:text-teal-400" />}
          </button>

          <button
            onClick={() => handleChangeStatus('active')}
            className="w-full px-3 py-2 text-left text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-basalt-700 flex items-center gap-2 transition-colors"
          >
            <Disc size={12} className="text-teal-800 dark:text-teal-400" fill="currentColor" />
            <span>Active</span>
            {node.status === 'active' && <CheckCircle2 size={12} className="ml-auto text-teal-600 dark:text-teal-400" />}
          </button>

          <button
            onClick={() => handleChangeStatus('blocked')}
            className="w-full px-3 py-2 text-left text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-basalt-700 flex items-center gap-2 transition-colors"
          >
            <AlertCircle size={12} className="text-terracotta-500" fill="currentColor" />
            <span>Blocked</span>
            {node.status === 'blocked' && <CheckCircle2 size={12} className="ml-auto text-teal-600 dark:text-teal-400" />}
          </button>

          <button
            onClick={() => handleChangeStatus('completed')}
            className="w-full px-3 py-2 text-left text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-basalt-700 flex items-center gap-2 transition-colors"
          >
            <CheckCircle2 size={12} className="text-stone-400 dark:text-stone-500" />
            <span>Completed</span>
            {node.status === 'completed' && <CheckCircle2 size={12} className="ml-auto text-teal-600 dark:text-teal-400" />}
          </button>

          {/* Delete */}
          <div className="border-t border-stone-100 dark:border-basalt-700 my-1" />
          <button
            onClick={() => {
              setShowContextMenu(false);
              setShowDeleteConfirm(true);
            }}
            className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      )}

      <div
        className={`flex items-center py-1.5 px-2 cursor-pointer transition-all duration-200 text-sm border-l-[3px] group
          ${isActive
            ? 'bg-white dark:bg-basalt-800 border-terracotta-500 text-stone-900 dark:text-stone-100 font-medium shadow-sm'
            : 'border-transparent text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-basalt-800/50 hover:text-stone-900 dark:hover:text-stone-200'}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(node.id)}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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

        {/* Title or Rename Input */}
        {isRenaming ? (
          <input
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={handleRenameKeyDown}
            onBlur={handleRenameSubmit}
            autoFocus
            className="flex-1 bg-white dark:bg-basalt-900 border border-teal-500 dark:border-teal-400 rounded px-2 py-0.5 text-sm text-stone-800 dark:text-stone-200 outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="truncate flex-1">{node.title}</span>
        )}

        {/* Action Buttons (show on hover) */}
        {isHovered && !isRenaming && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingTask(true);
                setExpanded(true);
              }}
              className="p-1 rounded hover:bg-stone-300 dark:hover:bg-basalt-700 text-stone-500 dark:text-stone-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              title="Add subtask"
            >
              <Plus size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="p-1 rounded hover:bg-stone-300 dark:hover:bg-basalt-700 text-stone-500 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white dark:bg-basalt-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <Trash2 size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-1">
                  Delete "{node.title}"?
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  {hasChildren
                    ? 'This will also delete all subtasks. This action cannot be undone.'
                    : 'This action cannot be undone.'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-basalt-700 hover:bg-stone-200 dark:hover:bg-basalt-600 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Input */}
      {isAddingTask && (
        <div
          className="flex items-center py-1.5 px-2 bg-stone-50 dark:bg-basalt-900 border-l-[3px] border-terracotta-300"
          style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }}
        >
          <span className="w-[14px] mr-2" />
          <Circle size={12} className="text-stone-300 dark:text-basalt-600 mr-2" />
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!newTaskTitle.trim()) {
                setIsAddingTask(false);
              }
            }}
            placeholder="Enter task name..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 outline-none"
          />
          <button
            onClick={handleAddTask}
            className="ml-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
          >
            <CheckCircle2 size={14} />
          </button>
          <button
            onClick={() => {
              setIsAddingTask(false);
              setNewTaskTitle('');
            }}
            className="ml-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
          >
            <X size={14} />
          </button>
        </div>
      )}
      
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
              onAddTask={onAddTask}
              onDeleteProject={onDeleteProject}
              onUpdateProject={onUpdateProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  tasks,
  inboxCount,
  onSelectProject,
  activeProjectId,
  isDarkMode,
  toggleTheme,
  onSearch,
  onOpenSettings,
  onAddProject,
  onAddTask,
  onDeleteProject,
  onUpdateProject
}) => {
  const { t, language, setLanguage } = useTranslation();
  const { settings } = useSettings();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  const handleAddProject = () => {
    if (newProjectTitle.trim()) {
      onAddProject(newProjectTitle.trim());
      setNewProjectTitle('');
      setIsAddingProject(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddProject();
    } else if (e.key === 'Escape') {
      setIsAddingProject(false);
      setNewProjectTitle('');
    }
  };

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
          <div className="px-5 flex items-center justify-between mb-3 group">
            <div className="text-[10px] font-bold text-stone-400 dark:text-stone-600 uppercase tracking-widest">{t('deepStrata')}</div>
            <button
              onClick={() => setIsAddingProject(true)}
              className="p-1 rounded hover:bg-stone-200 dark:hover:bg-basalt-800 text-stone-400 dark:text-basalt-600 hover:text-terracotta-500 dark:hover:text-terracotta-400 transition-colors"
              title="Add project"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Add Project Input */}
          {isAddingProject && (
            <div className="px-2 mb-2">
              <div className="flex items-center py-1.5 px-2 bg-stone-50 dark:bg-basalt-900 border-l-[3px] border-terracotta-300 rounded">
                <Circle size={12} className="text-stone-300 dark:text-basalt-600 mr-2" />
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    if (!newProjectTitle.trim()) {
                      setIsAddingProject(false);
                    }
                  }}
                  placeholder="Enter project name..."
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 outline-none"
                />
                <button
                  onClick={handleAddProject}
                  className="ml-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                >
                  <CheckCircle2 size={14} />
                </button>
                <button
                  onClick={() => {
                    setIsAddingProject(false);
                    setNewProjectTitle('');
                  }}
                  className="ml-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {tasks.map(task => (
            <TreeNode
              key={task.id}
              node={task}
              level={0}
              activeId={activeProjectId}
              onSelect={onSelectProject}
              onAddTask={onAddTask}
              onDeleteProject={onDeleteProject}
              onUpdateProject={onUpdateProject}
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
