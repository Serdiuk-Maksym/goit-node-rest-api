import * as contactsService from '../services/contactsServices.js';
import { createContactSchema } from '../schemas/contactsSchemas.js';
import validateBody from '../helpers/validateBody.js';

export const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const contacts = await contactsService.listContacts(
      {},
      '-createdAt -updatedAt',
      { skip, limit }
    );
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);

    if (!contact) {
      return res.status(404).json({ message: 'Not Found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    res.status(400).json({ error: 'Internal Server Error' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id);

    if (deletedContact) {
      res.json(deletedContact);
    } else {
      res.status(404).json({ error: 'Not Found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createContact = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Missing request body' });
    }

    const { error } = createContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const newContact = await contactsService.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;


    // Перевірка, чи тіло запиту не є порожнім
    if (Object.keys(body).length === 0) {
      return res.status(400).json({ error: 'No data provided for update' });
    }

    const { error: validationError } = validateBody(body);
    if (validationError) {
      return res.status(400).json({ error: validationError.message });

    }

    if (!body || Object.keys(body).length === 0) {
      return res
        .status(400)
        .json({ message: 'Body must have at least one field' });
    }

    const { error } = updateContactSchema.validate(body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    console.log('Attempting to update contact with id:', id);

    const updatedContact = await contactsService.updateContactById(id, body); // Зміни тут

    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }

    console.log('Contact updated successfully, returning updated contact...');
    res.status(200).json({ message: 'Contact updated successfully' });
  } catch (error) {
    console.error('Error occurred in updateContact controller:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;


    if (favorite === undefined) {
      return res.status(400).json({ error: 'No value provided for update' });

    }

    const updatedContact = await contactsService.updateFavorite(id, favorite);

    if (!updatedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update favorite status' });
  }
};
