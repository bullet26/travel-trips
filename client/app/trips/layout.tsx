import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All my trips ✈️',
}

const TripsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default TripsLayout
