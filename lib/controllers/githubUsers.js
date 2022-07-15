const { Router } = require('express');
const User = require('../models/User');
const {
  exchangeCodeForToken,
  getGithubProfile,
  checkIfAlchademyMember,
  checkIfAdmin,
  checkIfInstructor,
  getTATeams,
  checkIfTA,
  getCohortTeams,
  checkCohortForUser,
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
      if (alchademyCheck.state !== 'active')
        return res.redirect('/github/sessions');

      // set a default role of student
      let role = 1;
      // check to see if user is an admin
      const adminCheck = await checkIfAdmin(githubProfile.login);
      if (adminCheck.role === 'maintainer') {
        role = 4;
      } else {
        // if not an admin, check to see if user is an instructor
        const instructorCheck = await checkIfInstructor(githubProfile.login);
        if (instructorCheck.state === 'active') {
          role = 3;
        } else {
          // if not an admin or instructor, checks to see if user is a TA
          const TATeams = await getTATeams();
          for (const team of TATeams) {
            const TACheck = await checkIfTA(githubProfile.login, team.id);
            if (TACheck.state === 'active') {
              role = 2;
              break;
            }
          }
        }
      }

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

      // check if user exists in the users table
      let user = await User.findByUsername(githubProfile.login);
      if (!user) {
        // if the user does not exist, insert them into the users table
        user = await User.insert({
          username: githubProfile.login,
          email: githubProfile.email,
          avatar: githubProfile.avatar_url,
          role,
        });
        // loop through cohorts array and add foreign relation to user_to_cohort table
        for (const cohort of cohorts) {
          await User.addUserCohort(user, cohort);
        }
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

  .put('/:id', authenticate, async (req, res, next) => {
    const updatedUser = await User.updateByID(req.user.id);
    res.json(updatedUser);
  })

  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
