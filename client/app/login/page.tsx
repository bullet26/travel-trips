import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { loginImg } from 'assets'
import LoginForm from './LoginForm'
import GoogleButton from './GoogleButton'
import s from './Login.module.scss'

export const metadata: Metadata = {
  title: 'Log in',
}

const Login = async () => {
  return (
    <Suspense>
      <div className={s.page}>
        <Image
          src={loginImg}
          style={{ maxHeight: '100vh', objectFit: 'contain' }}
          alt="Picture of the city"
        />
        <div className={s.loginWrapper}>
          <div className={s.title}>Log in to your account</div>

          <GoogleButton />
          <LoginForm />
          <div className={s.text}>
            New ? <Link href="/registration">Sign up for an account</Link>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
export default Login
