import ky from 'ky'
import Cookies from 'js-cookie'

const api = ky.create({
  prefixUrl: process.env.NEXT_BACKEND_URL,
  credentials: 'include',
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = Cookies.get('accessToken')

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          const refreshResponse: { accessToken: string } = await ky
            .post(`${process.env.NEXT_BACKEND_URL}/auth/refresh-token`, { credentials: 'include' })
            .json()

          if (refreshResponse?.accessToken) {
            const { accessToken } = refreshResponse
            Cookies.set('accessToken', accessToken, { expires: 7 })
            request.headers.set('Authorization', `Bearer ${accessToken}`)
            return ky(request.url, options)
          }
        }

        return response
      },
    ],
  },
})

export default api
