import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';

const CreateSupermarketPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleCreate = () => {
    const newSupermarket = {
      name,
      ownerId: ownerId!,
      supermarketDescription: description,
      supermarketImage: image,
    };

    fetch('https://a13heymartsmpr-tvz2de5qsa-uc.a.run.app/supermarket/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSupermarket),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success('Supermarket created successfully!');
        setName('');
        setOwnerId(null);
        setDescription('');
        setImage('');
        router.push('/manageSupermarket');
      })
      .catch((error) => {
        console.error('Error creating supermarket:', error);
        toast.error('Error creating supermarket');
      });
  };

  return (
    <main className="py-28 flex justify-center items-center">
      <div className="card" style={{ width: '600px' }}>
        <div className="card-header">
          <h2 className="card-title">Create New Supermarket</h2>
        </div>
        <div className="card-content">
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
        </div>
      </div>
    </main>
  );
};

export default CreateSupermarketPage;
