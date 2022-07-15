const exchangeCodeForToken = async (code) => {
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};

const getGithubProfile = async () => {
  return {
    login: 'rileyjhofftest',
    avatar_url: 'https://avatars.githubusercontent.com/u/109310727?v=4',
    email: null,
  };
};

const checkIfAlchademyMember = async () => {
  return {
    state: 'active',
  };
};

const checkIfAdmin = async () => {
  return {
    state: 'nope',
  };
};

const checkIfInstructor = async () => {
  return {
    state: 'nope',
  };
};

const getTATeams = async () => {
  return [
    {
      id: 1,
    },
  ];
};

const checkIfTA = async () => {
  return {
    state: 'active',
  };
};

const getCohortTeams = async () => {
  return [
    {
      id: 1,
      name: 'february-2022',
    },
  ];
};

const checkCohortForUser = async () => {
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
