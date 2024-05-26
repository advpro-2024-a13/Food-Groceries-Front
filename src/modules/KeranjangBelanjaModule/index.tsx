import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type KeranjangBelanja = {
  ownerId: number;
  products: Product[];
};

const KeranjangBelanjaPage: React.FC = () => {
  const [keranjangBelanja, setKeranjangBelanja] = useState<KeranjangBelanja | null>(null);
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const baseURL = 'https://a13heymartbkbhr-6yfvrprlfa-uc.a.run.app';

  useEffect(() => {
    if (ownerId !== null) {
      fetch(`${baseURL}/keranjangbelanja/getKeranjangBelanjaById?ownerId=${ownerId}`)
        .then((response) => response.json())
        .then((data) => {
          setKeranjangBelanja(data);
          setIsLoading(false);
        });
    }
  }, [ownerId]);

  const handleCreate = () => {
    if (ownerId !== null) {
      fetch(`${baseURL}/keranjangbelanja/createNewKeranjangBelanja?ownerId=${ownerId}`, {
        method: 'POST',
      })
        .then((response) => response.json())
        .then((data) => setKeranjangBelanja(data));
    }
  };

  const handleAddProduct = () => {
    if (ownerId !== null) {
      fetch(`${baseURL}/keranjangbelanja/addProductToKeranjangBelanja`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ownerId, productId, quantity }),
      })
        .then((response) => response.json())
        .then((data) => setKeranjangBelanja(data));
    }
  };

  const handleUpdateProductQuantity = (productId: string, newQuantity: number) => {
    if (ownerId !== null) {
      fetch(`${baseURL}/keranjangbelanja/updateKeranjangBelanja`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ownerId, updatedProducts: { [productId]: newQuantity } }),
      })
        .then((response) => response.json())
        .then((data) => setKeranjangBelanja(data));
    }
  };

  const handleClear = () => {
    if (ownerId !== null) {
      fetch(`${baseURL}/keranjangbelanja/clearKeranjangBelanja?ownerId=${ownerId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => setKeranjangBelanja(data));
    }
  };

  const handleRemoveProduct = () => {
    if (ownerId !== null) {
      fetch(`${baseURL}/keranjangbelanja/removeProductFromKeranjangBelanja`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ownerId, productId }),
      })
        .then((response) => response.json())
        .then((data) => setKeranjangBelanja(data));
    }
  };

  return (
    <main className="py-28 flex justify-center items-center">
      <div>
        <Card style={{ marginBottom: '20px', width: '600px' }}>
          <CardHeader>
            <CardTitle>Keranjang Belanja</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              keranjangBelanja && (
                <div style={{ marginBottom: '10px' }}>
                  <h3>Owner ID: {keranjangBelanja.ownerId}</h3>
                  <p>Products:</p>
                  {keranjangBelanja.products.map((product) => (
                    <div key={product.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                      <div>
                        <p>{product.name}</p>
                        <p>Price: ${product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                        <Button onClick={() => handleUpdateProductQuantity(product.id, product.quantity + 1)}>+</Button>
                        <Button onClick={() => handleUpdateProductQuantity(product.id, product.quantity - 1)} disabled={product.quantity <= 0}>-</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </CardContent>
        </Card>

        <Card style={{ width: '600px' }}>
          <CardHeader>
            <CardTitle>Manage Keranjang Belanja</CardTitle>
          </CardHeader>
          <CardContent>
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
              <Label htmlFor="productId" className="block mb-2">
                Product ID:
              </Label>
              <input
                type="text"
                id="productId"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="quantity" className="block mb-2">
                Quantity:
              </Label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <Button color="primary" onClick={handleCreate} className="w-full mb-4">
              Create Keranjang Belanja
            </Button>
            <Button color="primary" onClick={handleAddProduct} className="w-full mb-4">
              Add Product to Keranjang Belanja
            </Button>
            <Button color="primary" onClick={handleClear} className="w-full mb-4">
              Clear Keranjang Belanja
            </Button>
            <Button color="primary" onClick={handleRemoveProduct} className="w-full mb-4">
              Remove Product from Keranjang Belanja
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default KeranjangBelanjaPage;