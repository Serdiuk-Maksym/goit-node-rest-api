import Contact from '../schemas/contactsSchemas.js';

import HttpError from '../helpers/HttpError.js';

const handleNotFound = (res) => {
  res.status(404).json({ message: 'Not found' });
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
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
    const contact = await Contact.findById(contactId);

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
    const deletedContact = await Contact.findByIdAndDelete(contactId);

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

    const { name, email, phone, favorite } = req.body;

    const existingContact = await Contact.findOne({ email });
    if (existingContact) {
      return res.status(400).json({ message: 'This contact already exists' });
    }

    const newContact = new Contact({ name, email, phone, favorite });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateContactController = async (req, res) => {
  try {
    const contactId = req.params.id;
    const existingContact = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    );

    if (!existingContact) {
      return handleNotFound(res);
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json(existingContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
