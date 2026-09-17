module.exports = async (req, res) => {
    const { code, error, error_description } = req.query;
    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;

    if (error) {
        res.status(400).send(`Authentication error: ${error_description || error}`);
        return;
    }

    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await tokenResponse.json();

    if (data.error || !data.access_token) {
        res.status(400).send(`Authentication error: ${data.error_description || "no access token returned"}`);
        return;
    }

    const payload = JSON.stringify({ token: data.access_token, provider: "github" });

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`<!DOCTYPE html>
<html>
<body>
<script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage(
      "authorization:github:success:" + ${JSON.stringify(payload)},
      e.origin
    );
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body>
</html>`);
};
