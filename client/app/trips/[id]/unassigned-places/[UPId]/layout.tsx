import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unassigned places',
}
const UnassignedPlaceLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default UnassignedPlaceLayout
