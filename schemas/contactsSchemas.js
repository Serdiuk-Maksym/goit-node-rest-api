import Joi from 'joi';
import Contact from './models/contact.js'; // Імпорт моделі контакту зі схемою

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
}).min(1);

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  };
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = new Contact({ name, email, phone });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const { name, email, phone } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { name, email, phone },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error('Error getting contact by id:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
