const { Router } = require('express');
const User = require('../models/User');
const {
  exchangeCodeForToken,
  getGithubProfile,
} = require('../services/github');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })
  .get('/callback', async (req, res, next) => {
    try {
      const { code } = req.query;
      const githubToken = await exchangeCodeForToken(code);
      const githubProfile = await getGithubProfile(githubToken);
      let user = await User.findByUsername(githubProfile.login);
      if (!user) {
        user = await User.insert({
          username: githubProfile.login,
          email: githubProfile.email,
          avatar: githubProfile.avatar_url,
        });
      }
      const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .redirect('/github/dashboard');
    } catch (e) {
      next(e);
    }
  })
  .get('/dashboard', authenticate, async (req, res) => {
    res.json(req.user);
  })
  
  .delete('/sessions', (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME).json({ success: true, message: 'Signed out successfully!' });
  });
