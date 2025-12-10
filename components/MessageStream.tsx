import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Message, Attachment, TaskNode } from '../types';
import { FileText, FileSpreadsheet, Paperclip, Hash, Send, Clock, MoreHorizontal, File, Wand2, Archive, Edit2, Check, X, ArrowRight, Calendar } from 'lucide-react';
import { suggestTags } from '../services/geminiService';
import { useTranslation } from '../contexts/LanguageContext';

interface MessageStreamProps {
  messages: Message[];
  projectId: string | null;
  tasks: TaskNode[];
  highlightedMessageId?: string | null;
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
    <div className="flex items-center p-2 bg-stone-100 dark:bg-basalt-900 border border-stone-200 dark:border-basalt-700 rounded text-xs group hover:border-teal-800/30 dark:hover:border-teal-400/30 transition-colors cursor-pointer">
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
  isLastInGroup: boolean;
  isHighlighted: boolean;
  onSelect: (m: Message) => void; 
  onUpdate: (id: string, content: string) => void;
  onArchive: (id: string) => void;
}> = ({ message, tasks, isOrganizing, isLastInGroup, isHighlighted, onSelect, onUpdate, onArchive }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const cardRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isHighlighted]);
  
  const findTaskTitle = (id?: string) => {
    if (!id) return '';
    const flatten = (nodes: TaskNode[]): {id: string, title: string}[] => 
       nodes.reduce((acc, n) => [...acc, {id: n.id, title: n.title}, ...(n.children ? flatten(n.children) : [])], [] as any[]);
    return flatten(tasks).find(t => t.id === id)?.title || t('unknown_project');
  };

  const handleSave = () => {
    onUpdate(message.id, editContent);
    setIsEditing(false);
  };

  return (
    <div ref={cardRef} className="relative pl-8 group">
      {/* Stratigraphic Line */}
      <div className={`absolute left-[11px] top-0 bottom-0 w-px bg-stone-200 dark:bg-basalt-700 ${isLastInGroup ? 'bg-gradient-to-b from-stone-200 to-transparent dark:from-basalt-700' : ''}`}></div>
      
      {/* Node Marker */}
      <div className={`absolute left-[3px] top-4 w-[17px] h-[17px] rounded-full border-2 z-10 flex items-center justify-center transition-colors duration-500
        ${message.author === 'user' 
          ? 'bg-stone-50 dark:bg-basalt-900 border-stone-300 dark:border-basalt-600' 
          : 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800'}
        ${isHighlighted ? 'ring-2 ring-terracotta-500 ring-offset-2 dark:ring-offset-basalt-900 border-terracotta-500' : ''}
      `}>
        <div className={`w-1.5 h-1.5 rounded-full ${message.author === 'user' ? 'bg-stone-400 dark:bg-stone-500' : 'bg-teal-600 dark:bg-teal-400'}`}></div>
      </div>

      {/* Card Body - Designed to look like a sediment layer */}
      <div 
        onClick={() => !isEditing && onSelect(message)}
        className={`
           relative mb-3 transition-all duration-300
           bg-white dark:bg-basalt-800 
           border rounded-lg 
           ${isOrganizing && message.suggestedProjectId 
             ? 'border-teal-500 dark:border-teal-400 ring-1 ring-teal-500/20' 
             : isHighlighted
                ? 'border-terracotta-500 shadow-[0_0_15px_-3px_rgba(225,112,85,0.3)] dark:shadow-[0_0_15px_-3px_rgba(225,112,85,0.2)]'
                : 'border-stone-200 dark:border-basalt-700 hover:border-stone-300 dark:hover:border-basalt-600'}
           ${!isEditing ? 'hover:shadow-md hover:-translate-y-[1px]' : ''}
        `}
      >
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1 font-mono">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {message.version > 1 && (
                <span className="text-[9px] text-stone-400 bg-stone-100 dark:bg-basalt-700 px-1 rounded">v{message.version}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!isEditing && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="p-1.5 hover:bg-stone-100 dark:hover:bg-basalt-700 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onArchive(message.id); }} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-stone-400 hover:text-red-500 transition-colors">
                    <Archive size={12} />
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="mb-2">
              <textarea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-stone-50 dark:bg-basalt-900 border border-stone-300 dark:border-basalt-600 rounded p-3 text-sm font-serif text-stone-800 dark:text-stone-200 focus:outline-none focus:border-teal-800 focus:ring-1 focus:ring-teal-800/10"
                rows={3}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); }} className="px-2 py-1 text-xs text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200">{t('cancel')}</button>
                <button onClick={(e) => { e.stopPropagation(); handleSave(); }} className="px-3 py-1 text-xs bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 rounded hover:opacity-90">{t('save_layer')}</button>
              </div>
            </div>
          ) : (
            <div className="font-serif text-stone-800 dark:text-stone-200 text-sm leading-relaxed whitespace-pre-wrap selection:bg-terracotta-100 dark:selection:bg-terracotta-900/30">
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

          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
            {message.tags.map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-basalt-900 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-basalt-700 hover:border-stone-300 transition-colors cursor-default">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Organization Suggestion Overlay */}
        {isOrganizing && message.suggestedProjectId && (
          <div className="absolute inset-x-0 -bottom-3 flex justify-center z-20 pointer-events-none">
            <div className="bg-white dark:bg-basalt-800 border border-teal-200 dark:border-teal-800 rounded-full shadow-lg py-1 px-3 flex items-center gap-2 animate-in slide-in-from-top-1 pointer-events-auto">
               <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-wide font-bold">{t('move_to')}</span>
               <div className="flex items-center gap-1 text-teal-700 dark:text-teal-400 text-xs font-bold">
                 {findTaskTitle(message.suggestedProjectId)}
                 <ArrowRight size={10} />
               </div>
            </div>
          </div>
        )}

        {/* Hover Action */}
        {!isEditing && !isOrganizing && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Placeholder for future actions if needed */}
          </div>
        )}
      </div>
    </div>
  );
};

