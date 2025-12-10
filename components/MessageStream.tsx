import React, { useState, useRef, useEffect } from 'react';
import { Message, Attachment, TaskNode } from '../types';
import { FileText, FileSpreadsheet, Paperclip, Hash, Send, Clock, MoreHorizontal, File, Wand2, Archive, Edit2, Check, X, ArrowRight } from 'lucide-react';
import { suggestTags } from '../services/geminiService';

interface MessageStreamProps {
  messages: Message[];
  projectId: string | null;
  tasks: TaskNode[];
  onSendMessage: (content: string, tags: string[], attachments: Attachment[]) => void;
  onSelectMessage: (message: Message) => void;
  onUpdateMessage: (id: string, newContent: string) => void;
  onArchiveMessage: (id: string) => void;
  onOrganizeInbox: () => void;
  onApplyOrganization: () => void;
  isOrganizing: boolean;
  className?: string;
}

const AttachmentCard: React.FC<{ att: Attachment }> = ({ att }) => {
  const isPdf = att.type === 'pdf';
  const isExcel = att.type === 'excel';
  
  return (
    <div className="flex items-center p-2 bg-stone-50 dark:bg-basalt-900 border border-stone-200 dark:border-basalt-700 rounded text-xs group hover:border-teal-800/30 dark:hover:border-teal-400/30 transition-colors cursor-pointer">
      <div className={`p-1.5 rounded mr-2 ${isPdf ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : isExcel ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-stone-200 dark:bg-basalt-700 text-stone-600 dark:text-stone-400'}`}>
        {isPdf ? <FileText size={14} /> : isExcel ? <FileSpreadsheet size={14} /> : <File size={14} />}
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="font-medium text-stone-700 dark:text-stone-200 truncate">{att.name}</span>
        {att.meta && <span className="text-stone-400 text-[10px]">{att.meta}</span>}
      </div>
    </div>
  );
};

