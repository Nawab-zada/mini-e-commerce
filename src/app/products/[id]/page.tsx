'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  // State for editable fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string>(''); // Stored as comma-separated string for input
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();

        if (response.ok) {
          setProduct(data.product);
          // Initialize form fields with product data
          setName(data.product.name);
          setDescription(data.product.description);
          setPrice(data.product.price);
          setCategory(data.product.category);
          setImages(data.product.images.join(', '));
          setStock(data.product.stock);
        } else {
          setError(data.message || 'Failed to fetch product details.');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('An unexpected error occurred while fetching product details.');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const parsedImages = images.split(',').map((img) => img.trim()).filter(Boolean);
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
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
        setProduct(data.product);
        setEditMode(false); // Exit edit mode on successful update
        alert('Product updated successfully!');
      } else {
        setError(data.message || 'Failed to update product.');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError('An unexpected error occurred while updating the product.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    setError('');
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        router.push('/'); // Redirect to homepage after deletion
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete product.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('An unexpected error occurred while deleting the product.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading product...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Product not found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Product Details</h1>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {!editMode ? (
          <div>
            <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Name:</span> {product.name}</p>
            <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Description:</span> {product.description}</p>
            <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Price:</span> ${product.price.toFixed(2)}</p>
            <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Category:</span> {product.category}</p>
            <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Stock:</span> {product.stock}</p>
            {product.images && product.images.length > 0 && (
              <div className="mt-4">
                <span className="font-semibold">Images:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.images.map((img, index) => (
                    <img key={index} src={img} alt={`${product.name} image ${index + 1}`} className="w-24 h-24 object-cover rounded-md shadow-sm" />
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setEditMode(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
              >
                Edit Product
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
              >
                Delete Product
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
              <input type="number" id="price" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
            </div>
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">Image URLs (comma-separated)</label>
              <input type="text" id="images" value={images} onChange={(e) => setImages(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
              <input type="number" id="stock" value={stock} onChange={(e) => setStock(Number(e.target.value))} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button type="button" onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

