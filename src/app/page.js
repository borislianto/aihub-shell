'use client';

import { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleGoogleSuccess = async (response) => {
    try {
      // Untuk demo sementara, simpan token
      localStorage.setItem('tempAuthToken', response.credential);
      router.push('/register');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Hub Shell</h1>
          <p className="mt-2 text-gray-600">
            Your integrated AI assistant platform
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Login Failed')}
              useOneTap
            />
          </div>
        </div>
      </div>
    </main>
  );
}