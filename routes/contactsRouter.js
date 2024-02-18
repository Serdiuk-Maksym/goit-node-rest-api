import express from 'express';
import {
  getAllContactsWrapped,
  getContactByIdWrapped,
  deleteContactWrapped,
  createContactWrapped,
  updateContactWrapped,
} from '../controllers/contactsControllers.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContactsWrapped);

contactsRouter.get('/:id', getContactByIdWrapped);

contactsRouter.delete('/:id', deleteContactWrapped);

contactsRouter.post('/', createContactWrapped);

contactsRouter.put('/:id', updateContactWrapped);

export default contactsRouter;
