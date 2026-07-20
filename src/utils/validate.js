const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName) throw new Error("First Name is required");
  if (!lastName) throw new Error("Last Name is required");
  if (!validator.isEmail(emailId)) throw new Error("Email must be valid");
  if (!validator.isStrongPassword(password)) throw new Error("Password must be strong");
};

const validateUserEditData = (req) => {
  const allowedFields = ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl"];
  const isValid = Object.keys(req.body).every((field) => allowedFields.includes(field));
  return isValid;
};

const validatePassword = (password) => {
  if (!validator.isStrongPassword(password)) throw new Error("Password must be strong");
}

module.exports = { validateSignupData, validateUserEditData, validatePassword };
