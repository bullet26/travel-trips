import { chain, authMiddleware, actualizeUserData, roleGuardMiddleware } from 'middlewares'

export default chain([authMiddleware, actualizeUserData, roleGuardMiddleware])

//Skip Next.js middleware for static and public files & api
export const config = { matcher: '/((?!.*\\.).*)' }
