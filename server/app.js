import express from 'express';
import dotenv from 'dotenv';
import { getTodoById } from './database.js'; // Asegúrate de que la ruta sea correcta

// Configurar dotenv
dotenv.config();

// Crear una aplicación Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta para obtener un todo por ID
app.get('/todos/:id', async (req, res) => {
    const todoId = parseInt(req.params.id);
    
    if (isNaN(todoId)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    
    try {
        const rows = await getTodoById(todoId);
        // rows[0] contiene los datos de la consulta
        res.json(rows[0] || {});
    } catch (error) {
        console.error('Error fetching todo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Configurar el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
