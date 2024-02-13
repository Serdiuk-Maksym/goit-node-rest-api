import { v4 as uuidv4 } from 'uuid';
import { MongoClient } from 'mongodb';

const url =
  'mongodb+srv://serdiukMO:Vfrc1992fcec@cluster0.z162u5v.mongodb.net/';
const dbName = 'db-contacts';
const collectionName = 'contacts';

const client = new MongoClient(url, { useUnifiedTopology: true });

// Підключення до бази даних MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

// Отримання посилання на колекцію
function getCollection() {
  const db = client.db(dbName);
  return db.collection(collectionName);
}

// Отримання списку контактів
export async function listContacts() {
  try {
    await connectDB();
    const collection = getCollection();
    const contacts = await collection.find().toArray();
    return contacts;
  } catch (error) {
    console.error('Error reading contacts data:', error);
    throw error;
  }
}

// Отримання контакту за ідентифікатором
export async function getContactById(contactId) {
  try {
    await connectDB();
    const collection = getCollection();
    const contact = await collection.findOne({ id: contactId });
    return contact;
  } catch (error) {
    console.error('Error fetching contact by id:', error);
    throw error;
  }
}

// Додавання нового контакту
export async function addContact({ name, email, phone }) {
  try {
    await connectDB();
    const collection = getCollection();
    const id = uuidv4().slice(0, 20);
    const newContact = { id, name, email, phone };
    await collection.insertOne(newContact);
    return newContact;
  } catch (error) {
    console.error('Error adding new contact:', error);
    throw error;
  }
}

// Видалення контакту за ідентифікатором
export async function removeContact(contactId) {
  try {
    await connectDB();
    const collection = getCollection();
    const result = await collection.deleteOne({ id: contactId });
    if (result.deletedCount === 0) return null;
    return { id: contactId };
  } catch (error) {
    console.error('Error removing contact:', error);
    throw error;
  }
}

// Оновлення контакту за ідентифікатором
export async function updateContact(contactId, updatedInfo) {
  try {
    await connectDB();
    const collection = getCollection();
    const result = await collection.updateOne(
      { id: contactId },
      { $set: updatedInfo }
    );
    if (result.modifiedCount === 0) return null;
    return { ...updatedInfo, id: contactId };
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
}
