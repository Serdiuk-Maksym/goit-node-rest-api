import express from 'express';
import {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} from '../controllers/contactsControllers.js';
import validateBody from '../helpers/validateBody.js';
import { createContactSchema } from '../schemas/contactsSchemas.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', getContactById);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.post('/', validateBody(createContactSchema), createContact);

contactsRouter.put('/:id', updateContact);

contactsRouter.patch('/:id/', updateFavorite);

export default contactsRouter;
