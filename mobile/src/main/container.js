import { AuthRepositoryImpl } from "../infrastructure/repositories/AuthRepositoryImpl";
import { SessionRepositoryImpl } from "../infrastructure/repositories/SessionRepositoryImpl";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl";

import { LoginUser } from "../application/use-cases/LoginUser";
import { RegisterUser } from "../application/use-cases/RegisterUser";
import { GetCurrentUser } from "../application/use-cases/GetCurrentUser";
import { ListUsers } from "../application/use-cases/ListUsers";
import { RestoreSession } from "../application/use-cases/RestoreSession";
import { SignOut } from "../application/use-cases/SignOut";

export { getApiErrorMessage, isUnauthorizedError } from "../infrastructure/http/apiError";

// Infrastructure
const authRepository = new AuthRepositoryImpl();
const userRepository = new UserRepositoryImpl();
const sessionRepository = new SessionRepositoryImpl();

// Use cases
export const loginUserUseCase = new LoginUser({ authRepository, sessionRepository });
export const registerUserUseCase = new RegisterUser({ authRepository, sessionRepository });
export const getCurrentUserUseCase = new GetCurrentUser({ authRepository, sessionRepository });
export const listUsersUseCase = new ListUsers({ userRepository });
export const restoreSessionUseCase = new RestoreSession({ sessionRepository });
export const signOutUseCase = new SignOut({ sessionRepository });

// Expose session persistence for auth state updates driven by UI (e.g. profile refresh)
export const sessionStore = sessionRepository;