"use client";

import { useEffect, useState } from 'react';
import SignInPageDemo from "@/components/ui/demo";

interface User {
  name: string;
  email: string;
  picture: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for user data in URL params (from OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    const errorParam = urlParams.get('error');

    if (userParam) {
      try {
        const userData = JSON.parse(userParam);
        setUser(userData);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    if (errorParam) {
      setError('Authentication failed. Please try again.');
    }
  }, []);

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full bg-card rounded-2xl p-8 shadow-lg">
          <div className="text-center">
            <img 
              src={user.picture} 
              alt="Profile" 
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <h1 className="text-2xl font-semibold mb-2">Welcome, {user.name}!</h1>
            <p className="text-muted-foreground mb-6">{user.email}</p>
            <button 
              onClick={() => setUser(null)}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="fixed top-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg z-50">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-4 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}
      <SignInPageDemo />
    </div>
  );
}
