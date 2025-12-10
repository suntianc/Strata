import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatMessage } from '../types';
import { Bot, X, Sparkles, Send, BookOpen } from 'lucide-react';
import { generateAnalysis } from '../services/geminiService';

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contextMessage: Message | null;
}

export const RightPanel: React.FC<RightPanelProps> = ({ isOpen, onClose, contextMessage }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', content: 'Ready to analyze your strata layers.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  // Context effect
  useEffect(() => {
    if (contextMessage) {
      setChatHistory(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'model', content: `I've focused on the note from ${contextMessage.timestamp.toLocaleTimeString()}. What would you like to know about it?` }
      ]);
    }
  }, [contextMessage]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateAnalysis(input, contextMessage ? [contextMessage.content] : []);
    
    const aiMsg: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      content: responseText 
    };

    setChatHistory(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="w-[350px] bg-white dark:bg-basalt-800 border-l border-stone-300 dark:border-basalt-700 h-full flex flex-col flex-shrink-0 shadow-xl z-30 transition-colors duration-300">
      {/* Header */}
      <div className="h-14 border-b border-stone-200 dark:border-basalt-700 flex items-center justify-between px-4 bg-white dark:bg-basalt-800 transition-colors">
        <div className="flex items-center gap-2 text-teal-800 dark:text-teal-400">
          <Sparkles size={16} />
          <span className="font-semibold text-sm">Strata Copilot</span>
        </div>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Context Indicator */}
      {contextMessage && (
        <div className="px-4 py-3 bg-terracotta-100/30 dark:bg-terracotta-500/10 border-b border-terracotta-100 dark:border-terracotta-500/20 flex items-start gap-2">
          <BookOpen size={14} className="text-terracotta-500 mt-0.5" />
          <div>
            <div className="text-[10px] font-bold text-terracotta-500 uppercase tracking-wide">Context Active</div>
            <div className="text-xs text-stone-600 dark:text-stone-300 truncate max-w-[280px] font-medium">"{contextMessage.content.slice(0, 40)}..."</div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'user' ? (
              <div className="bg-stone-100 dark:bg-basalt-700 text-stone-800 dark:text-stone-200 text-sm px-3 py-2 rounded-lg rounded-tr-none max-w-[85%]">
                {msg.content}
              </div>
            ) : (
              <div className="flex gap-3 max-w-[95%]">
                <div className="w-0.5 bg-terracotta-500 self-stretch flex-shrink-0 mt-1 mb-1 opacity-70"></div>
                <div>
                   <div className="text-[10px] font-bold text-terracotta-500 mb-1 flex items-center gap-1">
                      ANALYSIS REPORT
                   </div>
                   <div className="text-sm text-stone-700 dark:text-stone-300 font-serif leading-relaxed markdown-body">
                      {msg.content}
                   </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-0.5 bg-terracotta-500 h-12 opacity-30 animate-pulse"></div>
             <div className="space-y-2 py-1 w-full">
               <div className="h-2 bg-stone-100 dark:bg-basalt-700 rounded w-3/4 animate-pulse"></div>
               <div className="h-2 bg-stone-100 dark:bg-basalt-700 rounded w-1/2 animate-pulse"></div>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-stone-200 dark:border-basalt-700 bg-white dark:bg-basalt-800 transition-colors">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI to analyze layers..."
            className="w-full bg-stone-50 dark:bg-basalt-900 border border-stone-200 dark:border-basalt-700 rounded-md py-2 pl-3 pr-10 text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:border-teal-800 dark:focus:border-teal-400 transition-colors"
          />
          <button 
            onClick={handleSend}
            className="absolute right-1.5 top-1.5 p-1 text-stone-400 hover:text-teal-800 dark:hover:text-teal-400 transition-colors"
            disabled={isLoading}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};