const fsp = require("fs/promises");
const shortid = require("shortid");
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

const updateContactList = async (contacts) =>
  await fsp.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const listContacts = async () => {
  const contacts = await fsp.readFile(contactsPath);
  console.log(contacts);
  const result = JSON.parse(contacts);
  return result;
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();

  const contact = contacts.find((contact) => contact.id === contactId);
  if (!contact) {
    throw new Error("The contact is not found");
  }
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();

  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    throw new Error("The contact is not found");
  }

  contacts.splice(index, 1);

  await updateContactList(contacts);

  return contacts[index];
};

const addContact = async (name, email, phone) => {
  const contacts = await listContacts();

  const newContact = {
    id: shortid.generate(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);

  await updateContactList(contacts);
  return newContact;
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
};
