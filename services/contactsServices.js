import { nanoid } from 'nanoid';
import Contact from '../models/contact.js';

async function listContacts() {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error('Error listing contacts:', error);
    throw error;
  }
}

async function getContactById(id) {
  const contact = await Contact.findById(id);
  return contact || null;
}

async function removeContact(id) {
  const removedContact = await Contact.findByIdAndDelete(id);
  return removedContact || null;
}

async function addContact(data) {
  try {
    const newContact = await Contact.create({
      id: nanoid(),
      ...data,
    });
    return newContact;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw new Error('Error creating contact');
  }
}

async function updateContactById(id, data) {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    return updatedContact || null;
  } catch (error) {
    console.error('Error updating contact by id:', error);
    return null;
  }
}

async function updateFavorite(id, favorite) {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return null;
    }

    return updatedContact;
  } catch (error) {
    throw new Error('Failed to update favorite status');
  }
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
  updateFavorite,
};
