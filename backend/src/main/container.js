const { MongoUserRepository } = require("../infrastructure/repositories/MongoUserRepository");
const { BcryptPasswordHasher } = require("../infrastructure/security/BcryptPasswordHasher");
const { JwtTokenService } = require("../infrastructure/security/JwtTokenService");

const { RegisterUser } = require("../application/use-cases/auth/RegisterUser");
const { LoginUser } = require("../application/use-cases/auth/LoginUser");
const { GetCurrentUser } = require("../application/use-cases/user/GetCurrentUser");
const { ListUsers } = require("../application/use-cases/user/ListUsers");

const { createAuthController } = require("../interfaces/http/controllers/AuthController");
const { createUserController } = require("../interfaces/http/controllers/UserController");
const { createAuthMiddleware } = require("../interfaces/http/middlewares/authMiddleware");

function buildContainer(config) {
  // Infrastructure adapters
  const userRepository = new MongoUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService({
    secret: config.jwtSecret,
    expiresIn: config.jwtExpiresIn,
  });

  // Application use cases
  const registerUser = new RegisterUser({ userRepository, passwordHasher, tokenService });
  const loginUser = new LoginUser({ userRepository, passwordHasher, tokenService });
  const getCurrentUser = new GetCurrentUser({ userRepository });
  const listUsers = new ListUsers({ userRepository });

  // Interface adapters
  const authController = createAuthController({ registerUser, loginUser });
  const userController = createUserController({ getCurrentUser, listUsers });
  const authMiddleware = createAuthMiddleware(tokenService);

  return { authController, userController, authMiddleware };
}

module.exports = { buildContainer };