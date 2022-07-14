const { Router } = require('express');
const User = require('../models/User');
const {
  exchangeCodeForToken,
  getGithubProfile,
  checkIfAlchademyMember,
  // getAllAlchademyTeams,
  checkIfInstructor,
  getTATeams,
  checkIfTA,
  getCohortTeams,
  checkCohortForUser,
  checkIfAdmin,
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

      // makes sure user is a part of the Alchademy organization
      const alchademyCheck = await checkIfAlchademyMember(githubProfile.login);
      if (alchademyCheck.state !== 'active') return res.status(403);

      // define an empty role string that is updated as checks are carried out
      let role = '';
      // check to see if user is an admin
      const adminCheck = await checkIfAdmin(githubProfile.login);
      if (adminCheck.state === 'active') {
        role = 'Admin';
      } else {
        // check to see if user is an instructor
        const instructorCheck = await checkIfInstructor(githubProfile.login);
        if (instructorCheck.state === 'active') {
          role = 'Teacher';
        } else {
          // checks to see if user is a TA
          const TATeams = await getTATeams();
          // const mappedTATeams = TATeams.map((team) => team.id);
          for (const team of TATeams) {
            const TACheck = await checkIfTA(githubProfile.login, team.id);
            if (TACheck.state === 'active') {
              role = 'TA';
              break;
            }
          }
          // if user has not been assigned an admin or TA role, then assign student role
          if (role === '') {
            role = 'Student';
          }
        }
      }
      console.log(role);

      // find cohorts for people
      // gather all student teams from github
      const studentTeams = await getCohortTeams();
      // define an empty array to hold info for each cohort
      const cohortCheck = [];
      for (const team of studentTeams) {
        // check each cohort for the user
        const cohort = await checkCohortForUser(githubProfile.login, team.id);
        // push the return of each check to the cohortCheck array
        cohortCheck.push(cohort);
      }
      // define an empty array to hold onto the name of the cohorts that the user belongs to
      const cohorts = [];
      for (let i = 0; i < cohortCheck.length; i++) {
        // if the user was found as active in the cohortCheck array, push the name of that github team to the cohort array
        if (cohortCheck[i].state === 'active') {
          cohorts.push(studentTeams[i].name);
        }
      }
      console.log(cohorts);

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
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
