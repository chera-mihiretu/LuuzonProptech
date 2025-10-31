import { createAuthClient } from "better-auth/react"
import { BETTER_AUTH_URL } from "../app/config/envs"
import { emailOTPClient } from "better-auth/client/plugins"
export const authClient = createAuthClient({
    baseURL: BETTER_AUTH_URL, 
    plugins: [
        emailOTPClient()
    ]
})