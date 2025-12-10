import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    inbox: "Inbox",
    surface: "Surface",
    deepStrata: "Deep Strata",
    searchPlaceholder: "Search layers...",
    projectStrata: "Project Strata",
    incomingSediment: "Incoming Sediment",
    activeLayer: "Active Layer",
    organize: "Organize",
    confirmMoves: "Confirm Moves",
    depositPlaceholder: "Deposit new thoughts, observations, or findings...",
    deposit: "Deposit",
    noLayers: "No sedimentary layers found.",
    startDepositing: "Start depositing knowledge to build your strata.",
    analysisLog: "Analysis Log",
    targetLayer: "Target Layer",
    you: "YOU",
    copilot: "COPILOT",
    askPlaceholder: "Ask to analyze patterns...",
    readyToAnalyze: "Ready to analyze your strata layers.",
    analysisResult: "Analysis Result",
    metadata: "Metadata",
    timestamp: "Timestamp",
    tags: "Tags",
    versionHistory: "Version History",
    current: "Current",
    justNow: "Just now by You",
    relatedStrata: "Related Strata",
    noRelated: "No related layers found nearby.",
    scope: "Scope",
    askAboutLayer: "Ask about this layer...",
    askCopilot: "Ask Copilot...",
    aiOnline: "AI ONLINE",
    info: "Info",
    copilotMode: "Copilot",
    move_to: "Move to",
    cancel: "Cancel",
    save_layer: "Save Layer",
    dr_researcher: "Dr. Researcher",
    pro_license: "Pro License",
    unknown_project: "Unknown Project",
    hours_ago: "hours ago",
    files: "files",
    ref: "Ref",
    // Settings
    settings: "Settings",
    profile: "Profile",
    models: "Models",
    general: "General",
    name: "Name",
    role: "Role / Title",
    avatar_url: "Avatar URL",
    llm_config: "LLM Configuration",
    embedding_config: "Embedding Configuration",
    provider: "Provider",
    model_name: "Model Name",
    base_url: "Base URL",
    api_key: "API Key",
    save: "Save Changes",
    saved: "Saved",
    gemini: "Google Gemini",
    ollama: "Ollama (Local)",
    openai: "OpenAI",
    custom: "Custom",
  },
  zh: {
    inbox: "收件箱",
    surface: "地表",
    deepStrata: "深层岩层",
    searchPlaceholder: "搜索岩层...",
    projectStrata: "项目岩层",
    incomingSediment: "新沉积",
    activeLayer: "活动层",
    organize: "整理",
    confirmMoves: "确认移动",
    depositPlaceholder: "存入新的想法、观察或发现...",
    deposit: "存入",
    noLayers: "未发现沉积层。",
    startDepositing: "开始存入知识以构建你的岩层。",
    analysisLog: "分析日志",
    targetLayer: "目标层",
    you: "你",
    copilot: "副驾驶",
    askPlaceholder: "请求分析模式...",
    readyToAnalyze: "准备分析你的岩层。",
    analysisResult: "分析结果",
    metadata: "元数据",
    timestamp: "时间戳",
    tags: "标签",
    versionHistory: "版本历史",
    current: "当前",
    justNow: "刚刚 由你",
    relatedStrata: "相关岩层",
    noRelated: "附近未找到相关岩层。",
    scope: "范围",
    askAboutLayer: "询问关于此层...",
    askCopilot: "询问副驾驶...",
    aiOnline: "AI 在线",
    info: "信息",
    copilotMode: "副驾驶",
    move_to: "移动到",
    cancel: "取消",
    save_layer: "保存岩层",
    dr_researcher: "研究员博士",
    pro_license: "专业版",
    unknown_project: "未知项目",
    hours_ago: "小时前",
    files: "个文件",
    ref: "引用",
    // Settings
    settings: "设置",
    profile: "个人资料",
    models: "模型配置",
    general: "通用",
    name: "名字",
    role: "角色 / 头衔",
    avatar_url: "头像 URL",
    llm_config: "大语言模型 (LLM) 配置",
    embedding_config: "向量模型 (Embedding) 配置",
    provider: "提供商",
    model_name: "模型名称",
    base_url: "API 地址 (Base URL)",
    api_key: "API 密钥",
    save: "保存更改",
    saved: "已保存",
    gemini: "Google Gemini",
    ollama: "Ollama (本地)",
    openai: "OpenAI",
    custom: "自定义",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
