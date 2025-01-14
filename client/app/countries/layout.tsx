import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Countries',
}

const CountriesLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default CountriesLayout
