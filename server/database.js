import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();

export async function getTodosByID(id) {
  try {
    const [rows] = await pool.query(
      `
      SELECT todos.*, shared_todos.shared_with_id
      FROM todos
      LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
      WHERE todos.user_id = ? OR shared_todos.shared_with_id = ?
    `,
      [id, id]
    );
    return rows;
  } catch (error) {
    console.error('Error getting todos by ID:', error);
    throw error;
  }
}

export async function getTodo(id) {
  try {
        // la centencia ?`, [id] evita ataques de inyeccion de sql
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('Error getting todo by ID:', error);
    throw error;
  }
}

export async function getSharedTodoByID(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM shared_todos WHERE todo_id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('Error getting shared todo by ID:', error);
    throw error;
  }
}

export async function getUserByID(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

export async function createTodo(user_id, title) {
  try {
    const [result] = await pool.query(
      `
      INSERT INTO todos (user_id, title)
      VALUES (?, ?)
    `,
      [user_id, title]
    );
    const todoID = result.insertId;
    return getTodo(todoID);
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
}

export async function deleteTodo(id) {
  try {
    const [result] = await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    return result;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}

export async function toggleCompleted(id, value) {
  try {
    const newValue = value === true ? 1 : 0;
    const [result] = await pool.query(
      `
      UPDATE todos
      SET completed = ? 
      WHERE id = ?;
    `,
      [newValue, id]
    );
    return result;
  } catch (error) {
    console.error('Error toggling completion:', error);
    throw error;
  }
}

export async function shareTodo(todo_id, user_id, shared_with_id) {
  try {
    const [result] = await pool.query(
      `
      INSERT INTO shared_todos (todo_id, user_id, shared_with_id) 
      VALUES (?, ?, ?);
    `,
      [todo_id, user_id, shared_with_id]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error sharing todo:', error);
    throw error;
  }
}
