import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/ui/Button';

export const Login = () => {
  const navigate = useNavigate();
  const { setIsAdmin, setUserEmail } = useShop();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email === 'admin1234@gmail.com' && password === 'admin123') {
      setIsAdmin(true);
      setUserEmail(email);
      navigate('/admin');
    } else if (email && password) {
      // Dummy generic user login
      setUserEmail(email);
      navigate('/');
    } else {
      setError('Please enter both email and password.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-zinc-50">
      <div className="w-full max-w-md bg-white border-4 border-brand-green p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-heading font-bold italic uppercase tracking-widest text-zinc-950 mb-2">Access Portal</h1>
          <p className="text-zinc-500 font-medium text-sm tracking-widest uppercase">Sign in to your account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <p className="text-red-600 font-bold text-sm text-center border-2 border-red-600 bg-red-50 py-2">{error}</p>}
          
          <div>
            <label className="block font-heading font-bold uppercase tracking-widest text-xs mb-2 text-zinc-500">Email Address</label>
            <input 
              type="email" 
              className="w-full border-2 border-zinc-200 p-3 focus:outline-none focus:border-brand-green font-medium" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block font-heading font-bold uppercase tracking-widest text-xs mb-2 text-zinc-500">Password</label>
            <input 
              type="password" 
              className="w-full border-2 border-zinc-200 p-3 focus:outline-none focus:border-brand-green font-medium" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" size="lg" fullWidth>Enter</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
