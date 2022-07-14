const exchangeCodeForToken = async (code) => {
  console.log(`MOCK INVOKED: exchangeCodeForToken(${code})`);
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};

const getGithubProfile = async (token) => {
  console.log(`Mock invoked, getGitHubProfile(${token})`);
  return {
    login: 'rileyjhofftest',
    avatar_url: 'https://www.placecage.com/gif/200/200',
    email: 'rileyjhoff+1@gmail.com',
  };
};

module.exports = { exchangeCodeForToken, getGithubProfile };
