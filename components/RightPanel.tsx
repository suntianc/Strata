import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatMessage, CopilotContext, TaskNode } from '../types';
import { Bot, X, Sparkles, Send, BookOpen, Microscope, PanelRightClose, PanelRightOpen, ArrowRight, Clock, Hash, Layers, FileText, MessageSquare } from 'lucide-react';
import { LLMService } from '../services/llmService';
import { useTranslation } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import { useSession } from '../hooks/useSession';
import { SessionList } from './SessionList';

export type RightPanelMode = 'collapsed' | 'info' | 'chat';

interface RightPanelProps {
  mode: RightPanelMode;
  setMode: (mode: RightPanelMode) => void;
  contextMessage: Message | null; // Legacy: for Info mode
  context: CopilotContext | null; // 🔥 New: Unified context for Chat mode
  onCitationClick: (messageId: string) => void;
  messages: Message[]; // For resolving related messages in Info Mode
}

const AIMessage: React.FC<{ content: string; onCitationClick: (id: string) => void }> = ({ content, onCitationClick }) => {
  // Simple parser for [Ref: id]
  const parts = content.split(/(\[Ref:\s*[^\]]+\])/g);
  const { t } = useTranslation();

  return (
    <div className="flex gap-4 max-w-full group">
      {/* Report Style: Red Line */}
      <div className="w-1 bg-terracotta-500 self-stretch flex-shrink-0 rounded-full"></div>

      <div className="flex-1 space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-terracotta-500 font-bold mb-1 opacity-80 group-hover:opacity-100 transition-opacity">{t('analysisResult')}</div>
        <div className="text-sm text-stone-700 dark:text-stone-300 font-serif leading-7 whitespace-pre-wrap">
          {parts.map((part, index) => {
            const match = part.match(/\[Ref:\s*([^\]]+)\]/);
            if (match) {
              const id = match[1];
              return (
                <button
                  key={index}
                  onClick={() => onCitationClick(id)}
                  className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-md bg-terracotta-100 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-300 text-xs font-sans font-medium hover:bg-terracotta-200 dark:hover:bg-terracotta-900/50 transition-colors cursor-pointer align-baseline"
                >
                  <BookOpen size={10} />
                  <span>{t('ref')}</span>
                </button>
              );
            }
            return part;
          })}
        </div>
      </div>
    </div>
  );
};

