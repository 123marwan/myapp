const { toPublicUser } = require("../presenters/UserPresenter");

function createUserController({ getCurrentUser, listUsers }) {
  return {
    me: async (req, res) => {
      const user = await getCurrentUser.execute({ userId: req.userId });
      res.json(toPublicUser(user));
    },

    list: async (_req, res) => {
      const users = await listUsers.execute();
      res.json(users.map(toPublicUser));
    },
  };
}

module.exports = { createUserController };