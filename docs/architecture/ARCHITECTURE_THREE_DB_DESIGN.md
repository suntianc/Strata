# Three-Database Collaboration Architecture Design

**Date**: 2025-12-11
**Status**: 🚧 In Design

---

## 🎯 Requirements Analysis

### Core Requirements

1. **Three-Database System**:
   - **PGlite**: Structured data (tasks, messages, metadata, relationships)
   - **LanceDB**: Vector embeddings for semantic search
   - **KuzuDB**: Graph database for relationship queries

2. **Context-Based Conversations**:
   - **Project Level**: All project messages + all subtasks + all subtask messages + related documents
   - **Task Level**: Current task messages + child tasks + child task messages + related documents
   - **Message Level**: Single message + attached documents only

3. **Session Management**:
   - Each project/task has independent conversation session
   - Sessions can be created and deleted
   - Conversation history persists per session

---

## 🏗️ Architecture Design

### Database Roles

#### 1. PGlite (Primary Storage & Metadata)

**Purpose**: Structured data storage, metadata, and relationships

**Schema**:
```sql
-- Tasks and Projects
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT,
  parent_id TEXT,
  expanded BOOLEAN,
  position INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Messages
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  version INTEGER,
  author TEXT,
  tags TEXT[], -- Array for better querying
  project_id TEXT,
  is_archived BOOLEAN,
  embedding_id TEXT, -- Link to LanceDB vector
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Attachments
CREATE TABLE attachments (
  id TEXT PRIMARY KEY,
  message_id TEXT REFERENCES messages(id) ON DELETE CASCADE,
  type TEXT,
  name TEXT,
  url TEXT,
  data TEXT, -- base64 or file path
  meta JSONB,
  embedding_id TEXT, -- Link to LanceDB vector for document content
  created_at TIMESTAMP
);

-- Chat Sessions (NEW)
CREATE TABLE chat_sessions (
  id TEXT PRIMARY KEY,
  context_type TEXT CHECK (context_type IN ('project', 'task', 'message')),
  context_id TEXT NOT NULL, -- ID of project/task/message
  title TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_activity TIMESTAMP,
  UNIQUE(context_type, context_id)
);

-- Chat Messages (NEW)
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'model')),
  content TEXT NOT NULL,
  citations TEXT[], -- Message/document IDs referenced
  created_at TIMESTAMP,
  position INTEGER -- Order in conversation
);

-- Knowledge Graph Relationships (synced to KuzuDB)
CREATE TABLE relationships (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  relationship_type TEXT NOT NULL, -- 'contains', 'references', 'relates_to', etc.
  metadata JSONB,
  created_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_messages_project_id ON messages(project_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX idx_attachments_message_id ON attachments(message_id);
CREATE INDEX idx_chat_sessions_context ON chat_sessions(context_type, context_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id, position);
CREATE INDEX idx_relationships_source ON relationships(source_id, source_type);
CREATE INDEX idx_relationships_target ON relationships(target_id, target_type);
```

**Responsibilities**:
- ✅ Store all structured data
- ✅ Manage task hierarchy
- ✅ Store chat sessions and conversation history
- ✅ Maintain relationship metadata
- ✅ Fast SQL queries for filtering and joins

---

#### 2. LanceDB (Vector Embeddings)

**Purpose**: Semantic search and similarity matching

**Schema**:
```python
# Message Embeddings
class MessageEmbedding(LanceModel):
    id: str  # Same as message.id in PGlite
    message_id: str
    content: str
    vector: Vector(768)  # e.g., using 'nomic-embed-text'
    project_id: str
    timestamp: datetime
    metadata: dict  # tags, author, etc.

# Document Embeddings
class DocumentEmbedding(LanceModel):
    id: str
    attachment_id: str  # Links to attachments in PGlite
    message_id: str
    content: str  # Extracted text from PDF/document
    vector: Vector(768)
    chunk_index: int  # For large documents split into chunks
    metadata: dict  # file type, page number, etc.

# Task Embeddings
class TaskEmbedding(LanceModel):
    id: str
    task_id: str
    title: str
    description: str  # Aggregated from messages
    vector: Vector(768)
    metadata: dict
```

**Responsibilities**:
- ✅ Store vector embeddings for all content
- ✅ Semantic search: "Find similar tasks/messages"
- ✅ Contextual retrieval for RAG
- ✅ Similarity scoring

**Operations**:
```python
# Add message embedding
await lancedb.add_message_embedding(
    message_id="msg-123",
    content="Research AI capabilities",
    project_id="proj-1"
)

# Semantic search
results = await lancedb.search(
    query="machine learning applications",
    context_ids=["proj-1"],  # Filter by project
    limit=10
)
```

---

#### 3. KuzuDB (Graph Database)

**Purpose**: Complex relationship queries and graph traversal

