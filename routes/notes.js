import { Router } from 'express';
import { NoteController } from '../controllers/note-controller.js';
import { verifyToken } from '../middleware/auth-middleware.js'; // Importe correctement le middleware d'authentification

const router = Router();
const noteController = new NoteController();

/* GET notes listing. */
router.get('/', verifyToken, function(req, res, next) {
  noteController.listAll(req, res);
});

//  create a new note
router.post('/', verifyToken, function(req, res) {
  noteController.create(req, res);
});

// update a note
router.put('/:id', verifyToken, (req, res) => noteController.update(req, res));

// delete a note
router.delete('/:id',  verifyToken, function(req, res) {
  console.log('access to delete action with id: ', req.params.id );
  noteController.destroy(req, res);
});

export default router;
