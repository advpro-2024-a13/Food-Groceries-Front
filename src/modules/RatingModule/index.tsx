import React, { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FaStar } from 'react-icons/fa'
import { CSSProperties } from 'react'

const RatingPage: React.FC = () => {
  const [ratings, setRatings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pengguna, setPengguna] = useState<any>({})
  const [editingRating, setEditingRating] = useState<any>(null)
  const [newRating, setNewRating] = useState<number>(0)
  const [newReview, setNewReview] = useState<string>('')
  const [marketId, setMarketId] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localPengguna = JSON.parse(localStorage.getItem('Pengguna') || '{}')
      setPengguna(localPengguna)
    }
  }, [])

  const fetchRatings = useCallback(() => {
    setIsLoading(true)
    fetch(
      `https://a13heymartbkbhr-6yfvrprlfa-uc.a.run.app/rating/owner/${pengguna.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setRatings(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching ratings:', error)
        setIsLoading(false)
      })
  }, [pengguna.id])

  useEffect(() => {
    if (pengguna.id) {
      fetchRatings()
    }
  }, [fetchRatings, pengguna.id])

  const renderStarRating = (rating: number, isEditing: boolean) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          size={30}
          color={i <= rating ? 'gold' : 'gray'}
          onClick={isEditing ? () => handleEditRating(i) : undefined}
          style={{
            cursor: isEditing ? 'pointer' : 'default',
            marginRight: '5px',
          }}
        />
      )
    }
    return stars
  }

  const handleEditRating = (rating: number) => {
    setNewRating(rating)
  }

  const handleSaveClick = () => {
    if (editingRating) {
      fetch(
        `https://a13heymartbkbhr-6yfvrprlfa-uc.a.run.app/rating/modify/${editingRating.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rating: newRating,
            review: newReview,
          }),
        }
      )
        .then((response) => response.text())
        .then((data) => {
          if (data === `Rating modified for id ${editingRating.id}`) {
            fetchRatings()
            setEditingRating(null)
          }
        })
        .catch((error) => {
          console.error('Error modifying rating:', error)
        })
    }
  }

  const handleDeleteClick = (id: number) => {
    fetch(
      `https://a13heymartbkbhr-6yfvrprlfa-uc.a.run.app/rating/delete/${id}`,
      {
        method: 'DELETE',
      }
    )
      .then((response) => response.text())
      .then((data) => {
        if (data === `Rating with id ${id} deleted.`) {
          fetchRatings()
        }
      })
      .catch((error) => {
        console.error('Error deleting rating:', error)
      })
  }

  const handleAddRating = () => {
    const data = {
      ownerId: pengguna.id,
      marketId: parseInt(marketId),
      rating: newRating,
      review: newReview,
    }

    fetch('https://a13heymartbkbhr-6yfvrprlfa-uc.a.run.app/rating/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then(() => {
        fetchRatings()
      })
      .catch((error) => {
        console.error('Error adding rating:', error)
      })
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        {pengguna.role !== 'ROLE_PEMBELI' ? (
          <h1 style={styles.bigText} className="text-black-500">
            Anda bukan pembeli
          </h1>
        ) : (
          <>
            <h1 style={styles.bigText}>My Ratings</h1>
            <Card>
              <CardHeader>
                <CardTitle></CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Label>Loading...</Label>
                ) : (
                  ratings.map((rating: any) => (
                    <div key={rating.id} style={styles.ratingContainer}>
                      {editingRating && editingRating.id === rating.id ? (
                        <div style={styles.editContainer}>
                          <Label>Edit Rating: </Label>
                          <div className="flex">
                            {renderStarRating(newRating, true)}
                          </div>
                          <Label>Edit Review: </Label>
                          <Input
                            type="text"
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            style={styles.input}
                          />
                          <Button
                            onClick={handleSaveClick}
                            style={styles.saveButton}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div style={styles.ratingContent}>
                          <div style={styles.ratingHeader}>
                            <div style={styles.starContainer}>
                              {renderStarRating(rating.score, false)}
                            </div>
                            <p style={styles.marketId}>
                              Market ID: {rating.marketId}
                            </p>
                            <div style={styles.buttonContainer}>
                              <Button
                                onClick={() => {
                                  setEditingRating(rating)
                                  setNewRating(rating.rating)
                                  setNewReview(rating.review)
                                }}
                                style={styles.editButton}
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteClick(rating.id)}
                                style={styles.deleteButton}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <p style={styles.review}>{rating.review}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Add Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={styles.formGroup}>
                  <Label>Market ID</Label>
                  <Input
                    value={marketId}
                    onChange={(e) => setMarketId(e.target.value)}
                  />
                </div>
                <div style={styles.formGroup}>
                  <Label>Rating</Label>
                  <div className="flex">
                    {renderStarRating(newRating, true)}
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <Label>Review</Label>
                  <Input
                    type="text"
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                  />
                </div>
                <div style={styles.buttonContainer}>
                  <Button onClick={handleAddRating}>Add Rating</Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}

const styles: { [key: string]: CSSProperties } = {
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    textAlign: 'center',
    marginTop: '100px',
  },
  bigText: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  ratingContainer: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  ratingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  ratingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  starContainer: {
    display: 'flex',
  },
  marketId: {
    fontSize: '0.9em',
    color: '#888',
    marginLeft: '16px',
  },
  review: {
    fontSize: '1.2em',
    marginTop: '8px',
  },
  input: {
    marginBottom: '8px',
  },
  saveButton: {
    marginTop: '8px',
  },
  editButton: {
    marginLeft: '16px',
  },
  deleteButton: {
    marginLeft: '8px',
    backgroundColor: '#ff4d4d',
    color: 'white',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '16px',
  },
  formGroup: {
    marginBottom: '20px',
  },
}

export default RatingPage
