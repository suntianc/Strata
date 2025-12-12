import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppSettings, UserProfile, ModelConfig } from '../types';
import { db } from '../services/database.v2';

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
  // Load settings from PGlite database
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize database and load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        await db.init();

        // Check if database is available
        if (db.isDatabaseAvailable()) {
          // Try to load settings from database
          const dbSettings = await db.getSettings();

          if (dbSettings) {
            setSettings(dbSettings);
            console.log('[SettingsContext] Settings loaded from database');
            setIsLoaded(true);
            return;
          }
        }

        // Database not available or no settings - use localStorage
        const stored = localStorage.getItem('strata_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          const migratedSettings = {
            profile: { ...DEFAULT_SETTINGS.profile, ...parsed.profile },
            llm: { ...DEFAULT_SETTINGS.llm, ...parsed.llm },
            embedding: { ...DEFAULT_SETTINGS.embedding, ...parsed.embedding },
          };
          setSettings(migratedSettings);
          console.log('[SettingsContext] Settings loaded from localStorage');
        } else {
          setSettings(DEFAULT_SETTINGS);
          console.log('[SettingsContext] Default settings loaded');
        }

        setIsLoaded(true);
      } catch (error) {
        console.error('[SettingsContext] Failed to load settings:', error);
        setSettings(DEFAULT_SETTINGS);
        setIsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  // Persist settings to database whenever they change
  useEffect(() => {
    if (!isLoaded) return;

    const saveSettings = async () => {
      try {
        // Check if database is available
        if (db.isDatabaseAvailable()) {
          await db.saveSettings(settings);
          console.log('[SettingsContext] Settings saved to database');
        } else {
          // Use localStorage for browser mode
          localStorage.setItem('strata_settings', JSON.stringify(settings));
          console.log('[SettingsContext] Settings saved to localStorage');
        }
      } catch (error) {
        console.error('[SettingsContext] Failed to save settings:', error);
      }
    };

    saveSettings();
  }, [settings, isLoaded]);

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
