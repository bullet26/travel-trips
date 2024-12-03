import Link from 'next/link'
import type { Metadata } from 'next'
import { RegistrationForm } from './RegistrationForm'

export const metadata: Metadata = {
  title: 'Sign up',
}

const Registration = () => {
  return (
    <>
      <RegistrationForm />
      <div>
        Already have an account? <Link href="/login">Log in</Link>{' '}
      </div>
    </>
  )
}
export default Registration
