const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login');
};

const signupPage = (req, res) => {
  res.render('signup');
};

const logout = (req, res) => {
  // Notice this redirect, rather than render!
  res.redirect('/');
};

// Stubbed out for now
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'RAWR! Wrong username / password!' });
    }
    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to save some trouble
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields required!' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };
    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();

    savePromise.then(() => res.json({ redirect: '/maker' }));
    savePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'RAWR! Username already in use.' });
      }
      return res.status(400).json({ error: 'RAWR! An error has occurred.' });
    });
  });
};

module.exports = {
  loginPage,
  login,
  logout,
  signupPage,
  signup,
};
