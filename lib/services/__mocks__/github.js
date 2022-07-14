const exchangeCodeForToken = async (code) => {
  console.log(`MOCK INVOKED: exchangeCodeForToken(${code})`);
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};

const getGitHubProfile = async (token) => {
  console.log(`Mock invoked, getGitHubProfile(${token})`);
  return {
    login: 'helloGoodbye', 
    avatar_url: 'https://www.placecage.com/gif/200/200',
    email: 'hello@goobye.com'
  };
};

module.exports = { exchangeCodeForToken, getGitHubProfile };