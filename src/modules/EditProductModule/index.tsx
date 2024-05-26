import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Card, CardContent } from '@/components/ui/card'
import { Pengguna } from '@/components/interface/database'

type SupermarketParams = {
  supermarketId: string
  productId: string
}

const EditProductModule = () => {
  const { supermarketId, productId } = useParams<SupermarketParams>()
  const router = useRouter()

  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    productQuantity: '',
    productCategory: '',
    productDescription: '',
    productImagePath: '',
    productPrice: '',
    supermarketOwnerId: '',
  })

  const ownerId = supermarketId

  const [formErrors, setFormErrors] = useState({
    productName: '',
    productQuantity: '',
    productCategory: '',
    productDescription: '',
    productImagePath: '',
    productPrice: '',
    supermarketOwnerId: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    setFormErrors({
      ...formErrors,
      [name]: '', // Clear the error when the user starts typing
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let localPengguna: Pengguna | Record<string, never> = {};
    if (typeof window !== 'undefined') {
      localPengguna = JSON.parse(localStorage.getItem('Pengguna') || '{}')
    }
    const token = 'accessToken' in localPengguna ? localPengguna.accessToken : '';

    try {
      const response = await fetch(
        `https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/product/edit`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            supermarketOwnerId: ownerId,
            productId: productId,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to add product')
      }

      toast.success('Product added successfully')
      router.push('/manage')
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product')
    }
  }

  return (
    <main className="py-28 flex justify-center items-center">
      <Card style={{ width: '300px' }}>
        <CardContent>
          <h1>Edit Product</h1>
          <form onSubmit={handleSubmit} className="dark:text-black">
            <div className="mb-6">
              <label htmlFor="productName" className="block mb-2">
                Product Name:
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formErrors.productName && (
                <p style={{ color: 'red' }}>{formErrors.productName}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="productQuantity" className="block mb-2">
                Product Quantity:
              </label>
              <input
                type="number"
                id="productQuantity"
                name="productQuantity"
                value={formData.productQuantity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formErrors.productQuantity && (
                <p style={{ color: 'red' }}>{formErrors.productQuantity}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="productCategory" className="block mb-2">
                Product Category:
              </label>
              <input
                type="text"
                id="productCategory"
                name="productCategory"
                value={formData.productCategory}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formErrors.productCategory && (
                <p style={{ color: 'red' }}>{formErrors.productCategory}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="productDescription" className="block mb-2">
                Product Description:
              </label>
              <input
                type="text"
                id="productDescription"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formErrors.productDescription && (
                <p style={{ color: 'red' }}>{formErrors.productDescription}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="productImagePath" className="block mb-2">
                Product Image Path:
              </label>
              <input
                type="text"
                id="productImagePath"
                name="productImagePath"
                value={formData.productImagePath}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formErrors.productImagePath && (
                <p style={{ color: 'red' }}>{formErrors.productImagePath}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="productPrice" className="block mb-2">
                Product Price:
              </label>
              <input
                type="number"
                id="productPrice"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formErrors.productPrice && (
                <p style={{ color: 'red' }}>{formErrors.productPrice}</p>
              )}
            </div>
            <button type="submit" className="w-full mb-4">
              Edit Product
            </button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default EditProductModule
