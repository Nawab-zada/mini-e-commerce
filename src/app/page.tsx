'use client'; // Add this directive if not already present

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import { useSearchParams } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchProducts() {
      const searchTerm = searchParams.get('name');
      const apiUrl = searchTerm ? `/api/products?name=${searchTerm}` : '/api/products';

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products);
        } else {
          setError(data.message || 'Failed to fetch products.');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('An unexpected error occurred while fetching products.');
      } finally {
        setLoading(false);
      }
    }
    setLoading(true); // Set loading to true on each searchParams change
    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
        <Navbar />
        <p className="text-xl font-semibold text-gray-700">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
        <Navbar />
        <p className="text-xl font-semibold text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6 flex-grow">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Products</h1>
        {products.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No products available yet. Why not create one?</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-3">{product.description.substring(0, 100)}...</p>
                  <p className="text-2xl font-bold text-blue-600 mb-3">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Category: {product.category}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  <div className="mt-4 flex justify-end">
                    {/* Add to Cart or View Details Button */}
                    <Link
                      href={`/products/${product._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
