/**
 * Task Service
 * Handles task hierarchy and status management
 */

import { v4 as uuidv4 } from 'uuid';
import { query, queryOne, execute } from '../db/pg.js';
import { upsertTask, createTaskHierarchy } from '../db/graph.js';
import type { TaskNode } from '../../types';
import type { CreateTaskDTO, DBTask } from '../types/ipc';

export class TaskService {
  /**
   * Create a new task
   */
  static async create(payload: CreateTaskDTO): Promise<TaskNode> {
    const { title, description, parentId, status = 'todo' } = payload;

    const taskId = uuidv4();

    // 1. Insert into PGlite
    await execute(
      `INSERT INTO tasks (id, parent_id, title, description, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [taskId, parentId || null, title, description || null, status]
    );

    // 2. Create graph nodes
    await upsertTask(taskId, title, status);

    if (parentId) {
      await createTaskHierarchy(taskId, parentId);
    }

    // 3. Return the task
    const dbTask = await queryOne<DBTask>(
      'SELECT * FROM tasks WHERE id = $1',
      [taskId]
    );

    return this.toTaskNode(dbTask!);
  }

  /**
   * Get full task tree
   */
  static async getTree(): Promise<TaskNode[]> {
    // Get all tasks
    const tasks = await query<DBTask>('SELECT * FROM tasks ORDER BY created_at ASC');

    // Build tree structure
    const taskMap = new Map<string, TaskNode>();
    const rootTasks: TaskNode[] = [];

    // First pass: create all nodes
    tasks.forEach((task) => {
      taskMap.set(task.id, this.toTaskNode(task));
    });

    // Second pass: build hierarchy
    tasks.forEach((task) => {
      const node = taskMap.get(task.id)!;

      if (task.parent_id) {
        const parent = taskMap.get(task.parent_id);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(node);
        }
      } else {
        rootTasks.push(node);
      }
    });

    return rootTasks;
  }

  /**
   * Update task status
   */
  static async updateStatus(id: string, status: TaskNode['status']): Promise<void> {
    await execute(
      'UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, id]
    );

    // Update graph
    const task = await queryOne<DBTask>('SELECT * FROM tasks WHERE id = $1', [id]);
    if (task) {
      await upsertTask(id, task.title, status);
    }
  }

  /**
   * Get task by ID
   */
  static async getById(id: string): Promise<TaskNode | null> {
    const task = await queryOne<DBTask>('SELECT * FROM tasks WHERE id = $1', [id]);
    return task ? this.toTaskNode(task) : null;
  }

  /**
   * Get all child tasks (recursive)
   */
  static async getChildren(parentId: string): Promise<TaskNode[]> {
    const children = await query<DBTask>(
      'SELECT * FROM tasks WHERE parent_id = $1',
      [parentId]
    );

    return children.map((task) => this.toTaskNode(task));
  }

  /**
   * Delete task (and all children cascade)
   */
  static async delete(id: string): Promise<void> {
    await execute('DELETE FROM tasks WHERE id = $1', [id]);
    // Cascade delete is handled by DB constraints
  }

  // ========== Helper Methods ==========

  private static toTaskNode(dbTask: DBTask): TaskNode {
    const statusMap: { [key: string]: TaskNode['status'] } = {
      todo: 'pending',
      in_progress: 'active',
      blocked: 'blocked',
      done: 'completed',
    };

    return {
      id: dbTask.id,
      title: dbTask.title,
      status: statusMap[dbTask.status] || 'pending',
      children: [],
    };
  }
}
