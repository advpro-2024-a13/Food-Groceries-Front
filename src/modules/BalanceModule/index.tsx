import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const BalancePage: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [amount, setAmount] = useState<number | null>(null)
  const [pengguna, setPengguna] = useState<any>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localPengguna = JSON.parse(localStorage.getItem('Pengguna') || '{}')
      setPengguna(localPengguna)
    }
  }, [])

  const role = pengguna.role

  const fetchBalance: () => void = useCallback(() => {
    setIsLoading(true)
    fetch(
      `https://a13heymartbkbhr-6yfvrprlfa-uc.a.run.app/balance/api/getBalance?ownerId=${pengguna.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setBalance((prevBalance) => data || prevBalance)
        setIsLoading(false)
      })
  }, [pengguna.id])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(event.target.value))
  }

  const handleTopup = () => {
    fetch('https://a13heymartbkbhr-6yfvrprlfa-uc.a.run.app/balance/topUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pengguna.accessToken}`,
      },
      body: JSON.stringify({
        ownerId: pengguna.id,
        amount: amount,
        role: pengguna.role,
      }),
    })
      .then((response) => {
        return response.text()
      })
      .then((data) => {
        if (data === `Balance with ownerId ${pengguna.id} topped up.`) {
          fetchBalance()
        }
      })
  }

  const handleWithdraw = () => {
    if (balance === null || amount === null || balance < amount) {
      alert('Insufficient balance for withdrawal')
      return
    }

    fetch('https://a13heymartbkbhr-6yfvrprlfa-uc.a.run.app/balance/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pengguna.accessToken}`,
      },
      body: JSON.stringify({
        ownerId: pengguna.id,
        amount: amount,
        role: pengguna.role,
      }),
    })
      .then((response) => {
        return response.text()
      })
      .then((data) => {
        if (data === `Balance with ownerId ${pengguna.id} withdrawn.`) {
          fetchBalance()
        }
      })
  }

  return (
    <main className="py-28 flex justify-center items-center">
      <Card style={{ width: '300px' }}>
        {role === 'ROLE_PEMBELI' && (
          <CardHeader>
            <CardTitle>Top Up</CardTitle>
          </CardHeader>
        )}
        {role === 'ROLE_PENGELOLA' && (
          <CardHeader>
            <CardTitle>Withdraw</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          {isLoading ? (
            <Label>Loading...</Label>
          ) : (
            <Label>Current Balance: {balance}</Label>
          )}
          <div className="mb-6">
            <Label htmlFor="amount" className="block mb-2">
              Amount:
            </Label>
            <input
              type="number"
              id="amount"
              value={amount || ''}
              onChange={handleAmountChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          {role === 'ROLE_PEMBELI' && (
            <Button
              color="primary"
              onClick={handleTopup}
              className="w-full mb-4"
            >
              Topup
            </Button>
          )}
          {role === 'ROLE_PENGELOLA' && (
            <Button
              color="primary"
              onClick={handleWithdraw}
              className="w-full mb-4"
            >
              Withdraw
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export default BalancePage
