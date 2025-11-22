'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, you would check for an authentication token/session here
    // For demonstration, let's assume a 'token' in localStorage indicates auth status
    const token = localStorage.getItem('authToken'); 
    setIsAuthenticated(!!token);
  }, []);

  // Sync search term from URL when component mounts or URL changes
  useEffect(() => {
    setSearchTerm(searchParams.get('name') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?name=${searchTerm.trim()}`);
    } else {
      router.push('/'); // Clear search if input is empty
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Assuming successful logout also clears client-side token/session
        localStorage.removeItem('authToken'); 
        setIsAuthenticated(false);
        router.push('/login');
      } else {
        const data = await response.json();
        console.error('Logout failed:', data.message);
        alert(data.message || 'Logout failed.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout.');
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          E-commerce
        </Link>
        <form onSubmit={handleSearch} className="flex-grow max-w-sm mx-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          {!isAuthenticated ? (
            <>
              <li>
                <Link href="/login" className="hover:text-gray-300">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-gray-300">
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/products/create" className="hover:text-gray-300">
                  Create Product
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:text-gray-300">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
