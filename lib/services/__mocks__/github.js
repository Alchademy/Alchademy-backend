const exchangeCodeForToken = async (code) => {
  console.log(`MOCK INVOKED: exchangeCodeForToken(${code})`);
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};

const getGithubProfile = async (token) => {
  console.log(`Mock invoked, getGitHubProfile(${token})`);
  return {
    login: 'rileyjhofftest',
    avatar_url: 'https://avatars.githubusercontent.com/u/109310727?v=4',
    email: null,
  };
};

const checkIfAlchademyMember = async (username) => {
  console.log(`Mock invoked, checkIfAlchademyMember(${username})`);
  return {
    state: 'active',
  };
};

const checkIfAdmin = async (username) => {
  console.log(`Mock invoked, checkIfAdmin(${username})`);
  return {
    state: 'nope',
  };
};

const checkIfInstructor = async (username) => {
  console.log(`Mock invoked, checkIfInstructor(${username})`);
  return {
    state: 'nope',
  };
};

const getTATeams = async () => {
  console.log('Mock invoked, getTATeams()');
  return [
    {
      id: 1,
    },
  ];
};

const checkIfTA = async (username, team_id) => {
  console.log(`Mock invoked, checkIfTA(${username}, ${team_id})`);
  return {
    state: 'active',
  };
};

const getCohortTeams = async () => {
  console.log('Mock invoked, getTATeams()');
  return [
    {
      id: 1,
      name: 'february-2022',
    },
  ];
};

const checkCohortForUser = async (username, team_id) => {
  console.log(`Mock invoked, checkCohortForUser(${username}, ${team_id})`);
  return {
    state: 'active',
  };
};

module.exports = {
  exchangeCodeForToken,
  getGithubProfile,
  checkIfAlchademyMember,
  checkIfAdmin,
  checkIfInstructor,
  getTATeams,
  checkIfTA,
  getCohortTeams,
  checkCohortForUser,
};
