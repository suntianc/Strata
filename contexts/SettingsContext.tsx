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
  // In a real app, load from localStorage here
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

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
