import Axios, { AxiosInstance } from 'axios'
import { IS_DEV } from './env'

export const axios: AxiosInstance = Axios.create({
  baseURL: IS_DEV ? 'http://localhost:3000' : '/api',
})

export const axiosSWR = async (key: string) => {
  const resp = await axios.get(key)
  return resp.data
}

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    return config
  },
  err => Promise.reject(err)
)

axios.interceptors.response.use(
  resp => {
    if (resp.headers['x-auth-token']) {
      const token: string = resp.headers['x-auth-token']
      localStorage.setItem('token', token)
    }

    return resp
  },
  err => Promise.reject(err)
)
