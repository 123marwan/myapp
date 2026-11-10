// Compatibility re-export: prefer importing from "./services/*"
export { httpClient as api } from "./services/httpClient";
export { getApiErrorMessage as getErrorMessage } from "./services/apiError";