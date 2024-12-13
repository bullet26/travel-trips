import { chain, authMiddleware, actualizeUserData } from 'middlewares'

export default chain([authMiddleware, actualizeUserData])

//Skip Next.js middleware for static and public files & api
export const config = { matcher: '/((?!.*\\.).*)' }
