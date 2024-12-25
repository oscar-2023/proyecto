const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configurar la conexión a PostgreSQL
const pool = new Pool({
  user: 'soporte',
  host: 'localhost',
  database: 'db_prueba',
  password: '1234',
  port: 5432,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Ejemplo de endpoint para manejar registros
app.post('/api/register', async (req, res) => {
  const { nombre, correo_electronico, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo_electronico, password) VALUES ($1, $2, $3) RETURNING id',
      [nombre, correo_electronico, password]
    );
    res.json({ success: true, userId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: 'Error al registrar el usuario' });
  }
});
// leer (read)
// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario por ID
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al obtener el usuario' });
  }
});

// Actualizar un usuario
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, edad, dni, celular, correo_electronico } = req.body;
  try {
    await pool.query(
      'UPDATE usuarios SET nombre = $1, edad = $2, dni = $3, celular = $4, correo_electronico = $5 WHERE id = $6',
      [nombre, edad, dni, celular, correo_electronico, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al actualizar el usuario' });
  }
});

// Eliminar un usuario
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al eliminar el usuario' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});