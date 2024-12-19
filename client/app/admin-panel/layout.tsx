import { Metadata } from 'next'
import { NavigationMenu } from './NavigationMenu'

export const metadata: Metadata = {
  title: 'Admin panel',
}

const AdminPanelLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', columnGap: '40px' }}>
      <NavigationMenu />
      <div style={{ flex: 1, paddingRight: '50px' }}>{children}</div>
    </div>
  )
}

export default AdminPanelLayout
