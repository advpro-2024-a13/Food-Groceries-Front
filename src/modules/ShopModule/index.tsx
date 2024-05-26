import React, { useEffect, useState, CSSProperties } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'

interface Supermarket {
  supermarketId: number
  name: string
  supermarketImage: string
  supermarketDescription: string
}

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
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSupermarket = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault()
    try {
      const data: Supermarket[] = await customFetch(
        'https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/supermarket',
        { method: 'GET' }
      )
      setSupermarkets(data)
      setLoading(false)
      toast('Supermarkets fetched successfully!')
    } catch (error) {
      console.error('Error fetching supermarkets:', error)
    }
  }

  useEffect(() => {
    handleSupermarket()
  }, [])

  const filteredSupermarkets = supermarkets.filter((supermarket) =>
    supermarket.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <input
          type="text"
          placeholder="Search supermarkets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchBar}
        />
        {loading ? (
          <div style={styles.loading}>
            <div className="loader"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <div style={styles.cardContainer}>
            {filteredSupermarkets.map((supermarket) => (
              <Link
                key={supermarket.supermarketId}
                href={`/shop/products/${supermarket.supermarketId}`}
              >
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>{supermarket.name}</h2>
                  <img
                    src={supermarket.supermarketImage}
                    alt={supermarket.name}
                    style={styles.cardImage}
                  />
                  <p style={styles.cardText}>
                    {supermarket.supermarketDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
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
  searchBar: {
    width: '80%',
    padding: '10px',
    marginBottom: '20px',
    fontSize: '16px',
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  cardImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '1.25em',
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'center',
  },
  cardText: {
    fontSize: '1em',
    marginBottom: '5px',
    textAlign: 'center',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  },
}

export default ShopModule