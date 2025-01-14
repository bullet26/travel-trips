import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create new trip',
}

const TripsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default TripsLayout
