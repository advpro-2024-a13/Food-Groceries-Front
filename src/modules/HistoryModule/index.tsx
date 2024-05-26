import React, { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import Dropdown from '@/components/ui/dropdown'
import { CSSProperties } from 'react'

const HistoryPage: React.FC = () => {
  const [histories, setHistories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pengguna, setPengguna] = useState<any>({})
  const [selectedHistory, setSelectedHistory] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [marketIds, setMarketIds] = useState<number[]>([])
  const [selectedMarketId, setSelectedMarketId] = useState<string>('')

  const fetchHistories = useCallback(() => {
    if (!pengguna.id) return

    const url = `https://a13heymartbkbhr-6yfvrprlfa-uc.a.run.app/history/owner/${pengguna.id}`

    setIsLoading(true)

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setHistories(data)
        setIsLoading(false)
        const uniqueMarketIds = Array.from(
          new Set(data.map((history: any) => history.marketId))
        )
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setMarketIds(uniqueMarketIds)
      })
      .catch((error) => {
        console.error('Error fetching histories:', error)
        setIsLoading(false)
      })
  }, [pengguna.id])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localPengguna = JSON.parse(localStorage.getItem('Pengguna') || '{}')
      setPengguna(localPengguna)
    }
  }, [])

  useEffect(() => {
    if (pengguna.id) {
      fetchHistories()
    }
  }, [pengguna.id, fetchHistories])

  const handleHistoryClick = (id: number) => {
    fetch(`https://a13heymartbkbhr-6yfvrprlfa-uc.a.run.app/history/get/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedHistory(data)
        setIsModalOpen(true)
      })
      .catch((error) => {
        console.error('Error fetching history:', error)
      })
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedHistory(null)
  }

  const handleMarketIdChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMarketId(event.target.value)
  }

  const filteredHistories = selectedMarketId
    ? histories.filter(
        (history) => history.marketId.toString() === selectedMarketId
      )
    : histories

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={styles.bigText}>My Transaction History</h1>
        <Dropdown
          value={selectedMarketId}
          onChange={handleMarketIdChange}
          options={[
            { value: '', label: 'All Markets' },
            ...marketIds.map((id) => ({
              value: id.toString(),
              label: id.toString(),
            })),
          ]}
        />
        <Card>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              filteredHistories.map((history: any) => (
                <div
                  key={history.id}
                  style={styles.historyItem}
                  onClick={() => handleHistoryClick(history.id)}
                >
                  <p style={styles.historyDate}>
                    Date: {new Date(history.date).toLocaleDateString()}
                  </p>
                  <p style={styles.historyTotal}>
                    Total Spent: Rp. {history.totalSpent.toFixed(2)}
                  </p>
                  <p style={styles.historyMarketId}>
                    Market ID: {history.marketId}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        {selectedHistory && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <ModalHeader>
              <h2 style={styles.modalTitle}>Transaction Detail</h2>
            </ModalHeader>
            <ModalBody>
              <p style={styles.historyDetail}>
                Total Spent: Rp. {selectedHistory.totalSpent.toFixed(2)}
              </p>
              <p style={styles.historyDetail}>
                Market ID: {selectedHistory.marketId}
              </p>
              <p style={styles.historyDetail}>
                Owner ID: {selectedHistory.ownerId}
              </p>
              <div style={styles.productList}>
                <h3 style={styles.productTitle}>Products Purchased:</h3>
                {selectedHistory.purchases.map((product: any) => (
                  <p key={product.id} style={styles.productItem}>
                    {product.name} - Rp. {product.price.toFixed(2)}
                  </p>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={closeModal}>Close</Button>
            </ModalFooter>
          </Modal>
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
    minHeight: '100vh',
    paddingTop: '100px',
    overflowY: 'auto',
  },
  container: {
    textAlign: 'center' as const,
    width: '100%',
    maxWidth: '800px',
    padding: '20px',
  },
  bigText: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  dropdown: {
    marginBottom: '20px',
    padding: '10px',
    fontSize: '1em',
  },
  historyItem: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
  historyDate: {
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  historyTotal: {
    fontSize: '1.2em',
    marginTop: '8px',
  },
  historyMarketId: {
    fontSize: '1em',
    color: '#888',
    marginTop: '8px',
  },
  modalTitle: {
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  historyDetail: {
    fontSize: '1.2em',
    marginBottom: '8px',
  },
  productList: {
    marginTop: '16px',
  },
  productTitle: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  productItem: {
    fontSize: '1.2em',
  },
}

export default HistoryPage
