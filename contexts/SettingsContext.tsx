import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppSettings, UserProfile, ModelConfig } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  profile: {
    name: "Dr. Researcher",
    role: "Principal Investigator",
    avatarUrl: "", // Empty string means use initials
  },
  llm: {
    provider: 'gemini',
    modelName: 'gemini-2.5-flash',
    apiKey: '',
  },
  embedding: {
    provider: 'ollama',
    modelName: 'nomic-embed-text',
    baseUrl: 'http://localhost:11434',
  }
};

interface SettingsContextType {
  settings: AppSettings;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateLLM: (config: Partial<ModelConfig>) => void;
  updateEmbedding: (config: Partial<ModelConfig>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load settings from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem('strata_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all fields exist
        return {
          profile: { ...DEFAULT_SETTINGS.profile, ...parsed.profile },
          llm: { ...DEFAULT_SETTINGS.llm, ...parsed.llm },
          embedding: { ...DEFAULT_SETTINGS.embedding, ...parsed.embedding },
        };
      }
    } catch (error) {
      console.error('[SettingsContext] Failed to load settings:', error);
    }
    return DEFAULT_SETTINGS;
  });

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('strata_settings', JSON.stringify(settings));
      console.log('[SettingsContext] Settings saved:', settings.llm.provider);
    } catch (error) {
      console.error('[SettingsContext] Failed to save settings:', error);
    }
  }, [settings]);

  const updateProfile = (profile: Partial<UserProfile>) => {
    setSettings(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profile }
    }));
  };

  const updateLLM = (config: Partial<ModelConfig>) => {
    setSettings(prev => ({
      ...prev,
      llm: { ...prev.llm, ...config }
    }));
  };

  const updateEmbedding = (config: Partial<ModelConfig>) => {
    setSettings(prev => ({
      ...prev,
      embedding: { ...prev.embedding, ...config }
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateProfile, updateLLM, updateEmbedding }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
