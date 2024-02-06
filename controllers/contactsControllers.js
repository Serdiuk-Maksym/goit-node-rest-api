import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} from '../services/contactsServices.js';

import HttpError from '../helpers/HttpError.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';

const handleNotFound = (res) => {
  res.status(404).json({ message: 'Not found' });
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error getting all contacts:', error);
    res
      .status(500)
      .json({ error: new HttpError(500, 'Internal Server Error') });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await getContactById(contactId);

    if (!contact) {
      handleNotFound(res);
    } else {
      res.status(200).json(contact);
    }
  } catch (error) {
    console.error('Error getting one contact:', error);
    res.status(500).json({ error: { message: 'Internal Server Error' } });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const deletedContact = await removeContact(contactId);

    if (!deletedContact) {
      handleNotFound(res);
    } else {
      res
        .status(200)
        .json({ message: 'Contact deleted successfully', deletedContact });
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createContact = async (req, res) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const newContact = await addContact(req.body);

    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateContactController = async (req, res) => {
  try {
    const contactId = req.params.id;
    const existingContact = await getContactById(contactId);

    if (!existingContact) {
      return handleNotFound(res);
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updatedContact = await updateContact(contactId, req.body);

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
