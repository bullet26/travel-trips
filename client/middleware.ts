import { chain, authMiddleware } from 'middlewares'

export default chain([authMiddleware])

//Skip Next.js middleware for static and public files & api
export const config = { matcher: '/((?!.*\\.).*)' }
