import { dbQuery } from '../db.js';

export class NoteController {
  async listAll(req, res) {
    const userId = req.userId; // Récupérer l'identifiant de l'utilisateur connecté
    try {
      const [results, fields] = await dbQuery('SELECT * FROM notes WHERE userId = ?', [userId]);
      res.status(200).json(results);
    } catch (error) {
      console.error('Error listing notes:', error);
      res.status(500).json({ error: 'Error listing notes' });
    }
  }

  async create(req, res) {
    const userId = req.userId; // Récupérer l'identifiant de l'utilisateur connecté
    const newNote = {
      text: req.body.text,
      userId: userId // Ajouter l'identifiant de l'utilisateur à la nouvelle note
    };
    try {
      const [results, fields] = await dbQuery('INSERT INTO notes (text, userId) VALUES (?, ?)', [newNote.text, newNote.userId]);
      res.status(201).json({ message: 'Note added', results });
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Error creating note' });
    }
  }

  async update(req, res) {
    const userId = req.userId; // Récupérer l'identifiant de l'utilisateur connecté
    const { text } = req.body;
    const noteId = req.params.id;
    try {
      const [results] = await dbQuery('UPDATE notes SET text = ? WHERE id = ? AND userId = ?', [text, noteId, userId]);
      if (results.affectedRows === 0) {
        // Aucune note mise à jour car soit elle n'existe pas, soit elle n'appartient pas à l'utilisateur connecté
        return res.status(404).json({ error: 'Note not found or unauthorized' });
      }
      res.status(200).json({ message: 'Note updated' });
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(500).json({ error: 'Error updating note' });
    }
  }
  

  async destroy(req, res) {
    const userId = req.userId; // Récupérer l'identifiant de l'utilisateur connecté
    const noteId = req.params.id;
    try {
      const [results] = await dbQuery('DELETE FROM notes WHERE id = ? AND userId = ?', [noteId, userId]);
      if (results.affectedRows === 0) {
        // Aucune note supprimée car soit elle n'existe pas, soit elle n'appartient pas à l'utilisateur connecté
        return res.status(404).json({ error: 'Note not found or unauthorized' });
      }
      res.status(200).json({ message: 'Note deleted' });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Error deleting note' });
    }
  }
  
}