**Schema**:
```cypher
// Node types
CREATE NODE TABLE Task(id STRING, title STRING, status STRING, PRIMARY KEY(id));
CREATE NODE TABLE Message(id STRING, content STRING, timestamp TIMESTAMP, PRIMARY KEY(id));
CREATE NODE TABLE Document(id STRING, name STRING, type STRING, PRIMARY KEY(id));
CREATE NODE TABLE Tag(name STRING, PRIMARY KEY(name));

// Relationship types
CREATE REL TABLE CONTAINS(FROM Task TO Task);  // Parent-child tasks
CREATE REL TABLE HAS_MESSAGE(FROM Task TO Message);
CREATE REL TABLE ATTACHES(FROM Message TO Document);
CREATE REL TABLE REFERENCES(FROM Message TO Message);
CREATE REL TABLE TAGGED_WITH(FROM Message TO Tag);
CREATE REL TABLE RELATES_TO(FROM Task TO Task, relationship STRING);

// Indexes
CREATE INDEX ON Task(status);
CREATE INDEX ON Message(timestamp);
```

**Responsibilities**:
- ✅ Graph traversal: "Get all descendant tasks"
- ✅ Relationship queries: "Find all messages referencing this document"
- ✅ Path finding: "How are these two tasks connected?"
- ✅ Complex queries: "Get all documents in this project subtree"

**Operations**:
```cypher
// Get all messages in project tree
MATCH (root:Task {id: 'proj-1'})-[:CONTAINS*]->(child:Task)-[:HAS_MESSAGE]->(msg:Message)
RETURN msg;

// Get all documents in task subtree
MATCH (task:Task {id: 'task-123'})-[:CONTAINS*0..]->(subtask:Task)-[:HAS_MESSAGE]->(msg:Message)-[:ATTACHES]->(doc:Document)
RETURN DISTINCT doc;

// Find related tasks through shared documents
MATCH (t1:Task {id: 'task-A'})-[:HAS_MESSAGE]->(:Message)-[:ATTACHES]->(doc:Document)<-[:ATTACHES]-(:Message)<-[:HAS_MESSAGE]-(t2:Task)
RETURN DISTINCT t2;
```

---

## 🔄 Data Flow & Synchronization

### Data Ingestion Flow

```
User Action (Create/Update/Delete)
    ↓
[1] PGlite (Primary Write)
    ├─ Insert/Update structured data
    ├─ Generate relationships
    └─ Commit transaction
    ↓
[2] LanceDB (Async Embedding)
    ├─ Extract text content
    ├─ Generate embedding vector
    └─ Store in vector DB
    ↓
[3] KuzuDB (Async Graph Sync)
    ├─ Create/update nodes
    ├─ Create/update relationships
    └─ Maintain graph structure
```

### Query Flow for LLM Context

```
User Selects Context (Project/Task/Message)
    ↓
[1] Determine Context Scope
    ├─ Project: Get all subtasks + messages
    ├─ Task: Get child tasks + messages
    └─ Message: Get single message + attachments
    ↓
[2] PGlite Query (Structured Filter)
    ├─ Get task hierarchy (if project/task)
    ├─ Get message IDs in scope
    └─ Get attachment metadata
    ↓
[3] KuzuDB Query (Graph Traversal)
    ├─ Traverse task tree
    ├─ Find related documents
    └─ Get referenced messages
    ↓
[4] LanceDB Query (Semantic Search)
    ├─ Use current conversation as query
    ├─ Filter by scope (project_id, task_id)
    ├─ Get top-K similar messages/documents
    └─ Return ranked results
    ↓
[5] Build LLM Context
    ├─ Combine structured data (PGlite)
    ├─ Add graph relationships (KuzuDB)
    ├─ Add semantic matches (LanceDB)
    └─ Format as LLM prompt
    ↓
[6] LLM Response
    ├─ Generate answer with citations
    ├─ Store in chat_messages (PGlite)
    └─ Update last_activity (session)
```

---

## 💬 Session Management Design

### Session Lifecycle

```typescript
// Session Entity
interface ChatSession {
  id: string;
  contextType: 'project' | 'task' | 'message';
  contextId: string; // ID of the project/task/message
  title: string; // Auto-generated or user-defined
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
  messageCount: number;
}

// Session Operations
class SessionManager {
  // Get or create session for context
  async getOrCreateSession(
    contextType: 'project' | 'task' | 'message',
    contextId: string
  ): Promise<ChatSession>;

  // Get all sessions for a context
  async listSessions(
    contextType: 'project' | 'task' | 'message',
    contextId: string
  ): Promise<ChatSession[]>;

  // Delete session (also deletes messages)
  async deleteSession(sessionId: string): Promise<void>;

  // Get messages in session
  async getSessionMessages(sessionId: string): Promise<ChatMessage[]>;

  // Add message to session
  async addMessage(
    sessionId: string,
    role: 'user' | 'model',
    content: string,
    citations?: string[]
  ): Promise<void>;
}
```

### Session UI

```
[Copilot Panel]
┌─────────────────────────────────┐
│ 📋 Project: AI Research         │ ← Context indicator
├─────────────────────────────────┤
│ Sessions (2)                     │
│  🔵 Main Discussion (12 msgs)   │ ← Active session
│  ⚪ Follow-up Questions (3 msgs)│
│  + New Session                   │
├─────────────────────────────────┤
│ [Chat messages...]               │
├─────────────────────────────────┤
│ Ask Copilot...            [Send] │
└─────────────────────────────────┘
```

