'use client'
import useSWR from 'swr'
import { Header } from 'components'

const Home = () => {
  const { data } = useSWR({ url: 'users' })

  return (
    <>
      <Header />
      {data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </>
  )
}

export default Home
