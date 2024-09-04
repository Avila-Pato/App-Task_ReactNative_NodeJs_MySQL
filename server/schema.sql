CREATE DATABASE tareas_db;

USE tareas_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) 
);

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    completed BOOLEAN DEFAULT false,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- todos compartidos
CREATE TABLE todos_shared (
    id INT AUTO_INCREMENT PRIMARY KEY,
    todo_id INT,
    user_id INT,
    todos_shared_id INT,
    FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (todos_shared_id) REFERENCES users(id) ON DELETE CASCADE
);


-- INSERT 3 datos 
INSERT INTO tareas (name, email, password) VALUES('Juan', 'juan@gmail.com', '123456');
INSERT INTO tareas (name, email, password) VALUES('Pedro', 'pedro@gmail.com', '123456');
INSERT INTO tareas (name, email, password) VALUES('Maria', 'maria@gmail.com', '123456');

INSERT INTO todos(title, user_id) 
VALUES
-- todos del usuario 1
('🚶‍♂️ Go and run in the morning', 1),
('🪥 Brush your teeth', 1),
('☕ Have a cup of coffee', 1),
('📚 Read a book for 30 minutes', 1),
('💪 Do a workout', 1),
('🛁 Take a shower', 1),
('📝 Write a journal entry', 1),
('🎵 Listen to your favorite music', 1),
('🍽️ Have a healthy breakfast', 1),
('🛌 Go to bed early', 1);

--share todo 1 de user 1 con user 2
INSERT INTO todos_shared(todo_id, user_id, todos_shared_id)
VALUES(1,1,2);

--Seleccionar todos incluyendo los compartidos de todos por usuario
SELECT todos.*, todos_shared.user_id, todos_shared.todos_shared_id
FROM todos
LEFT JOIN todos_shared ON todos.id = todos_shared.todo_id
WHERE todos.user_id = [user_id] OR todos_shared.todos_shared_id = [user_id];
 
