import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maps',
}

const CountriesLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default CountriesLayout
