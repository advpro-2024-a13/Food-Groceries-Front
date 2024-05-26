import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

type Supermarket = {
    supermarketId: number
    name: string
    ownerId: number
    supermarketDescription: string
    supermarketImage: string
}

const SupermarketPage: React.FC = () => {
    const [supermarkets, setSupermarkets] = useState<Supermarket[]>([])
    const [name, setName] = useState('')
    const [ownerId, setOwnerId] = useState<number | null>(null)
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')

    useEffect(() => {
        fetch('https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/supermarket')
            .then((response) => response.json())
            .then((data) => setSupermarkets(data))
    }, [])

    const handleCreate = () => {
        const newSupermarket = {
            name,
            ownerId: ownerId!,
            supermarketDescription: description,
            supermarketImage: image,
        }

        fetch('https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/supermarket/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSupermarket),
        })
            .then((response) => response.json())
            .then((data) => {
                setSupermarkets((prevSupermarkets) => [...prevSupermarkets, data])
                setName('')
                setOwnerId(null)
                setDescription('')
                setImage('')
            })
    }

    return (
        <main className="py-28 flex justify-center items-center">
            <div>
                <Card style={{ marginBottom: '20px', width: '600px' }}>
                    <CardHeader>
                        <CardTitle>Supermarkets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {supermarkets.map((supermarket) => (
                            <div key={supermarket.supermarketId} style={{ marginBottom: '10px' }}>
                                <h3>{supermarket.name}</h3>
                                <p>{supermarket.supermarketDescription}</p>
                                <img src={supermarket.supermarketImage} alt={supermarket.name} style={{ width: '100px' }} />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card style={{ width: '600px' }}>
                    <CardHeader>
                        <CardTitle>Create New Supermarket</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <Label htmlFor="name" className="block mb-2">
                                Name:
                            </Label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="ownerId" className="block mb-2">
                                Owner ID:
                            </Label>
                            <input
                                type="number"
                                id="ownerId"
                                value={ownerId || ''}
                                onChange={(e) => setOwnerId(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="description" className="block mb-2">
                                Description:
                            </Label>
                            <input
                                type="text"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="image" className="block mb-2">
                                Image URL:
                            </Label>
                            <input
                                type="text"
                                id="image"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <Button color="primary" onClick={handleCreate} className="w-full mb-4">
                            Create Supermarket
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
  )
}

export default SupermarketPage
