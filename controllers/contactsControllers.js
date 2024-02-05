import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} from '../services/contactsServices.js';

import HttpError from '../helpers/HttpError.js';

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
      throw new HttpError('ContactNotFound', 'Contact not found', {
        contactId,
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error('Error getting one contact:', error);
    res.status(500).json({
      error: new HttpError('InternalServerError', 'Internal Server Error'),
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const deletedContact = await removeContact(contactId);

    if (!deletedContact) {
      throw new HttpError(404, 'Contact not found');
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    res
      .status(500)
      .json({ error: new HttpError(500, 'Internal Server Error') });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact({ name, email, phone });

    res.status(201).json(newContact);
  } catch (error) {
    res
      .status(500)
      .json({ error: new HttpError(500, 'Internal Server Error') });
  }
};

export const updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const { name, email, phone } = req.body;

    const existingContact = await getContactById(contactId);

    if (!existingContact) {
      throw new HttpError(404, 'Contact not found');
    }

    const updatedContact = { ...existingContact, name, email, phone };

    res.status(200).json(updatedContact);
  } catch (error) {
    res
      .status(500)
      .json({ error: new HttpError(500, 'Internal Server Error') });
  }
};
