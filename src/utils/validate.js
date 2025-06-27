const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName) throw new Error("First Name is required");
  if (!lastName) throw new Error("Last Name is required");
  if (!validator.isEmail(emailId)) throw new Error("Email must be valid");
  if (!validator.isStrongPassword(password)) throw new Error("Password must be strong");
};

module.exports = { validateSignupData };