---

## 🔍 Context Retrieval Implementation

### 1. Project-Level Context

```typescript
async function getProjectContext(projectId: string): Promise<LLMContext> {
  // Step 1: Get task tree (PGlite)
  const tasks = await db.query(`
    WITH RECURSIVE task_tree AS (
      SELECT * FROM tasks WHERE id = $1
      UNION ALL
      SELECT t.* FROM tasks t
      JOIN task_tree tt ON t.parent_id = tt.id
    )
    SELECT * FROM task_tree
  `, [projectId]);

  // Step 2: Get all messages (PGlite)
  const taskIds = tasks.map(t => t.id);
  const messages = await db.query(`
    SELECT * FROM messages
    WHERE project_id = ANY($1)
    AND is_archived = false
    ORDER BY timestamp DESC
  `, [taskIds]);

  // Step 3: Get graph relationships (KuzuDB)
  const relationships = await kuzu.query(`
    MATCH (root:Task {id: $projectId})-[:CONTAINS*]->(child:Task)
    MATCH (child)-[:HAS_MESSAGE]->(msg:Message)-[:ATTACHES]->(doc:Document)
    RETURN DISTINCT doc
  `);

  // Step 4: Semantic search (LanceDB)
  const relevantDocs = await lancedb.search({
    query: lastUserMessage,
    filter: { project_id: projectId },
    limit: 10
  });

  return {
    tasks,
    messages,
    documents: relationships.documents,
    semanticMatches: relevantDocs
  };
}
```

### 2. Task-Level Context

```typescript
async function getTaskContext(taskId: string): Promise<LLMContext> {
  // Step 1: Get subtask tree (PGlite)
  const tasks = await db.query(`
    WITH RECURSIVE task_tree AS (
      SELECT * FROM tasks WHERE id = $1
      UNION ALL
      SELECT t.* FROM tasks t
      JOIN task_tree tt ON t.parent_id = tt.id
    )
    SELECT * FROM task_tree
  `, [taskId]);

  // Step 2: Get messages for this task tree
  const taskIds = tasks.map(t => t.id);
  const messages = await db.query(`
    SELECT * FROM messages
    WHERE project_id = ANY($1)
    AND is_archived = false
    ORDER BY timestamp DESC
  `, [taskIds]);

  // Step 3: Graph query for related documents
  const relatedDocs = await kuzu.query(`
    MATCH (task:Task {id: $taskId})-[:CONTAINS*0..]->(subtask:Task)
    MATCH (subtask)-[:HAS_MESSAGE]->(msg:Message)-[:ATTACHES]->(doc:Document)
    RETURN DISTINCT doc
  `);

  // Step 4: Semantic search within task scope
  const semanticMatches = await lancedb.search({
    query: lastUserMessage,
    filter: { task_id: taskId },
    limit: 10
  });

  return {
    tasks,
    messages,
    documents: relatedDocs,
    semanticMatches
  };
}
```

### 3. Message-Level Context

```typescript
async function getMessageContext(messageId: string): Promise<LLMContext> {
  // Step 1: Get single message (PGlite)
  const message = await db.query(`
    SELECT * FROM messages WHERE id = $1
  `, [messageId]);

  // Step 2: Get attachments (PGlite)
  const attachments = await db.query(`
    SELECT * FROM attachments WHERE message_id = $1
  `, [messageId]);

  // Step 3: Extract document content if needed
  const documentContents = await Promise.all(
    attachments.map(att => extractDocumentText(att))
  );

  return {
    message,
    attachments,
    documentContents
  };
}
```

---

## 🛠️ Implementation Plan

### Phase 1: Fix PGlite Persistence ✅
1. Implement singleton pattern for database instance
2. Use UPSERT instead of DELETE + INSERT
3. Add proper error handling
4. Test in production build

### Phase 2: Add Session Management 🚧
1. Create `chat_sessions` and `chat_messages` tables
2. Implement SessionManager class
3. Update UI to show sessions
4. Add session switching functionality

### Phase 3: Integrate LanceDB 📋
1. Install and configure LanceDB
2. Create embedding generation service
3. Implement async embedding pipeline
4. Add semantic search queries

### Phase 4: Integrate KuzuDB 📋
1. Install and configure KuzuDB
2. Create graph schema
3. Implement sync pipeline from PGlite to KuzuDB
4. Add graph traversal queries

### Phase 5: Build Context Retrieval 📋
1. Implement getProjectContext()
2. Implement getTaskContext()
3. Implement getMessageContext()
4. Integrate with LLM service

### Phase 6: Testing & Optimization 📋
1. Test three-DB coordination
2. Optimize query performance
3. Add caching layer
4. Monitor and tune

---

## 🎯 Next Immediate Steps

1. **Fix PGlite persistence** (blocking issue)
2. **Add session tables** to PGlite schema
3. **Implement SessionManager** for session CRUD
4. **Update RightPanel UI** to support multiple sessions
5. **Design LanceDB integration** architecture
6. **Design KuzuDB integration** architecture

---

**Status**: Architecture designed, ready for implementation
**Blocker**: PGlite persistence must be fixed first
