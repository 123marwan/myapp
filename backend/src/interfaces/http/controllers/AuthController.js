const { toPublicUser } = require("../presenters/UserPresenter");

function createAuthController({ registerUser, loginUser }) {
  return {
    register: async (req, res) => {
      const result = await registerUser.execute(req.body);
      res.status(201).json({
        token: result.token,
        user: toPublicUser(result.user),
      });
    },

    login: async (req, res) => {
      const result = await loginUser.execute(req.body);
      res.json({
        token: result.token,
        user: toPublicUser(result.user),
      });
    },
  };
}

module.exports = { createAuthController };