export const RightPanel: React.FC<RightPanelProps> = ({ mode, setMode, contextMessage, context, onCitationClick, messages }) => {
  const { t, language } = useTranslation();
  const { settings } = useSettings();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSessionList, setShowSessionList] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🔥 Use session management hook
  const {
    currentSession,
    sessions,
    messages: sessionMessages,
    isLoading: sessionLoading,
    error: sessionError,
    addMessage,
    switchSession,
    createNewSession,
    deleteSession,
    updateTitle
  } = useSession(context?.type || null, context?.id || null);

  const isOpen = mode !== 'collapsed';

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessionMessages, mode]);

  // Add welcome message when context changes
  const prevContextIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (context && mode === 'chat' && context.id !== prevContextIdRef.current && currentSession) {
      // Check if we need to add a welcome message
      if (sessionMessages.length === 0) {
        let contextInfo = '';

        switch (context.type) {
          case 'message':
            contextInfo = `📝 **Message Context**: ${(context.data as Message).content.substring(0, 100)}...`;
            break;
          case 'task':
          case 'project':
            contextInfo = `📋 **${context.type === 'project' ? 'Project' : 'Task'} Context**: ${context.title}`;
            break;
        }

        // Add welcome message to database
        addMessage('model', `${t('readyToAnalyze')}\n\n${contextInfo}\n\n[Ref: ${context.id}]`);
      }
      prevContextIdRef.current = context.id;
    }
  }, [context, mode, currentSession, sessionMessages.length, addMessage, t]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // If no session exists, create one first
    if (!currentSession && context) {
      await createNewSession();
      // Wait a bit for session to be created
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!currentSession) {
      console.error('[RightPanel] No session available');
      return;
    }

    const userInput = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Add user message to database
      await addMessage('user', userInput);

      // Create LLM service with user's configured settings
      const llmService = new LLMService(settings.llm);

      // Build context
      const contextStr = contextMessage ? contextMessage.content : '';
      const languageInstruction = language === 'zh'
        ? "Reply in Simplified Chinese (简体中文). Keep technical terms if necessary."
        : "Reply in English.";

      // Build conversation history for the LLM
      const conversationMessages = sessionMessages
        .filter(msg => msg.role !== 'model' || !msg.content.includes(t('readyToAnalyze')))
        .map(msg => ({
          role: msg.role === 'model' ? ('assistant' as const) : ('user' as const),
          content: msg.content
        }));

      // Add system context and current user message
      const systemPrompt = `System Instruction: You are "Strata Copilot", a research assistant.
Your output should look like an analysis report.
Use Markdown. Be concise, academic, and structured.
${languageInstruction}

${contextStr ? `Context Data (Current layer):\n${contextStr}\n\n` : ''}`;

      const llmMessages = [
        ...conversationMessages,
        { role: 'user' as const, content: systemPrompt + userInput }
      ];

      // Generate response
      const responseText = await llmService.generateChatCompletion(llmMessages, {
        temperature: 0.7,
        maxTokens: 2000
      });

      // Add citation if context exists
      let finalContent = responseText;
      const citations: string[] = [];

      if (contextMessage && !responseText.includes('[Ref:')) {
        finalContent += `\n\nBased on [Ref: ${contextMessage.id}]`;
        citations.push(contextMessage.id);
      }

      // Add AI response to database
      await addMessage('model', finalContent, citations);
    } catch (error: any) {
      console.error('[RightPanel] LLM Error:', error);
      setError(error.message || 'Failed to generate response');

      // Add error message to database
      await addMessage(
        'model',
        `⚠️ Error: ${error.message || 'Failed to generate response'}\n\nPlease check your LLM configuration in Settings.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Find related messages for Info Mode
  const relatedMessages = messages.filter(m => contextMessage?.relatedIds?.includes(m.id));

  return (
    <div
      className={`
        bg-white dark:bg-basalt-900 border-l border-stone-200 dark:border-basalt-800 h-full flex flex-col flex-shrink-0 shadow-2xl z-40 transition-all duration-300 ease-in-out
        ${isOpen ? 'w-[600px]' : 'w-12 items-center py-4 bg-stone-50 dark:bg-basalt-950'}
      `}
    >
      {/* Handle / Collapsed State */}
      {!isOpen && (
        <div className="flex flex-col items-center gap-6">
          <button onClick={() => setMode('chat')} className="p-2 rounded-lg bg-stone-200 dark:bg-basalt-800 text-stone-600 dark:text-stone-300 hover:text-teal-800 dark:hover:text-teal-400 transition-colors tooltip" title={t('copilotMode')}>
            <PanelRightOpen size={18} />
          </button>
          <div className="w-8 h-px bg-stone-200 dark:bg-basalt-800"></div>
          <button onClick={() => setMode('chat')} className="p-2 text-stone-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <Sparkles size={18} />
          </button>
          <button onClick={() => setMode('info')} className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors">
            <Layers size={18} />
          </button>
        </div>
      )}

      {/* Expanded State */}
      {isOpen && (
        <>
          {/* Header */}
          <div className="h-14 border-b border-stone-200 dark:border-basalt-800 flex items-center justify-between px-4 bg-stone-50 dark:bg-basalt-900 flex-shrink-0">
             <div className="flex items-center gap-3">
               <button onClick={() => setMode('collapsed')} className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors">
                 <PanelRightClose size={18} />
               </button>
               <div className="flex p-1 bg-stone-200 dark:bg-basalt-800 rounded-lg">
                 <button
                   onClick={() => setMode('info')}
                   className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${mode === 'info' ? 'bg-white dark:bg-basalt-700 text-stone-900 dark:text-stone-100 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700'}`}
                 >
                   {t('info')}
                 </button>
                 <button
                   onClick={() => setMode('chat')}
                   className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${mode === 'chat' ? 'bg-white dark:bg-basalt-700 text-stone-900 dark:text-stone-100 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700'}`}
                 >
                   {t('copilotMode')}
                 </button>
               </div>
             </div>
             {mode === 'chat' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSessionList(!showSessionList)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-stone-100 dark:bg-basalt-800 hover:bg-stone-200 dark:hover:bg-basalt-700 text-stone-600 dark:text-stone-400 rounded-md text-[10px] font-medium transition-colors"
                  >
                    <MessageSquare size={10} />
                    <span>{sessions.length}</span>
                  </button>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-md text-[10px] font-bold tracking-wider">
                    <Sparkles size={10} />
                    <span>{t('aiOnline')}</span>
                  </div>
                </div>
             )}
          </div>

          {/* Mode 1: Info Panel */}
          {mode === 'info' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               {contextMessage ? (
                 <>
                   {/* Meta Section */}
                   <section>
                     <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-4">{t('metadata')}</div>
                     <div className="bg-stone-50 dark:bg-basalt-800 rounded-lg border border-stone-100 dark:border-basalt-700 p-4 space-y-4">
                       <div className="flex items-start gap-3">
                          <div className="mt-1"><Clock size={14} className="text-stone-400" /></div>
                          <div>
                            <div className="text-xs font-medium text-stone-500 dark:text-stone-400">{t('timestamp')}</div>
                            <div className="text-sm text-stone-800 dark:text-stone-200">
                              {(contextMessage.timestamp instanceof Date ? contextMessage.timestamp : new Date(contextMessage.timestamp)).toLocaleString()}
                            </div>
                          </div>
                       </div>
                       <div className="flex items-start gap-3">
                          <div className="mt-1"><Hash size={14} className="text-stone-400" /></div>
                          <div>
                            <div className="text-xs font-medium text-stone-500 dark:text-stone-400">{t('tags')}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {contextMessage.tags.map(t => (
                                <span key={t} className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-basalt-700 text-stone-600 dark:text-stone-300 text-[10px]">{t}</span>
                              ))}
                            </div>
                          </div>
                       </div>
                     </div>
                   </section>

                   {/* History Section */}
                   <section>
                     <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-4">{t('versionHistory')}</div>
                     <div className="relative pl-3 space-y-4 border-l border-stone-200 dark:border-basalt-700">
                        {Array.from({ length: contextMessage.version }, (_, i) => {
                          const versionNum = contextMessage.version - i;
                          const isCurrent = versionNum === contextMessage.version;
                          const hoursAgo = i * 2;
                          // Ensure timestamp is a Date object
                          const baseTimestamp = contextMessage.timestamp instanceof Date ? contextMessage.timestamp : new Date(contextMessage.timestamp);
                          const versionTimestamp = new Date(baseTimestamp.getTime() - hoursAgo * 60 * 60 * 1000);

                          const getRelativeTime = (date: Date) => {
                            const now = new Date();
                            const diffMs = now.getTime() - date.getTime();
                            const diffMins = Math.floor(diffMs / 60000);
                            const diffHours = Math.floor(diffMs / 3600000);
                            const diffDays = Math.floor(diffMs / 86400000);

                            if (diffMins < 1) return t('justNow');
                            if (diffMins < 60) return `${diffMins} min ago`;
                            if (diffHours < 24) return `${diffHours} hr ago`;
                            return `${diffDays} days ago`;
                          };

                          return (
                            <div key={versionNum} className={`relative ${!isCurrent ? 'opacity-60' : ''}`}>
                              <div className={`absolute -left-[17px] top-1.5 w-2 h-2 rounded-full ring-4 ring-white dark:ring-basalt-900 ${
                                isCurrent ? 'bg-teal-500' : 'bg-stone-300 dark:bg-basalt-600'
                              }`}></div>
                              <div className={`text-xs font-bold ${
                                isCurrent ? 'text-stone-800 dark:text-stone-200' : 'text-stone-600 dark:text-stone-400'
                              }`}>
                                v{versionNum} {isCurrent && `(${t('current')})`}
                              </div>
                              <div className="text-[10px] text-stone-400">
                                {isCurrent ? t('justNow') : getRelativeTime(versionTimestamp)}
                              </div>
                              <div className="text-[10px] text-stone-400 mt-0.5">
                                by {t('you')}
                              </div>
                            </div>
                          );
                        })}
                     </div>
                   </section>

                   {/* Related Strata */}
                   <section>
                      <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-4">{t('relatedStrata')}</div>
                      <div className="space-y-2">
                        {relatedMessages.length > 0 ? relatedMessages.map(m => (
                          <div
                             key={m.id}
                             onClick={() => onCitationClick(m.id)}
                             className="group flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-stone-200 dark:hover:border-basalt-700 hover:bg-stone-50 dark:hover:bg-basalt-800 cursor-pointer transition-all"
                          >
                             <div className="mt-1 min-w-[16px]"><FileText size={14} className="text-stone-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" /></div>
                             <div className="overflow-hidden">
                               <div className="text-xs text-stone-700 dark:text-stone-300 font-medium truncate group-hover:text-teal-800 dark:group-hover:text-teal-300">{m.content}</div>
                               <div className="text-[10px] text-stone-400 mt-0.5">
                                 {(m.timestamp instanceof Date ? m.timestamp : new Date(m.timestamp)).toLocaleDateString()}
                               </div>
                             </div>
                             <ArrowRight size={12} className="text-stone-300 opacity-0 group-hover:opacity-100 ml-auto self-center" />
                          </div>
                        )) : (
                          <div className="text-xs text-stone-400 italic px-2">{t('noRelated')}</div>
                        )}
                      </div>
                   </section>
                 </>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-stone-400">
                    <Layers size={32} className="mb-4 opacity-30" />
                    <p className="text-sm">Select a layer to inspect properties.</p>
                 </div>
               )}
            </div>
          )}

          {/* Mode 2: Chat Copilot */}
          {mode === 'chat' && (
            <div className="flex flex-1 overflow-hidden">
              {/* Session List Sidebar */}
              {showSessionList && (
                <div className="w-64 border-r border-stone-200 dark:border-basalt-800 flex-shrink-0">
                  <SessionList
                    sessions={sessions}
                    currentSessionId={currentSession?.id || null}
                    onSessionSelect={switchSession}
                    onSessionCreate={createNewSession}
                    onSessionDelete={deleteSession}
                    onSessionRename={updateTitle}
                  />
                </div>
              )}

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-8 bg-stone-50/50 dark:bg-basalt-900/50" ref={scrollRef}>
                  {sessionMessages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`mb-1 text-[10px] font-bold tracking-wider ${msg.role === 'user' ? 'text-stone-400' : 'text-teal-700 dark:text-teal-400'}`}>
                        {msg.role === 'user' ? t('you') : t('copilot')}
                      </div>
                      {msg.role === 'user' ? (
                        <div className="bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 text-stone-800 dark:text-stone-200 text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[90%] shadow-sm">
                          {msg.content}
                        </div>
                      ) : (
                        <AIMessage content={msg.content} onCitationClick={onCitationClick} />
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-4">
                       <div className="w-1 bg-terracotta-500/30 h-16 rounded-full animate-pulse"></div>
                       <div className="space-y-2 py-1 w-full max-w-[200px]">
                         <div className="h-2 bg-stone-200 dark:bg-basalt-800 rounded w-full animate-pulse"></div>
                         <div className="h-2 bg-stone-200 dark:bg-basalt-800 rounded w-3/4 animate-pulse"></div>
                         <div className="h-2 bg-stone-200 dark:bg-basalt-800 rounded w-1/2 animate-pulse"></div>
                       </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-basalt-900 border-t border-stone-200 dark:border-basalt-800">
                  <div className="relative shadow-sm rounded-lg bg-stone-50 dark:bg-basalt-950 border border-stone-200 dark:border-basalt-800 focus-within:border-teal-600 focus-within:ring-1 focus-within:ring-teal-600/20 transition-all">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      placeholder={contextMessage ? t('askAboutLayer') : t('askCopilot')}
                      className="w-full bg-transparent border-none rounded-lg py-3 pl-3 pr-10 text-sm text-stone-800 dark:text-stone-200 focus:ring-0 placeholder-stone-400 dark:placeholder-stone-600"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSend}
                      className="absolute right-2 top-2 p-1.5 text-stone-400 hover:text-teal-800 dark:hover:text-teal-400 hover:bg-stone-200 dark:hover:bg-basalt-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
