import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, '..', 'db', 'contacts.json');

export const listContacts = async () => {
  try {
    console.log('Reading contacts data from file...');
    const data = await fs.readFile(contactsPath, 'utf-8');
    console.log('Parsing contacts data...');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Contacts file not found. Returning an empty array.');
      return [];
    }
    console.error('Error reading contacts data:', error);
    throw error;
  }
};

export const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId) || null;
};

export const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();

  const newContact = { name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
};

export const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );

  if (contactIndex === -1) {
    return null;
  }

  const contactToRemove = contacts[contactIndex];
  contacts.splice(contactIndex, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contactToRemove;
};

export const updateContact = async (contactId, updatedInfo) => {
  try {
    // Отримуємо список контактів
    const contacts = await listContacts();

    // Знаходимо індекс контакту, який потрібно оновити
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    // Перевіряємо, чи контакт існує
    if (contactIndex === -1) {
      return null; // Якщо контакт не знайдено, повертаємо null
    }

    // Оновлюємо інформацію про контакт
    contacts[contactIndex] = { ...contacts[contactIndex], ...updatedInfo };

    // Записуємо оновлений список контактів у файл
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    // Повертаємо оновлену інформацію про контакт
    return contacts[contactIndex];
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};
