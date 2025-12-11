import React, { useState, useEffect } from 'react';
import { X, User, Cpu, Server, Save, Check, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import { ModelConfig } from '../types';
import { LLMService } from '../services/llmService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { settings, updateProfile, updateLLM, updateEmbedding } = useSettings();
  const [activeTab, setActiveTab] = useState<'profile' | 'models'>('profile');
  const [isSaved, setIsSaved] = useState(false);
  const [testingLLM, setTestingLLM] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Local state for form handling before saving? 
  // For simplicity in this demo, we'll sync with context immediately or on blur, 
  // but let's implement a direct controlled input pattern where we update context on change.
  // In a stricter app, we might want a "Save" button that commits changes.
  
  // Let's stick to "Real-time" updates for fields for simplicity, or localized state.
  // Localized state is better to avoid jitter and allow "Cancel".
  
  const [localProfile, setLocalProfile] = useState(settings.profile);
  const [localLLM, setLocalLLM] = useState(settings.llm);
  const [localEmbedding, setLocalEmbedding] = useState(settings.embedding);

  // Sync local state when modal opens or settings change
  useEffect(() => {
    if (isOpen) {
      setLocalProfile(settings.profile);
      setLocalLLM(settings.llm);
      setLocalEmbedding(settings.embedding);
      setTestResult(null);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    updateProfile(localProfile);
    updateLLM(localLLM);
    updateEmbedding(localEmbedding);
    setIsSaved(true);
    setTestResult(null);
    setTimeout(() => setIsSaved(false), 2000);
    // onClose(); // Optional: close on save
  };

  const handleTestLLM = async () => {
    setTestingLLM(true);
    setTestResult(null);

    try {
      const service = new LLMService(localLLM);
      const result = await service.testConnection();
      setTestResult(result);
    } catch (error: any) {
      setTestResult({ success: false, message: error.message });
    } finally {
      setTestingLLM(false);
    }
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
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={localProfile.avatarUrl || ''}
                      onChange={(e) => setLocalProfile({...localProfile, avatarUrl: e.target.value})}
                      placeholder="https://..."
                      className="flex-1 bg-white dark:bg-basalt-800 border border-stone-200 dark:border-basalt-700 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setLocalProfile({...localProfile, avatarUrl: url});
                        }
                      }}
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="px-3 py-2.5 bg-stone-200 dark:bg-basalt-700 hover:bg-stone-300 dark:hover:bg-basalt-600 border border-stone-200 dark:border-basalt-600 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 cursor-pointer transition-colors whitespace-nowrap"
                    >
                      Upload
                    </label>
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

                {/* Test Connection Button */}
                <div className="pt-2">
                  <button
                    onClick={handleTestLLM}
                    disabled={testingLLM}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 dark:border-basalt-700 hover:bg-stone-50 dark:hover:bg-basalt-800 transition-colors text-sm font-medium text-stone-700 dark:text-stone-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {testingLLM ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Testing Connection...</span>
                      </>
                    ) : (
                      <>
                        <Cpu size={14} />
                        <span>Test Connection</span>
                      </>
                    )}
                  </button>

                  {/* Test Result */}
                  {testResult && (
                    <div className={`mt-3 p-3 rounded-lg border ${testResult.success ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                      <div className="flex items-start gap-2">
                        {testResult.success ? (
                          <CheckCircle size={16} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className={`text-xs font-bold ${testResult.success ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                            {testResult.success ? '✓ Connection Successful' : '✗ Connection Failed'}
                          </div>
                          <div className={`text-xs mt-1 whitespace-pre-wrap ${testResult.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                            {testResult.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
