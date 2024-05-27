const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());




// Conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejs'
});

// Conectar a la base de datos
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Crear tabla de usuarios si no existe
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE
  )
`;
connection.query(createUsersTable, (err, results) => {
  if (err) {
    console.error('Error creating users table:', err);
  } else {
    console.log('Users table created or already exists.');
  }
});

// Rutas CRUD

// Crear Usuario
app.post('/users', (req, res) => {
  const { name, email, password, username } = req.body;
  const query = 'INSERT INTO users (name, email, password, username) VALUES (?, ?, ?, ?)';
  connection.query(query, [name, email, password, username], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(400).send({ error: 'El nombre de usuario o email deben ser únicos' });
      } else {
        res.status(400).send(err);
      }
    } else {
      res.status(201).send({ id: results.insertId, name, email, password, username });
    }
  });
});

// Leer Usuarios
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

// Leer Usuario por ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length === 0) {
      res.status(404).send({ error: 'Usuario no encontrado' });
    } else {
      res.status(200).send(results[0]);
    }
  });
});

// Actualizar Usuario
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password, username } = req.body;
  const query = 'UPDATE users SET name = ?, email = ?, password = ?, username = ? WHERE id = ?';
  connection.query(query, [name, email, password, username, id], (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else if (results.affectedRows === 0) {
      res.status(404).send({ error: 'Usuario no encontrado' });
    } else {
      res.status(200).send({ id, name, email, password, username });
    }
  });
});

// Eliminar Usuario
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.affectedRows === 0) {
      res.status(404).send({ error: 'Usuario no encontrado' });
    } else {
      res.status(200).send({ message: 'Usuario eliminado' });
    }
  });
});

// Iniciar el Servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

