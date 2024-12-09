'use client'
import useSWR from 'swr'

const Home = () => {
  const { data } = useSWR({ url: 'users' })

  return (
    <>
      {data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </>
  )
}

export default Home
