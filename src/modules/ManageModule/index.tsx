/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation'
import { useState, useEffect, CSSProperties } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Pengguna } from '@/components/interface/database';

interface Supermarket {
  supermarketId: number
  name: string
  supermarketImage: string
  supermarketDescription: string
}

interface Product {
  productId: string
  productName: string
  productQuantity: number
  productCategory: string
  productDescription: string
  productImagePath: string
  productPrice: number
  supermarketOwnerId: number
}

const customFetch = async (url: string, options: RequestInit) => {
  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error('Network response was not ok' + response.statusText)
  }
  return response.json()
}

const SupermarketDetails = () => {
  const router = useRouter()
  const [supermarket, setSupermarket] = useState<Supermarket | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    let localPengguna: Pengguna | Record<string, never> = {};
    if (typeof window !== 'undefined') {
      localPengguna = JSON.parse(localStorage.getItem('Pengguna') || '{}')
    }
    const ownerId = 'id' in localPengguna ? localPengguna.id : '';
    const fetchSupermarket = async () => {
      try {
        const supermarketData: Supermarket = await customFetch(
          `https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/supermarket/findByOwnerId/${ownerId}`,
          { method: 'GET' }
        )
        setSupermarket(supermarketData)

        const productsData: Product[] = await customFetch(
          `https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/product/findByOwnerId/${supermarketData.supermarketId}`,
          { method: 'GET' }
        )
        setProducts(productsData)
        setLoading(false)
        toast.success('Supermarket and product details fetched successfully!')
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
        toast.error('Failed to fetch details.')
      }
    }
    fetchSupermarket()
  }, [])

  const handleAddProduct = () => {
    router.push(`/addproduct/${supermarket?.supermarketId}`)
  }

  const handleEditProduct = (productId: string) => {
    router.push(`/editproduct/${supermarket?.supermarketId}/${productId}`)
  }

  const handleDeleteProduct = async (productId: string) => {
    let token;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
    try {
      await customFetch(
        `https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/product/delete/${productId}`,
        {
          method: 'DELETE',
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      )
      setProducts(products.filter((product) => product.productId !== productId))
      toast.success('Product deleted successfully!')
      router.push('/manage')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product.')
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (!supermarket) {
    return <p>Supermarket not found</p>
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.supermarketName}>{supermarket.name}</h1>
      <div style={styles.imageContainer}>
        <img
          src={supermarket.supermarketImage}
          alt={supermarket.name}
          style={styles.image}
        />
      </div>
      <p>{supermarket.supermarketDescription}</p>
      <button onClick={handleAddProduct}>Add Product</button>
      <div style={styles.productsContainer}>
        {products.map((product) => (
          <Card key={product.productId} style={styles.productCard}>
            <CardHeader>
              <img
                src={product.productImagePath}
                alt={product.productName}
                style={styles.productImage}
              />
              <h2>{product.productName}</h2>
              <CardTitle>Rp.{product.productPrice}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{product.productDescription}</CardDescription>
              <p>{product.productQuantity}</p>
              <p>{product.productCategory}</p>
              <button onClick={() => handleEditProduct(product.productId)}>
                Edit
              </button>
              <button onClick={() => handleDeleteProduct(product.productId)}>
                Delete
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px',
    marginTop: '100px',
  },
  supermarketName: {
    fontSize: '2.5em',
    margin: '10px 0 20px 0',
  },
  imageContainer: {
    width: '100%',
    maxWidth: '600px',
    margin: '20px 0',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    maxWidth: '600px',
    maxHeight: '400px',
  },
  productsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px',
    width: '250px',
    textAlign: 'left',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  productImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '10px',
  },
}

export default SupermarketDetails
