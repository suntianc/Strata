# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Strata is a React-based AI Studio application for research management and note-taking. It integrates with Google's Gemini API to provide AI-powered analysis and suggestions for research tasks.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Core Structure
- **Frontend**: React 19 with TypeScript, built with Vite
- **AI Integration**: Google Gemini API via `@google/genai` package
- **State Management**: React Context API (LanguageContext, SettingsContext)
- **Styling**: Component-scoped styling with inline styles

### Key Directories
- `/components`: React components (Sidebar, MessageStream, RightPanel, SettingsModal)
- `/contexts`: React contexts for global state (language, settings)
- `/services`: API integration layer (Gemini service)
- Root level: Main App.tsx, types.ts, and configuration files

### Data Models
The application uses these core types defined in `types.ts`:
- `Message`: Research notes with attachments, tags, and project associations
- `TaskNode`: Hierarchical task/project structure
- `AppSettings`: User profile and AI model configuration
- `Attachment`: File attachments (PDF, Excel, image, code)

### Environment Setup
The app requires a Gemini API key set via:
- Environment variable: `GEMINI_API_KEY` in `.env.local` file
- Vite config maps this to `process.env.API_KEY` for the Gemini service

### Key Features
1. **Message Stream**: Displays research notes with tagging and attachment support
2. **Task Management**: Hierarchical project/task organization (pending/active/blocked/completed states)
3. **AI Analysis**: Gemini-powered analysis of research content
4. **Multi-language Support**: English and Chinese localization
5. **Settings Modal**: Configure AI models and user profile

### Component Architecture
- App.tsx serves as the main container with state management
- Components communicate through props and context
- RightPanel has multiple modes (Info, Tasks, Chat, Analysis)
- Settings are persisted through SettingsContext