const DateLayerHeader: React.FC<{ date: string }> = ({ date }) => (
  <div className="relative pl-8 py-4">
    <div className="absolute left-[11px] top-0 bottom-0 w-px bg-stone-200 dark:bg-basalt-700"></div>
    <div className="flex items-center gap-3">
      <div className="w-[6px] h-[6px] rounded-full bg-stone-300 dark:bg-basalt-600 -ml-[2px] z-10"></div>
      <span className="text-xs font-bold tracking-wider text-stone-400 dark:text-stone-500 uppercase flex items-center gap-2">
        <Calendar size={10} />
        {date}
      </span>
      <div className="h-px flex-1 bg-stone-100 dark:bg-basalt-800"></div>
    </div>
  </div>
);

export const MessageStream: React.FC<MessageStreamProps> = ({ 
  messages, 
  projectId, 
  tasks,
  highlightedMessageId,
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
  const { t, language } = useTranslation();

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

  // Group messages by date (Strata layers)
  const groupedMessages = useMemo(() => {
    const groups: { date: string; msgs: Message[] }[] = [];
    
    messages.forEach(msg => {
      const locale = language === 'zh' ? 'zh-CN' : 'en-US';
      const dateKey = msg.timestamp.toLocaleDateString(locale, { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.date === dateKey) {
        lastGroup.msgs.push(msg);
      } else {
        groups.push({ date: dateKey, msgs: [msg] });
      }
    });
    
    return groups;
  }, [messages, language]);

  return (
    <div className={`flex flex-col h-full bg-stone-50 dark:bg-basalt-900 transition-colors duration-300 ${className}`}>
      {/* Top Bar - "Surface Level" */}
      <div className="h-14 border-b border-stone-200 dark:border-basalt-800 bg-stone-50/80 dark:bg-basalt-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 transition-colors">
        <div className="flex items-center gap-2 text-sm">
           <span className="font-bold text-stone-800 dark:text-stone-200 tracking-tight">
             {projectId ? t('projectStrata') : t('incomingSediment')}
           </span>
           {projectId && (
             <>
              <span className="text-stone-300 dark:text-basalt-600">/</span>
              <span className="text-stone-500 dark:text-stone-400 truncate max-w-[200px]">{t('activeLayer')}</span>
             </>
           )}
        </div>
        <div className="flex items-center gap-3">
           {!projectId && messages.length > 0 && (
             isOrganizing ? (
               <div className="flex items-center gap-2 animate-in fade-in">
                 <button onClick={onApplyOrganization} className="flex items-center gap-1.5 text-xs bg-teal-800 text-white px-4 py-1.5 rounded-md hover:bg-teal-700 transition-all shadow-sm font-medium">
                   <Check size={14} /> {t('confirmMoves')}
                 </button>
               </div>
             ) : (
                <button onClick={onOrganizeInbox} className="group flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 bg-white dark:bg-basalt-800 px-3 py-1.5 rounded-md hover:text-teal-800 dark:hover:text-teal-400 hover:border-teal-200 dark:hover:border-teal-700 border border-stone-200 dark:border-basalt-700 transition-all shadow-sm">
                   <Wand2 size={14} className="group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                   <span>{t('organize')}</span>
                </button>
             )
           )}
           <div className="h-4 w-px bg-stone-300 dark:bg-basalt-700"></div>
           <div className="flex gap-1">
             <button className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-md hover:bg-stone-100 dark:hover:bg-basalt-800 transition-colors"><Calendar size={16} /></button>
             <button className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-md hover:bg-stone-100 dark:hover:bg-basalt-800 transition-colors"><MoreHorizontal size={16} /></button>
           </div>
        </div>
      </div>

      {/* Scrollable Content - "The Core Sample" */}
      <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth custom-scrollbar">
        
        {/* Deposit Box (Input) */}
        <div className={`mb-10 transition-all duration-300 ${isComposing ? 'shadow-lg ring-1 ring-stone-200 dark:ring-basalt-700' : 'shadow-sm hover:shadow-md'} bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-xl overflow-hidden`}>
           <div className="p-4">
             <textarea
               ref={textareaRef}
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               onFocus={() => setIsComposing(true)}
               onBlur={() => !inputText && setIsComposing(false)}
               placeholder={t('depositPlaceholder')}
               className="w-full resize-none outline-none text-sm font-serif text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 min-h-[24px] bg-transparent leading-relaxed"
               rows={1}
             />
           </div>
           
           {isComposing && (
             <div className="bg-stone-50 dark:bg-basalt-900/50 px-3 py-2 border-t border-stone-100 dark:border-basalt-700 flex justify-between items-center animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-2">
                   <button className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-basalt-800 rounded transition-colors"><Paperclip size={16} /></button>
                   <button className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-basalt-800 rounded transition-colors"><Hash size={16} /></button>
                </div>
                <button 
                  onClick={handleSend}
                  className="bg-stone-800 hover:bg-stone-900 dark:bg-stone-200 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-2 transition-all shadow-sm"
                >
                  <span>{t('deposit')}</span>
                  <Send size={12} />
                </button>
             </div>
           )}
        </div>

        {/* The Layers */}
        <div className="pb-10 min-h-[300px]">
           {messages.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-stone-400 dark:text-stone-600">
               <div className="w-16 h-16 border-2 border-dashed border-stone-200 dark:border-basalt-700 rounded-full flex items-center justify-center mb-4">
                 <Calendar size={24} className="opacity-50" />
               </div>
               <p className="text-sm font-serif italic">{t('noLayers')}</p>
               <p className="text-xs mt-1">{t('startDepositing')}</p>
             </div>
           ) : (
             groupedMessages.map((group, groupIndex) => (
               <div key={group.date} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${groupIndex * 100}ms` }}>
                 <DateLayerHeader date={group.date} />
                 {group.msgs.map((msg, idx) => (
                   <MessageCard 
                     key={msg.id} 
                     message={msg} 
                     tasks={tasks}
                     isOrganizing={isOrganizing}
                     isLastInGroup={idx === group.msgs.length - 1}
                     isHighlighted={msg.id === highlightedMessageId}
                     onSelect={onSelectMessage}
                     onUpdate={onUpdateMessage}
                     onArchive={onArchiveMessage}
                   />
                 ))}
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};