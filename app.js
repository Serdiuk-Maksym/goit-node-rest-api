import express from 'express';
import mongoose from 'mongoose';
import HttpError from './helpers/HttpError.js';
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} from './services/contactsServices.js';

const app = express();

mongoose.connect(
  'mongodb+srv://serdiukMO:Vfrc1992fcec@cluster0.z162u5v.mongodb.net/myDatabase/db-contacts/',
  {}
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', () => {
  console.log('Database connected successfully');
});

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await listContacts();
    console.log('Успішно отримано всі контакти');
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error getting all contacts:', error);
    res
      .status(500)
      .json({ error: new HttpError(500, 'Internal Server Error') });
  }
});

app.get('/api/contacts/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await getContactById(contactId);

    if (!contact) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.status(200).json(contact);
    }
  } catch (error) {
    console.error('Error getting one contact:', error);
    res.status(500).json({ error: { message: 'Internal Server Error' } });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    const deletedContact = await removeContact(contactId);

    if (!deletedContact) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res
        .status(200)
        .json({ message: 'Contact deleted successfully', deletedContact });
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const newContact = new Contact({ name, email, phone, favorite });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    const { name, email, phone, favorite } = req.body;
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { name, email, phone, favorite },
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
});

app.patch('/api/contacts/:contactId/favorite', async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const { favorite } = req.body;

    const updatedContact = await updateStatusContact(contactId, { favorite });

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    console.error('Error updating favorite status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Функція для оновлення статусу контакту
async function updateStatusContact(contactId, updateData) {
  try {
    const existingContact = await Contact.findById(contactId);

    if (!existingContact) {
      return null;
    }

    existingContact.favorite = updateData.favorite;
    await existingContact.save();

    return existingContact;
  } catch (error) {
    throw error;
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
