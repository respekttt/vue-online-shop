const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', 
  password: 'postrage', 
  port: 5432,
});


app.get('/api/products', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id, 
        p.name AS title, 
        p.price, 
        p.image, 
        c.name AS category 
      FROM products p
      JOIN categories c ON p.category_id = c.id
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Товар не знайдено' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, category_id, price, image, description, stock_quantity } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (name, category_id, price, image, description, stock_quantity) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, category_id, price, image, description || '', stock_quantity || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка при створенні товару' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category_id, price, image, description, stock_quantity } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE products 
       SET name = $1, category_id = $2, price = $3, image = $4, description = $5, stock_quantity = $6
       WHERE id = $7`,
      [name, category_id, price, image, description, stock_quantity, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Товар не знайдено' });
    }

    res.json({ message: 'Товар оновлено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка при оновленні' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Товар не знайдено' });
    }

    res.json({ message: 'Товар видалено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера при видаленні товару' });
  }
});


app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, first_name AS name, email FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Користувача не знайдено' });
    
    const user = result.rows[0];
    res.json({
      id: user.id,
      name: user.first_name, 
      email: user.email,
      password: user.password_hash 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body; 
  
  try {
    const result = await pool.query(
      'UPDATE users SET first_name = $1, email = $2 WHERE id = $3',
      [name, email, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    res.json({ message: 'Оновлено успішно' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    res.json({ message: 'Користувача видалено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера при видаленні' });
  }
});


app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Такий користувач вже існує' });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      'INSERT INTO users (first_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, first_name, email',
      [name, email, hash]
    );
    
    const dbUser = newUser.rows[0];
    res.json({ id: dbUser.id, name: dbUser.first_name, email: dbUser.email });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Користувача не знайдено' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Невірний пароль' });
    }

    res.json({ 
      message: 'Успішний вхід', 
      user: { 
        id: user.id, 
        name: user.first_name,
        email: user.email,
        role: user.role 
      } 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});


app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories'); 
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.get('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Категорію не знайдено' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.post('/api/categories', async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Назва категорії є обов’язковою' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || '']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка при створенні категорії' });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Категорію не знайдено' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка при оновленні категорії' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Категорію не знайдено' });
    }

    res.json({ message: 'Категорію видалено' });
  } catch (err) {
    console.error(err);
    if (err.code === '23503') {
      return res.status(400).json({ error: 'Неможливо видалити категорію, оскільки до неї прив’язані товари.' });
    }
    res.status(500).json({ error: 'Помилка сервера при видаленні' });
  }
});

app.listen(port, () => {
  console.log(`Сервер працює на http://localhost:${port}`);
});