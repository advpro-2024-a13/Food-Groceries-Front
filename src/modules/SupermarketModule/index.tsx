import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

interface Supermarket {
  supermarketId: number;
  name: string;
  supermarketImage: string;
  supermarketDescription: string;
}

const SupermarketPage: React.FC = () => {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pengguna, setPengguna] = useState<any>({})


  useEffect(() => {
    if (typeof window !== 'undefined') {
        const localPengguna = JSON.parse(localStorage.getItem('Pengguna') || '{}');
        setPengguna(localPengguna)
        }
    fetch('https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/supermarket')
      .then((response) => response.json())
      .then((data) => {
        setSupermarkets(data);
        setLoading(false);
        toast('Supermarkets fetched successfully!');
      })
      .catch((error) => {
        console.error('Error fetching supermarkets:', error);
        setLoading(false);
        toast.error('Error fetching supermarkets');
      });
  }, []);

  const role = pengguna.role

  const handleDelete = (id: number) => {
    fetch(`https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/supermarket/delete/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        toast.success('Supermarket deleted successfully!');
        // Refresh the page after deletion
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error deleting supermarket:', error);
        toast.error('Error deleting supermarket');
      });
  };

  const filteredSupermarkets = supermarkets.filter((supermarket) =>
    supermarket.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main style={styles.main}>
    {role === 'ROLE_ADMIN' ? (
      <div style={styles.container}>
        <h1 style={styles.title}>List Supermarkets</h1>
        <div style={styles.buttonContainer}>
          <Link href="/supermarket/create">
            <Button color="primary">Create Supermarket</Button>
          </Link>
        </div>
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
              <div key={supermarket.supermarketId} style={styles.card}>
                <h2 style={styles.cardTitle}>{supermarket.name}</h2>
                <img
                  src={supermarket.supermarketImage}
                  alt={supermarket.name}
                  style={styles.cardImage}
                />
                <p style={styles.cardText}>
                  {supermarket.supermarketDescription}
                </p>
                <div style={styles.buttonGroup}>
                  <Link href={`/supermarket/edit/${supermarket.supermarketId}`}>
                    <Button color="secondary">Edit</Button>
                  </Link>
                  <Button color="danger" onClick={() => handleDelete(supermarket.supermarketId)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ) : (
        <p>You are not authorized to access this page.</p>
    )}
    </main>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
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
  title: {
    fontSize: '2em',
    marginBottom: '20px',
  },
  searchBar: {
    width: '80%',
    padding: '10px',
    marginBottom: '20px',
    fontSize: '16px',
  },
  buttonContainer: {
    marginBottom: '20px',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
  buttonGroup: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  },
};

export default SupermarketPage;
