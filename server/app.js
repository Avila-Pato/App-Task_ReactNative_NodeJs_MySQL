import express from 'express';
import dotenv from 'dotenv';
import {
  getTodosByID,
  getTodo,
  createTodo,
  deleteTodo,
  toggleCompleted,
  shareTodo,
  getUserByEmail,
  getUserByID,
  getSharedTodoByID
} from './database.js';
import cors from 'cors';

// Configurar dotenv para usar variables de entorno
dotenv.config();
// Crear una instancia de Express
const app = express();


// Con esta configuración, tu servidor Express permitirá solicitudes desde el origen especificado (http://localhost:3000), 
//aceptará los métodos HTTP listados, y permitirá los encabezados y credenciales configurados.
const corsOption = {
    origin: 'http://localhost:3000', // espedicificar la URL de la aplicación 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // encabezados permitidos
    credentials: true, // habilitar el envío de cookies y encabezados de autenticación por la api
}
//Configurando Cors
app.use(cors(corsOption));
// Middleware para parsear JSON
app.use(express.json());
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

// Obtener un todo compartido por su ID
app.get('/todos/todos_shared/:id', async (req, res) => {
    try {
        const todo = await getSharedTodoByID(req.params.id);
        const author = await getUserByID(todo.user_id);
        const sharedWith = await getUserByID(todo.shared_with_id);
        res.status(200).json({ author, sharedWith });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el todo compartido' });
    }
});

// Crear un nuevo todo
app.post('/todos', async (req, res) => {
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

// Actualizar el estado de completado de un todo
app.put('/todos/:id', async (req, res) => {
    try {
        const { completed } = req.body;
        if (completed === undefined) {
            return res.status(400).json({ error: 'Falta el campo completed' });
        }
        const todo = await toggleCompleted(req.params.id, completed);
        res.status(200).json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el estado del todo' });
    }
});

// Eliminar un todo por su ID
app.delete('/todos/:id', async (req, res) => {
    try {
        await deleteTodo(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el todo' });
    }
});

// Compartir un todo
app.post('/todos/share', async (req, res) => {
    try {
        const { todo_id, user_id, email } = req.body;
        if (!todo_id || !user_id || !email) {
            return res.status(400).json({ error: 'Faltan datos' });
        }
        const userToShare = await getUserByEmail(email);
        if (!userToShare) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
        res.status(201).json(sharedTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al compartir el todo' });
    }
});

// Obtener un usuario por su ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await getUserByID(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
