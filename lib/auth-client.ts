import { createAuthClient } from "better-auth/react"
import { BETTER_AUTH_URL } from "../app/config/envs"
export const authClient = createAuthClient({
    baseURL: BETTER_AUTH_URL, 
})