const fetch = require('cross-fetch');

const exchangeCodeForToken = async (code) => {
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ client_id, client_secret, code }),
  });

  const resp = await response.json();

  return resp.access_token;
};

const getGithubProfile = async (token) => {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  return response.json();
};

const checkIfAlchademyMember = async (username) => {
  const response = await fetch(
    `https://api.github.com/orgs/Alchademy/memberships/${username}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ALCHADEMY_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  return response.json();
};

const getAllAlchademyTeams = async () => {
  const response = await fetch('https://api.github.com/orgs/Alchademy/teams', {
    headers: {
      Authorization: `Bearer ${process.env.ALCHADEMY_ACCESS_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  return response.json();
};

const checkIfAdmin = async (username) => {
  const response = await fetch(
    `https://api.github.com/orgs/Alchademy/teams/staff/memberships/${username}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ALCHADEMY_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  return response.json();
};

const checkIfInstructor = async (username) => {
  const response = await fetch(
    `https://api.github.com/orgs/Alchademy/teams/instructional-team/memberships/${username}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ALCHADEMY_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  return response.json();
};

const getTATeams = async () => {
  const response = await fetch(
    'https://api.github.com/orgs/Alchademy/teams/teaching-assistants/teams',
    {
      headers: {
        Authorization: `Bearer ${process.env.ALCHADEMY_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  return response.json();
};

const checkIfTA = async (username, team_id) => {
  const response = await fetch(
    `https://api.github.com/organizations/${process.env.ALCHADEMY_GITHUB_ID}/team/${team_id}/memberships/${username}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ALCHADEMY_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  return response.json();
};

const getTAMembers = async (team_id) => {
  const response = await fetch(
    `https://api.github.com/organizations/${process.env.ALCHADEMY_GITHUB_ID}/team/${team_id}/members`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ALCHADEMY_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  return response.json();
};

const getCohortTeams = async () => {
  const response = await fetch(
    'https://api.github.com/orgs/Alchademy/teams/students/teams',
    {
      headers: {
        Authorization: `Bearer ${process.env.ALCHADEMY_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  return response.json();
};

const checkCohortForUser = async (username, team_id) => {
  const response = await fetch(
    `https://api.github.com/organizations/${process.env.ALCHADEMY_GITHUB_ID}/team/${team_id}/memberships/${username}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ALCHADEMY_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  return response.json();
};

const getCohortMembers = async (team_id) => {
  const response = await fetch(
    `https://api.github.com/organizations/${process.env.ALCHADEMY_GITHUB_ID}/team/${team_id}/members`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ALCHADEMY_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  return response.json();
};

module.exports = {
  exchangeCodeForToken,
  getGithubProfile,
  checkIfAlchademyMember,
  getAllAlchademyTeams,
  checkIfAdmin,
  checkIfInstructor,
  getTATeams,
  checkIfTA,
  getCohortTeams,
  checkCohortForUser,
  getTAMembers,
  getCohortMembers,
};
