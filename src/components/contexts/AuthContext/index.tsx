import { createContext, useContext, useEffect, useState } from 'react'
import {
  AuthContextInterface,
  AuthContextProviderProps,
  RequestInit,
} from './interface'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Pengguna } from '@/components/interface/database'

const AuthContext = createContext({} as AuthContextInterface)

export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const router = useRouter()

  async function customFetch<Pengguna>(
    url: string,
    options: RequestInit = { isAuthorized: false }
  ): Promise<Pengguna> {
    const headers = { authorization: '', 'Content-Type': 'application/json' }

    if (options.isAuthorized) {
      const token = localStorage.getItem('token')
      headers['authorization'] = `Bearer ${token}`
    }

    const rawResult = await fetch(url.toString(), {
      headers,
      ...options,
    })

    const result = await rawResult.json()

    if (!(result.code === 200)) {
      localStorage.removeItem('token')
    }

    return result
  }

  async function login({
    email,
    password,
  }: {
    email: string
    password: string
  }) {
    const response = await customFetch<Pengguna>(
      'https://a13autehnticate-6yfvrprlfa-uc.a.run.app/api/auth/signin',
      {
        body: JSON.stringify({
          email,
          password,
        }),
        method: 'post',
      }
    )

    if (response.accessToken) {
      localStorage.setItem('Pengguna', JSON.stringify(response))
      setIsAuthenticated(true)
      router.push('/')
    } else {
      toast.error('Failed to login.')
    }
  }

  async function logout() {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    router.push('/')
  }

  useEffect(() => {
    setIsLoading(true)
    const isAuthenticatedLocalStorage = window.localStorage.getItem('token')

    if (!isAuthenticatedLocalStorage) {
      setIsAuthenticated(false)
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router])

  const contextValue: AuthContextInterface = {
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    login,
    logout,
    customFetch,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
