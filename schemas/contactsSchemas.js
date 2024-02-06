import Joi from 'joi';

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
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export const createContact = async (req, res, next) => {
  try {
    validateBody(createContactSchema)(req, res, next);

    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateContact = async (req, res, next) => {
  try {
    validateBody(updateContactSchema)(req, res, next);

    const contactId = req.params.id;
    const existingContact = await getContactById(contactId);
    if (!existingContact) {
      return res.status(404).json({ message: 'Not found' });
    }

    const updatedContact = await updateContact(contactId, req.body);

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
