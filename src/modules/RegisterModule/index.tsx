import React, { useState } from 'react'
import { RegistrationFormData } from './interface'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthContext } from '@/components/contexts/AuthContext'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const RegisterPage: React.FC = () => {
  const { customFetch } = useAuthContext()
  const router = useRouter()

  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    customFetch(
      'https://a13autehnticate-6yfvrprlfa-uc.a.run.app/api/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify(formData),
      }
    ).then((response) => {
      toast(response.message)
      if (response.message === 'User registered successfully!') {
        router.push('/login')
      }
    })
  }

  return (
    <main className="py-28 flex justify-center items-center">
      <Card style={{ width: '300px' }}>
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                Email:
              </label>
              <input
                type="text"
                id="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="firstName" className="block mb-2">
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="lastName" className="block mb-2">
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="role" className="block mb-2">
                Role:
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="ROLE_PEMBELI">Pembeli</option>
                <option value="ROLE_PENGELOLA">Pengelola</option>
              </select>
            </div>
            <CardFooter className="flex flex-col items-center mt-4">
              <Button type="submit" className="w-full mb-4">
                Register
              </Button>
              <a
                href="/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Sudah punya akun ? Login disini !
              </a>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default RegisterPage
