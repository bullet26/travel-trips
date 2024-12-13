import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { loginImg } from 'assets'
import { RegistrationForm } from './RegistrationForm'
import GoogleButton from '@/login/GoogleButton'
import s from '@/login/Login.module.scss'

export const metadata: Metadata = {
  title: 'Sign up',
}

const Registration = () => {
  return (
    <div className={s.page}>
      <Image
        src={loginImg}
        style={{ maxHeight: '100vh', objectFit: 'contain' }}
        alt="Picture of the city"
      />
      <div className={s.loginWrapper}>
        <div className={s.title}>Create your free account</div>

        <GoogleButton />
        <RegistrationForm />
        <div className={s.text}>
          Already have an account? <Link href="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}
export default Registration
