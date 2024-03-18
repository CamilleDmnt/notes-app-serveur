import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Router } from 'express';
import { dbQuery } from '../db.js';

const router = Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', async function (req, res) {
  // const username = req.body.username;
  // const password = req.body.password;
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await dbQuery('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
  res.json({ message: 'user created', result: result });
});
router.post('/login', async function (req, res) {
  const { username, password } = req.body;
  // rechercher le user 
  const [result] = await dbQuery("SELECT * FROM users WHERE username = ?", [username]);
  const user = result[0];
  if (!user) {
    return res.status(401).json({ error: 'Authentification failed' })
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Authentification failed' });
  }
  // clé privée
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ message: 'ok', token: token });
});

export default router;