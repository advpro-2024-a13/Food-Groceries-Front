/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type KeranjangBelanja = {
  products: Product[];
};

const KeranjangBelanjaPage: React.FC = () => {
  const [keranjangBelanja, setKeranjangBelanja] = useState<KeranjangBelanja | null>(null);
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(0);

  const baseURL = 'https://a13heymartbkbhr-6yfvrprlfa-uc.a.run.app';

  useEffect(() => {
    if (ownerId !== null) {
      fetch(`${baseURL}/keranjangbelanja/getKeranjangBelanjaById?ownerId=${ownerId}`)
        .then((response) => response.json())
        .then((data) => setKeranjangBelanja(data));
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

  // Function to handle checkout (without calling any endpoint)
  const handleCheckout = () => {
    alert('Checkout functionality will be handled here');
  };

  return (
    <main className="py-28 flex justify-center items-center">
      <div>
        <Card style={{ marginBottom: '20px', width: '600px' }}>
          <CardHeader>
            <CardTitle>Keranjang Belanja</CardTitle>
          </CardHeader>
          <CardContent>
          {keranjangBelanja && keranjangBelanja.products.length === 0 ? (
            <p>You haven&apos;t added anything to the cart yet.</p>
          ) : (
              <div style={{ marginBottom: '10px' }}>
                <p>Products:</p>
                {keranjangBelanja?.products.map((product) => (
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
            )}
          </CardContent>
        </Card>

        <Card style={{ width: '600px' }}>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <Button color="primary" onClick={handleCheckout} className="w-full mb-4">
              Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default KeranjangBelanjaPage;