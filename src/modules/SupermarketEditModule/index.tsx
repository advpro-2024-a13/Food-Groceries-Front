import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';

interface Supermarket {
  supermarketId: number;
  name: string;
  supermarketImage: string;
  supermarketDescription: string;
}

const EditSupermarketPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params; // Extract the ID from the params
  const [supermarket, setSupermarket] = useState<Supermarket | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/supermarket/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setSupermarket(data);
          setName(data.name);
          setDescription(data.supermarketDescription);
          setImage(data.supermarketImage);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching supermarket:', error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleUpdate = () => {
    if (!supermarket) return;
  
    const editedSupermarket = {
      name,
      supermarketDescription: description,
      supermarketImage: image,
    };
  
    setSubmitting(true);
  
    fetch(`https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/supermarket/edit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedSupermarket),
    })
      .then((response) => response.json())
      .then(() => {
        setSubmitting(false);
        
      })
      .catch((error) => {
        console.error('Error updating supermarket:', error);
        // Handle error, show error message, etc.
      })
      .finally(() => {
        router.push('/manageSupermarket');
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!supermarket) {
    return <p>Supermarket not found</p>;
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={styles.title}>Edit Supermarket</h1>
        <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="description" style={styles.label}>Description:</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="image" style={styles.label}>Image URL:</label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              style={styles.input}
            />
          </div>
          <Button type="submit" color="primary" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Supermarket'}
          </Button>
        </form>
      </div>
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
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    width: '300px',
  },
  title: {
    fontSize: '2em',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontSize: '1em',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '1em',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
};

export default EditSupermarketPage;
