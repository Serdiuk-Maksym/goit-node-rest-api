import * as contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);

    if (contact) {
      res.json(contact);
    } else {
      throw new HttpError(404, 'Not Found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id);

    if (deletedContact) {
      res.json(deletedContact);
    } else {
      throw new HttpError(404, 'Not Found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createContact = async (req, res) => {
  try {
    const { _id: owner } = req.user;
    const newContact = await contactsService.addContact({ ...req.body, owner });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedContact = await contactsService.updateContactById(
      id,
      req.body
    );

    if (!updatedContact) {
      throw new HttpError(404, 'Not Found');
    }
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedContact = await contactsService.updateStatusContact(
      id,
      req.body
    );

    if (!updatedContact) {
      throw new HttpError(404, 'Not Found');
    }
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
