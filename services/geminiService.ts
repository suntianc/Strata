import { GoogleGenAI } from "@google/genai";
import { TaskNode } from "../types";

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
      console.warn("No API Key found in environment");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

// Flatten task tree for AI context
const flattenTasks = (nodes: TaskNode[]): {id: string, title: string}[] => {
  let flat: {id: string, title: string}[] = [];
  for (const node of nodes) {
    flat.push({ id: node.id, title: node.title });
    if (node.children) {
      flat = [...flat, ...flattenTasks(node.children)];
    }
  }
  return flat;
};

export const generateAnalysis = async (
  prompt: string, 
  contextMessages: string[]
): Promise<string> => {
  try {
    const ai = getClient();
    const contextStr = contextMessages.join('\n---\n');
    const fullPrompt = `
      System Instruction: You are "Strata Copilot", a research assistant. 
      Your output should look like an analysis report. 
      Use Markdown. Be concise, academic, and structured.
      
      Context Data (Strata layers):
      ${contextStr}
      
      User Query: ${prompt}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "Analysis complete. No text generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating analysis. Please check your API key.";
  }
};

export const suggestTags = async (content: string): Promise<string[]> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 3 short, relevant tags for this research note. Return ONLY a comma-separated list. Content: "${content}"`,
    });
    const text = response.text || "";
    return text.split(',').map(s => s.trim()).slice(0, 3);
  } catch (e) {
    return ["research", "uncategorized"];
  }
};

export const suggestTaskForMessages = async (messages: string[], taskTree: TaskNode[]): Promise<Record<string, string>> => {
  // In a real app, this would use embeddings (Vector Match). 
  // Here we simulate or use a lightweight LLM call if key exists, otherwise mock.
  
  const tasks = flattenTasks(taskTree);
  
  // Mock simulation for prototype speed/reliability without heavy API usage
  const suggestions: Record<string, string> = {};
  messages.forEach((msg, idx) => {
    // Simple heuristic for demo purposes
    const targetTask = tasks.find(t => msg.toLowerCase().includes(t.title.split(':')[0].toLowerCase())) || tasks[0];
    suggestions[idx.toString()] = targetTask.id;
  });
  
  return suggestions;
};
