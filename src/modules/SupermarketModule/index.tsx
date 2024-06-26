'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState, CSSProperties } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image';

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
    throw new Error('Network response was not ok: ' + response.statusText)
  }
  return response.json()
}

type SupermarketParams = {
  supermarketId: string
}

const SupermarketDetails = () => {
  const { supermarketId } = useParams<SupermarketParams>()
  const [supermarket, setSupermarket] = useState<Supermarket | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (supermarketId) {
      const fetchSupermarket = async () => {
        try {
          const supermarketData: Supermarket = await customFetch(
            `https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/supermarket/${supermarketId}`,
            { method: 'GET' }
          )
          setSupermarket(supermarketData)

          const productsData: Product[] = await customFetch(
            `https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/product/findByOwnerId/${supermarketId}`,
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
    }
  }, [supermarketId])

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await fetch('https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/addProductToKeranjangBelanja', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: product.supermarketOwnerId,
          productId: product.productId,
          quantity: 1, // Default quantity is 1
        }),
      })
      if (response.ok) {
        toast.success(`${product.productName} added to cart successfully.`)
      } else {
        const data = await response.json()
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error adding product to cart:', error)
      toast.error('Failed to add product to cart.')
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
        <Image
          src={supermarket.supermarketImage}
          alt={supermarket.name}
          width={600}
          height={400}
          objectFit="cover"
        />
      </div>
      <p>{supermarket.supermarketDescription}</p>
      <div style={styles.productsContainer}>
        {products.map((product) => (
          <Card key={product.productId} style={styles.productCard}>
            <CardHeader>
              <Image
                src={product.productImagePath}
                alt={product.productName}
                width={100}
                height={100}
                objectFit="cover"
              />
              <h2>{product.productName}</h2>
              <CardTitle>Rp.{product.productPrice}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{product.productDescription}</CardDescription>
              <p>{product.productQuantity}</p>
              <p>{product.productCategory}</p>
              <Button onClick={() => handleAddToCart(product)}>Add to Cart</Button>
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
