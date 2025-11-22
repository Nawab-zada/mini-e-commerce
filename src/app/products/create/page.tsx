'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string>(''); // Input as comma-separated string
  const [stock, setStock] = useState<number>(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const parsedImages = images.split(',').map((img) => img.trim()).filter(Boolean);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          category,
          images: parsedImages,
          stock: Number(stock),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Product created successfully!');
        // Optionally clear form or redirect
        setName('');
        setDescription('');
        setPrice(0);
        setCategory('');
        setImages('');
        setStock(0);
        router.push('/products'); // Redirect to a products list page (if you create one)
      } else {
        setError(data.message || 'Failed to create product. Please try again.');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mt-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Create New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              id="category"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">Image URLs (comma-separated)</label>
            <input
              type="text"
              id="images"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="url1, url2, url3"
              value={images}
              onChange={(e) => setImages(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
            <input
              type="number"
              id="stock"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2 text-center">{success}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}
