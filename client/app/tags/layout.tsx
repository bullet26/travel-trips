import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tags',
}

const TagsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default TagsLayout
