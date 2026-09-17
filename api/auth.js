module.exports = (req, res) => {
    const clientId = process.env.OAUTH_CLIENT_ID;
    const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
    res.writeHead(302, { Location: authorizeUrl });
    res.end();
};
