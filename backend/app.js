const express = require('express');
const router = express.Router();
const SocialAccount = require('../models/SocialAccount');

// Get all social accounts
router.get('/', async (req, res) => {
  try {
    const socialAccounts = await SocialAccount.find();
    res.json(socialAccounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one social account
router.get('/:id', getSocialAccount, (req, res) => {
  res.json(res.socialAccount);
});

// Create a social account
router.post('/', async (req, res) => {
  const socialAccount = new SocialAccount({
    name: req.body.name,
    url: req.body.url,
    username: req.body.username,
    password: req.body.password
  });

  try {
    const newSocialAccount = await socialAccount.save();
    res.status(201).json(newSocialAccount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a social account
router.patch('/:id', getSocialAccount, async (req, res) => {
  if (req.body.name != null) {
    res.socialAccount.name = req.body.name;
  }
  if (req.body.url != null) {
    res.socialAccount.url = req.body.url;
  }
  if (req.body.username != null) {
    res.socialAccount.username = req.body.username;
  }
  if (req.body.password != null) {
    res.socialAccount.password = req.body.password;
  }

  try {
    const updatedSocialAccount = await res.socialAccount.save();
    res.json(updatedSocialAccount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a social account
router.delete('/:id', getSocialAccount, async (req, res) => {
  try {
    await res.socialAccount.remove();
    res.json({ message: 'Deleted Social Account' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getSocialAccount(req, res, next) {
  let socialAccount;
  try {
    socialAccount = await SocialAccount.findById(req.params.id);
    if (socialAccount == null) {
      return res.status(404).json({ message: 'Cannot find social account' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.socialAccount = socialAccount;
  next();
}

module.exports = router;

const app = express();
app.use('/api/social-accounts', require('./routes/socialAccounts'));