const { assert } = require('chai');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const { addNewUser,findUserByID, findUserByEmail, authenticateUser, urlsForUser } = require('../helpers.js');

const testUrlDatabase = {
  'c2CVn2': { longURL: 'http://www.lighthouselabs.ca', shortURL: 'c2CVn2', id: 'userRandomID' },
  '8g5ucK': { longURL: 'http://www.facebook.com', shortURL: '8g5ucK', id: 'user2RandomID' },
  't1h2cN': { longURL: 'https://www.tourismthailand.org', shortURL: 't1h2cN', id: 'userRandomID' }
};

const testUsers = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'user@example.com',
    password: bcrypt.hashSync('purple-monkey-dinosaur', saltRounds)
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: bcrypt.hashSync('dishwasher-funk', saltRounds)
  }
};

describe('addNewUser', function() {
  it('should return ok if new user successfully register', function() {
    const password = bcrypt.hashSync('time-for-Netflix', saltRounds);
    const user = addNewUser('bee@test.com', password, testUsers);
    assert.isOk(user, 'user successfully registered');
  });
});

describe('findUserByID', function() {
  it('should return a user with valid id', function() {
    const user = findUserByID('user2RandomID', testUsers);
    const expectedOutput = 'user2RandomID';
    assert.equal(user.id, expectedOutput);
  });
});

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail('user@example.com', testUsers);
    const expectedOutput = 'userRandomID';
    assert.equal(user.id, expectedOutput);
  });

  it('should return false if email does not exist in the user database', function() {
    const user = findUserByEmail('user@notbelongs.com', testUsers);
    assert.isFalse(user, 'user email is invalid');
  });
});

describe('authenticateUser', function() {
  it('should return an authenticated user with valid email and password', function() {
    const user = authenticateUser('user@example.com', 'purple-monkey-dinosaur', testUsers);
    const expectedOutput = 'userRandomID';
    assert.equal(user.id, expectedOutput);
  });

  it('should return false if email and/or password do not exist in the user database', function() {
    const user = authenticateUser('user@example.com', 'not-valid-pwd', testUsers);
    assert.isFalse(user, 'user email and/or password is invalid');
  });
});

describe('urlsForUser', function() {
  it('should return matched URL objects bolongs to the valid user ID', function() {
    const urls = urlsForUser('userRandomID', testUrlDatabase);
    const expectedOutput = {
      'c2CVn2': { longURL: 'http://www.lighthouselabs.ca', shortURL: 'c2CVn2', id: 'userRandomID' },
      't1h2cN': { longURL: 'https://www.tourismthailand.org', shortURL: 't1h2cN', id: 'userRandomID' }
    };
    assert.deepEqual(urls, expectedOutput);
  });

  it('should NOT return matched URL objects if user ID is invalid', function() {
    const urls = urlsForUser('user2RandomID', testUrlDatabase);
    const expectedOutput = {
      'c2CVn2': { longURL: 'http://www.lighthouselabs.ca', shortURL: 'c2CVn2', id: 'userRandomID' },
      't1h2cN': { longURL: 'https://www.tourismthailand.org', shortURL: 't1h2cN', id: 'userRandomID' }
    };
    assert.notDeepEqual(urls, expectedOutput);
  });
});