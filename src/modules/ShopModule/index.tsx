'use client'
import React, { useEffect, useState, CSSProperties } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // Ensure this is imported to apply the styles for toast notifications

// Define the type for the supermarket data
interface Supermarket {
  supermarketId: number
  name: string
  ownerId: number
}

// Define the customFetch function
const customFetch = async (url: string, options: RequestInit) => {
  const token = localStorage.getItem('token')
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

const ShopModule = () => {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([])

  const handleRegister = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault()
    try {
      const data: Supermarket[] = await customFetch(
        'https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/supermarket',
        { method: 'GET' }
      )
      setSupermarkets(data)
      toast('Supermarkets fetched successfully!')
    } catch (error) {
      console.error('Error fetching supermarkets:', error)
    }
  }

  useEffect(() => {
    handleRegister()
  }, [])

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.cardContainer}>
          {supermarkets.map((supermarket) => (
            <div key={supermarket.supermarketId} style={styles.card}>
              <h2 style={styles.cardTitle}>{supermarket.name}</h2>
              <p style={styles.cardText}>
                Supermarket ID: {supermarket.supermarketId}
              </p>
              <p style={styles.cardText}>Owner ID: {supermarket.ownerId}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

const styles: { [key: string]: CSSProperties } = {
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    textAlign: 'center',
  },
  mediumText: {
    fontSize: '1.25em',
  },
  bigText: {
    fontSize: '2.5em',
    fontWeight: 'bold',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '20px',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    margin: '10px',
    width: '200px',
    textAlign: 'left',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '1.5em',
    marginBottom: '10px',
  },
  cardText: {
    fontSize: '1em',
    marginBottom: '5px',
  },
}

export default ShopModule
