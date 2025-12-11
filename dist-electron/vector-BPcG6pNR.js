import { connect } from "@lancedb/lancedb";
import path from "path";
import { app } from "electron";
let connection = null;
let vectorTable = null;
const TABLE_NAME = "vectors";
const EMBEDDING_DIM = 768;
async function initLanceDB() {
  if (connection) return connection;
  const dbPath = path.join(app.getPath("userData"), "lance");
  console.log("[LanceDB] Initializing database at:", dbPath);
  connection = await connect(dbPath);
  try {
    vectorTable = await connection.openTable(TABLE_NAME);
    console.log("[LanceDB] Opened existing table:", TABLE_NAME);
  } catch {
    console.log("[LanceDB] Creating new table:", TABLE_NAME);
    const sampleData = [{
      id: "init",
      vector: new Array(EMBEDDING_DIM).fill(0),
      text: "Initialization record",
      metadata: JSON.stringify({
        message_id: "init",
        source: "text"
      })
    }];
    vectorTable = await connection.createTable(TABLE_NAME, sampleData);
    await vectorTable.delete('id = "init"');
  }
  console.log("[LanceDB] Database initialized");
  return connection;
}
function getVectorTable() {
  if (!vectorTable) {
    throw new Error("[LanceDB] Table not initialized.");
  }
  return vectorTable;
}
async function insertVectors(records) {
  const table = getVectorTable();
  const data = records.map((record) => ({
    id: record.id,
    vector: record.vector,
    text: record.text,
    metadata: JSON.stringify(record.metadata)
  }));
  await table.add(data);
  console.log(`[LanceDB] Inserted ${records.length} vectors`);
}
async function searchVectors(queryVector, options = {}) {
  const table = getVectorTable();
  const { limit = 10, taskId, source } = options;
  let query = table.search(queryVector).limit(limit);
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
    metadata: JSON.parse(row.metadata)
  }));
}
async function deleteVectorsByMessageId(messageId) {
  const table = getVectorTable();
  await table.delete(`metadata->>'message_id' = '${messageId}'`);
  console.log(`[LanceDB] Deleted vectors for message: ${messageId}`);
}
async function getTaskCenterVector(taskId) {
  const table = getVectorTable();
  const results = await table.search(new Array(EMBEDDING_DIM).fill(0)).where(`metadata->>'task_id' = '${taskId}'`).limit(10).execute();
  if (results.length === 0) return null;
  const sum = new Array(EMBEDDING_DIM).fill(0);
  results.forEach((row) => {
    row.vector.forEach((val, idx) => {
      sum[idx] += val;
    });
  });
  return sum.map((val) => val / results.length);
}
export {
  deleteVectorsByMessageId,
  getTaskCenterVector,
  getVectorTable,
  initLanceDB,
  insertVectors,
  searchVectors
};
