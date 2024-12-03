import Link from 'next/link'
import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Log in',
}

const Login = () => {
  return (
    <>
      <LoginForm />
      <div>
        New ? <Link href="/registration">Sign up for an account</Link>
      </div>
    </>
  )
}
export default Login
