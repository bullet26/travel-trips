import Image from 'next/image'
import { gothicCastle } from 'assets'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

const Dashboard = () => {
  return (
    <>
      <Image src={gothicCastle} height={550} alt="Picture of the city" />
    </>
  )
}

export default Dashboard
