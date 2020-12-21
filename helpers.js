const bcrypt = require('bcrypt');
const saltRounds = 10;

// Add new user obj to users database
const addNewUser = (email, password, usersDB) => {
  const newUserID = generateNewKey();

  const newUserObj = {
    id: newUserID,
    email,
    password: bcrypt.hashSync(password, saltRounds)
  };

  usersDB[newUserID] = newUserObj;
  return newUserID;
};

// Lookup user by id
const findUserByID = (id, usersDB) => {
  for (const user in usersDB) {
    if (usersDB[user].id === id) {
      return usersDB[user];
    }
  }
  return false;
};

// Lookup user by email
const findUserByEmail = (email, usersDB) => {
  for (const user in usersDB) {
    if (usersDB[user].email === email) {
      return usersDB[user];
    }
  }
  return false;
};

// Verify user authentication by email and password
const authenticateUser = (email, password, usersDB) => {
  const user = findUserByEmail(email, usersDB);
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  } else {
    return false;
  }
};

// Filter matched URLs by user
const urlsForUser = (id, urlDatabase) => {
  let matchedUrls = {};
  for (const url in urlDatabase) {
    if ((urlDatabase[url].id) === id) {
      matchedUrls[url] = urlDatabase[url];
    }
  }
  return matchedUrls;
};

// Generate a random string to serve as shortURL
const generateNewKey = () => {
  let newKey = '';
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charsLength = chars.length;
  for (let i = 0; i < 6; i++) {
    newKey += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return newKey;
};

module.exports = { addNewUser, findUserByID, findUserByEmail, authenticateUser, urlsForUser, generateNewKey };