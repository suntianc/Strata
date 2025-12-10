import React, { useState } from 'react';
import { X, User, Cpu, Server, Save, Check } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import { ModelConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { settings, updateProfile, updateLLM, updateEmbedding } = useSettings();
  const [activeTab, setActiveTab] = useState<'profile' | 'models'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  // Local state for form handling before saving? 
  // For simplicity in this demo, we'll sync with context immediately or on blur, 
  // but let's implement a direct controlled input pattern where we update context on change.
  // In a stricter app, we might want a "Save" button that commits changes.
  
  // Let's stick to "Real-time" updates for fields for simplicity, or localized state.
  // Localized state is better to avoid jitter and allow "Cancel".
  
  const [localProfile, setLocalProfile] = useState(settings.profile);
  const [localLLM, setLocalLLM] = useState(settings.llm);
  const [localEmbedding, setLocalEmbedding] = useState(settings.embedding);

  if (!isOpen) return null;

  const handleSave = () => {
    updateProfile(localProfile);
    updateLLM(localLLM);
    updateEmbedding(localEmbedding);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    // onClose(); // Optional: close on save
  };

  const providers = [
    { value: 'gemini', label: t('gemini') },
    { value: 'ollama', label: t('ollama') },
    { value: 'openai', label: t('openai') },
    { value: 'custom', label: t('custom') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-basalt-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 dark:border-basalt-700 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-basalt-800">
          <h2 className="text-lg font-serif font-bold text-stone-800 dark:text-stone-100">{t('settings')}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-100 dark:border-basalt-800 px-6">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'profile' ? 'border-teal-600 text-teal-800 dark:text-teal-400' : 'border-transparent text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'}`}
          >
            <User size={16} />
            {t('profile')}
          </button>
          <button 
            onClick={() => setActiveTab('models')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'models' ? 'border-teal-600 text-teal-800 dark:text-teal-400' : 'border-transparent text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'}`}
          >
            <Cpu size={16} />
            {t('models')}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50 dark:bg-basalt-950/50">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t('name')}</label>
                <input 
                  type="text" 
                  value={localProfile.name}
                  onChange={(e) => setLocalProfile({...localProfile, name: e.target.value})}
                  className="w-full bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t('role')}</label>
                <input 
                  type="text" 
                  value={localProfile.role}
                  onChange={(e) => setLocalProfile({...localProfile, role: e.target.value})}
                  className="w-full bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t('avatar_url')}</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={localProfile.avatarUrl || ''}
                      onChange={(e) => setLocalProfile({...localProfile, avatarUrl: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none" 
                    />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-basalt-700 overflow-hidden flex-shrink-0 border border-stone-200 dark:border-basalt-600">
                    {localProfile.avatarUrl ? (
                      <img src={localProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs font-bold">
                         {localProfile.name.slice(0, 2).toUpperCase()}
                       </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="space-y-8">
              {/* LLM Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-basalt-800">
                  <Cpu size={16} className="text-teal-600 dark:text-teal-400" />
                  <h3 className="font-bold text-stone-700 dark:text-stone-200">{t('llm_config')}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t('provider')}</label>
                    <div className="relative">
                      <select 
                        value={localLLM.provider}
                        onChange={(e) => setLocalLLM({...localLLM, provider: e.target.value as any})}
                        className="w-full appearance-none bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                      >
                        {providers.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t('model_name')}</label>
                    <input 
                      type="text" 
                      value={localLLM.modelName}
                      onChange={(e) => setLocalLLM({...localLLM, modelName: e.target.value})}
                      className="w-full bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                {localLLM.provider !== 'gemini' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t('base_url')}</label>
                    <input 
                      type="text" 
                      value={localLLM.baseUrl || ''}
                      onChange={(e) => setLocalLLM({...localLLM, baseUrl: e.target.value})}
                      placeholder="http://localhost:11434"
                      className="w-full bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                   <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t('api_key')}</label>
                   <input 
                      type="password" 
                      value={localLLM.apiKey || ''}
                      onChange={(e) => setLocalLLM({...localLLM, apiKey: e.target.value})}
                      placeholder={localLLM.provider === 'gemini' ? "Starts with AIza..." : "Optional for local"}
                      className="w-full bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none font-mono"
                    />
                </div>
              </section>

              {/* Embedding Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-basalt-800">
                  <Server size={16} className="text-terracotta-500" />
                  <h3 className="font-bold text-stone-700 dark:text-stone-200">{t('embedding_config')}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t('provider')}</label>
                    <select 
                        value={localEmbedding.provider}
                        onChange={(e) => setLocalEmbedding({...localEmbedding, provider: e.target.value as any})}
                        className="w-full appearance-none bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                      >
                        {providers.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t('model_name')}</label>
                    <input 
                      type="text" 
                      value={localEmbedding.modelName}
                      onChange={(e) => setLocalEmbedding({...localEmbedding, modelName: e.target.value})}
                      className="w-full bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                {localEmbedding.provider !== 'gemini' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t('base_url')}</label>
                    <input 
                      type="text" 
                      value={localEmbedding.baseUrl || ''}
                      onChange={(e) => setLocalEmbedding({...localEmbedding, baseUrl: e.target.value})}
                      placeholder="http://localhost:11434"
                      className="w-full bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                  </div>
                )}
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-basalt-950 border-t border-stone-100 dark:border-basalt-800 flex justify-end">
          <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${isSaved ? 'bg-green-600 text-white' : 'bg-stone-800 hover:bg-stone-900 dark:bg-stone-200 dark:hover:bg-white text-white dark:text-stone-900'}`}
          >
            {isSaved ? <Check size={16} /> : <Save size={16} />}
            {isSaved ? t('saved') : t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};
