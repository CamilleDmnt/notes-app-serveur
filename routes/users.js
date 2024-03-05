import { Router } from 'express';
import { dbQuery } from '../db';
const router = Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', async function (req, res) {
  // const username = req.body.username;
  // const password = req.body.password;

  const {username, password} = req.body;

  const [result] = await dbQuery.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
  res.json({message: 'user created', result: result });
});

export default router;
