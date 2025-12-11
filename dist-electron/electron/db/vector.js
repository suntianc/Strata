/**
 * LanceDB Vector Database Module
 * Handles semantic search and RAG context retrieval
 */
import { connect } from '@lancedb/lancedb';
import path from 'path';
import { app } from 'electron';
let connection = null;
let vectorTable = null;
const TABLE_NAME = 'vectors';
const EMBEDDING_DIM = 768; // For nomic-embed-text or similar
export async function initLanceDB() {
    if (connection)
        return connection;
    const dbPath = path.join(app.getPath('userData'), 'lance');
    console.log('[LanceDB] Initializing database at:', dbPath);
    connection = await connect(dbPath);
    // Create or open vectors table
    try {
        vectorTable = await connection.openTable(TABLE_NAME);
        console.log('[LanceDB] Opened existing table:', TABLE_NAME);
    }
    catch {
        // Table doesn't exist, create it
        console.log('[LanceDB] Creating new table:', TABLE_NAME);
        // Create with empty schema first
        const sampleData = [{
                id: 'init',
                vector: new Array(EMBEDDING_DIM).fill(0),
                text: 'Initialization record',
                metadata: JSON.stringify({
                    message_id: 'init',
                    source: 'text',
                }),
            }];
        vectorTable = await connection.createTable(TABLE_NAME, sampleData);
        // Delete the initialization record
        await vectorTable.delete('id = "init"');
    }
    console.log('[LanceDB] Database initialized');
    return connection;
}
export function getLanceDB() {
    if (!connection) {
        throw new Error('[LanceDB] Database not initialized. Call initLanceDB() first.');
    }
    return connection;
}
export function getVectorTable() {
    if (!vectorTable) {
        throw new Error('[LanceDB] Table not initialized.');
    }
    return vectorTable;
}
/**
 * Insert vector records into the database
 */
export async function insertVectors(records) {
    const table = getVectorTable();
    const data = records.map((record) => ({
        id: record.id,
        vector: record.vector,
        text: record.text,
        metadata: JSON.stringify(record.metadata),
    }));
    await table.add(data);
    console.log(`[LanceDB] Inserted ${records.length} vectors`);
}
/**
 * Search for similar vectors
 */
export async function searchVectors(queryVector, options = {}) {
    const table = getVectorTable();
    const { limit = 10, taskId, source } = options;
    // @ts-ignore - LanceDB types are incomplete
    let query = table.search(queryVector).limit(limit);
    // Apply filters
    if (taskId) {
        query = query.where(`metadata->>'task_id' = '${taskId}'`);
    }
    if (source) {
        query = query.where(`metadata->>'source' = '${source}'`);
    }
    const results = await query.execute();
    return results.map((row) => ({
        id: row.id,
        vector: row.vector,
        text: row.text,
        metadata: JSON.parse(row.metadata),
    }));
}
/**
 * Delete vectors by message ID
 */
export async function deleteVectorsByMessageId(messageId) {
    const table = getVectorTable();
    await table.delete(`metadata->>'message_id' = '${messageId}'`);
    console.log(`[LanceDB] Deleted vectors for message: ${messageId}`);
}
/**
 * Get all vectors for a specific message
 */
export async function getVectorsByMessageId(messageId) {
    const table = getVectorTable();
    const results = await table
        .search(new Array(EMBEDDING_DIM).fill(0))
        .where(`metadata->>'message_id' = '${messageId}'`)
        .limit(100)
        .execute();
    return results.map((row) => ({
        id: row.id,
        vector: row.vector,
        text: row.text,
        metadata: JSON.parse(row.metadata),
    }));
}
/**
 * Calculate average vector for a task (for inbox organization)
 */
export async function getTaskCenterVector(taskId) {
    const table = getVectorTable();
    const results = await table
        .search(new Array(EMBEDDING_DIM).fill(0))
        .where(`metadata->>'task_id' = '${taskId}'`)
        .limit(10) // Last 10 messages
        .execute();
    if (results.length === 0)
        return null;
    // Calculate mean vector
    const sum = new Array(EMBEDDING_DIM).fill(0);
    results.forEach((row) => {
        row.vector.forEach((val, idx) => {
            sum[idx] += val;
        });
    });
    return sum.map((val) => val / results.length);
}
// Cleanup
export async function closeLanceDB() {
    if (connection) {
        // LanceDB connections are automatically managed
        connection = null;
        vectorTable = null;
        console.log('[LanceDB] Connection closed');
    }
}
