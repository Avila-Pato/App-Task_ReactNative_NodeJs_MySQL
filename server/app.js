import express from 'express';
import dotenv from 'dotenv';
import { getTodosByID, getTodo, createTodo, deleteTodo, toggleCompleted, shareTodo, getUserByEmail } from './database.js';

// Configurar dotenv para usar variables de entorno
dotenv.config();

// Crear una instancia de Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas de ejemplo

// Obtener todos los todos de un usuario o compartidos con él
app.get('/todos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const todos = await getTodosByID(id);
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los todos' });
    }
});

// Obtener un todo por su ID
app.get('/todo/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const todo = await getTodo(id);
        if (todo) {
            res.json(todo);
        } else {
            res.status(404).json({ error: 'Todo no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el todo' });
    }
});

// Crear un nuevo todo
app.post('/todo', async (req, res) => {
    try {
        const { user_id, title } = req.body;
        if (!user_id || !title) {
            return res.status(400).json({ error: 'Faltan datos' });
        }
        const newTodo = await createTodo(user_id, title);
        res.status(201).json(newTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el todo' });
    }
});

// Eliminar un todo por su ID
app.delete('/todo/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await deleteTodo(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el todo' });
    }
});

// Toggle completed status de un todo
app.patch('/todo/:id/completed', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { completed } = req.body;
        if (completed === undefined) {
            return res.status(400).json({ error: 'Falta el campo completed' });
        }
        await toggleCompleted(id, completed);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el estado del todo' });
    }
});

// Compartir un todo
app.post('/todo/share', async (req, res) => {
    try {
        const { todo_id, user_id, shared_with_id } = req.body;
        if (!todo_id || !user_id || !shared_with_id) {
            return res.status(400).json({ error: 'Faltan datos' });
        }
        const sharedTodoID = await shareTodo(todo_id, user_id, shared_with_id);
        res.status(201).json({ sharedTodoID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al compartir el todo' });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