const MessageCard: React.FC<{ 
  message: Message; 
  tasks: TaskNode[];
  isOrganizing: boolean;
  onSelect: (m: Message) => void; 
  onUpdate: (id: string, content: string) => void;
  onArchive: (id: string) => void;
}> = ({ message, tasks, isOrganizing, onSelect, onUpdate, onArchive }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  
  // Flatten tasks to find suggested project title if any
  const findTaskTitle = (id?: string) => {
    if (!id) return '';
    const flatten = (nodes: TaskNode[]): {id: string, title: string}[] => 
       nodes.reduce((acc, n) => [...acc, {id: n.id, title: n.title}, ...(n.children ? flatten(n.children) : [])], [] as any[]);
    return flatten(tasks).find(t => t.id === id)?.title || 'Unknown Project';
  };

  const handleSave = () => {
    onUpdate(message.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="relative pl-8 pb-8 group">
      {/* Timeline Line */}
      <div className="absolute left-[11px] top-3 bottom-0 w-px bg-stone-200 dark:bg-basalt-700 group-last:bottom-auto group-last:h-full"></div>
      
      {/* Timeline Node */}
      <div className="absolute left-0 top-3 w-[23px] h-[23px] bg-stone-50 dark:bg-basalt-900 border border-stone-300 dark:border-basalt-600 rounded-full flex items-center justify-center z-10 text-[10px] font-mono text-stone-500 dark:text-stone-400 shadow-sm">
        {message.author === 'user' ? 'U' : 'AI'}
      </div>

      {/* Card Content */}
      <div 
        onClick={() => !isEditing && onSelect(message)}
        className={`
           relative bg-white dark:bg-basalt-800 border rounded-lg p-4 transition-all
           ${isOrganizing && message.suggestedProjectId ? 'border-teal-500 dark:border-teal-400 ring-1 ring-teal-500/20' : 'border-stone-200 dark:border-basalt-700 hover:border-teal-800/30 dark:hover:border-teal-400/30 hover:shadow-sm'}
        `}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-400 dark:text-stone-500">#{message.id.slice(-4)}</span>
            <span className="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1">
              <Clock size={10} />
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isEditing && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="p-1 hover:bg-stone-100 dark:hover:bg-basalt-700 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-300">
                  <Edit2 size={12} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onArchive(message.id); }} className="p-1 hover:bg-stone-100 dark:hover:bg-basalt-700 rounded text-stone-400 hover:text-red-500">
                  <Archive size={12} />
                </button>
              </>
            )}
             {message.version > 1 && (
               <span className="px-1.5 py-0.5 bg-stone-100 dark:bg-basalt-900 text-stone-500 dark:text-stone-400 text-[10px] font-bold rounded border border-stone-200 dark:border-basalt-700">
                 v{message.version}
               </span>
             )}
          </div>
        </div>

        {isEditing ? (
          <div className="mb-3">
            <textarea 
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-stone-50 dark:bg-basalt-900 border border-stone-300 dark:border-basalt-600 rounded p-2 text-sm font-serif text-stone-800 dark:text-stone-200 focus:outline-none focus:border-teal-800"
              rows={3}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); }} className="p-1 text-stone-400 hover:text-stone-600"><X size={14}/></button>
              <button onClick={(e) => { e.stopPropagation(); handleSave(); }} className="p-1 text-teal-700 hover:text-teal-900"><Check size={14}/></button>
            </div>
          </div>
        ) : (
          <div className="font-serif text-stone-800 dark:text-stone-200 text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        )}

        {message.attachments.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {message.attachments.map(att => (
              <AttachmentCard key={att.id} att={att} />
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5 items-center justify-between">
          <div className="flex gap-1.5">
            {message.tags.map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-basalt-900 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-basalt-700 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Organization Suggestion Bubble */}
        {isOrganizing && message.suggestedProjectId && (
          <div className="absolute -bottom-3 left-8 right-8 bg-white dark:bg-basalt-800 border border-teal-200 dark:border-teal-800 rounded-full shadow-md py-1 px-3 flex items-center justify-center gap-2 animate-in slide-in-from-top-2 z-20">
             <span className="text-[10px] text-stone-500 dark:text-stone-400">Suggested Move:</span>
             <div className="flex items-center gap-1 text-teal-700 dark:text-teal-400 text-xs font-bold">
               <ArrowRight size={10} />
               {findTaskTitle(message.suggestedProjectId)}
             </div>
          </div>
        )}

        {/* Action Button - Shows on hover */}
        {!isEditing && !isOrganizing && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button className="flex items-center gap-1 text-[10px] bg-terracotta-500 text-white px-2 py-1 rounded shadow-sm hover:bg-terracotta-600">
               <Wand2 size={10} /> Analyze
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const MessageStream: React.FC<MessageStreamProps> = ({ 
  messages, 
  projectId, 
  tasks,
  onSendMessage, 
  onSelectMessage, 
  onUpdateMessage,
  onArchiveMessage,
  onOrganizeInbox,
  onApplyOrganization,
  isOrganizing,
  className 
}) => {
  const [inputText, setInputText] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const tags = await suggestTags(inputText);
    onSendMessage(inputText, tags, []); 
    setInputText('');
    setIsComposing(false);
  };

  return (
    <div className={`flex flex-col h-full bg-stone-50 dark:bg-basalt-900 transition-colors duration-300 ${className}`}>
      {/* Top Bar */}
      <div className="h-14 border-b border-stone-300 dark:border-basalt-800 bg-stone-50/90 dark:bg-basalt-900/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 transition-colors">
        <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
           <span className="font-medium text-stone-800 dark:text-stone-200">{projectId ? 'Project View' : 'Inbox'}</span>
           {projectId && (
             <>
              <span className="text-stone-300 dark:text-basalt-700">/</span>
              <span className="truncate max-w-[200px]">Active Layer</span>
             </>
           )}
        </div>
        <div className="flex items-center gap-2">
           {!projectId && messages.length > 0 && (
             isOrganizing ? (
               <div className="flex items-center gap-2 animate-in fade-in">
                 <button onClick={onApplyOrganization} className="flex items-center gap-1 text-xs bg-teal-800 text-white px-3 py-1.5 rounded-full hover:bg-teal-700 transition-colors shadow-sm">
                   <Check size={12} /> Confirm Moves
                 </button>
               </div>
             ) : (
                <button onClick={onOrganizeInbox} className="flex items-center gap-1 text-xs font-medium text-teal-800 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5 rounded-full hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors border border-teal-200 dark:border-teal-800">
                   <Wand2 size={12} /> AI Organize
                </button>
             )
           )}
           <div className="h-4 w-px bg-stone-300 dark:bg-basalt-700 mx-1"></div>
           <button className="text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-teal-800 dark:hover:text-teal-400 px-2 py-1 transition-colors">Timeline</button>
           <button className="text-xs font-medium text-stone-400 dark:text-stone-500 hover:text-teal-800 dark:hover:text-teal-400 px-2 py-1 transition-colors">Docs</button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
        
        {/* Capture Box */}
        <div className={`mb-8 transition-all duration-300 ${isComposing ? 'shadow-md scale-[1.01]' : 'shadow-sm'} bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-lg overflow-hidden ring-offset-2 dark:ring-offset-basalt-900`}>
           <div className="p-4">
             <textarea
               ref={textareaRef}
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               onFocus={() => setIsComposing(true)}
               onBlur={() => !inputText && setIsComposing(false)}
               placeholder="Log a thought, observation, or drag files here..."
               className="w-full resize-none outline-none text-sm font-serif text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 min-h-[40px] bg-transparent"
               rows={1}
             />
           </div>
           
           {isComposing && (
             <div className="bg-stone-50 dark:bg-basalt-900/50 px-3 py-2 border-t border-stone-100 dark:border-basalt-700 flex justify-between items-center animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-3">
                   <button className="text-stone-400 hover:text-teal-800 dark:hover:text-teal-400 transition-colors"><Paperclip size={16} /></button>
                   <button className="text-stone-400 hover:text-teal-800 dark:hover:text-teal-400 transition-colors"><Hash size={16} /></button>
                </div>
                <button 
                  onClick={handleSend}
                  className="bg-teal-800 hover:bg-teal-900 dark:bg-teal-800 dark:hover:bg-teal-700 text-white rounded p-1.5 transition-colors shadow-sm"
                >
                  <Send size={14} />
                </button>
             </div>
           )}
        </div>

        {/* The Stream */}
        <div className="pl-2">
           {messages.length === 0 ? (
             <div className="text-center py-20 text-stone-400 dark:text-stone-600 text-sm italic font-serif">
               No sedimentary layers found here yet. Start depositing knowledge.
             </div>
           ) : (
             messages.map(msg => (
               <MessageCard 
                 key={msg.id} 
                 message={msg} 
                 tasks={tasks}
                 isOrganizing={isOrganizing}
                 onSelect={onSelectMessage}
                 onUpdate={onUpdateMessage}
                 onArchive={onArchiveMessage}
               />
             ))
           )}
        </div>
      </div>
    </div>
  );
};
