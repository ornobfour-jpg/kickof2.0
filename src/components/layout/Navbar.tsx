import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react';
import { useShop } from '../../context/shop-context';
import { cn } from '../../lib/utils';
import { CartDrawer } from './CartDrawer';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { cart, isAdmin, userEmail, setIsAdmin, setUserEmail } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setIsOpen(false);
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    setIsAdmin(false);
    setUserEmail(null);
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-zinc-950 text-white border-b-4 border-brand-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white md:hidden hover:text-brand-light focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/" className={cn("ml-4 md:ml-0 flex-shrink-0 items-center drop-shadow-md", isSearchOpen ? "hidden sm:flex" : "flex")}>
                <span className="font-heading italic font-bold text-3xl md:text-4xl tracking-widest uppercase whitespace-nowrap text-brand-light">KICK OFF <span className="text-white">2.0</span></span>
              </Link>
            </div>
            
            <div className="hidden md:flex md:space-x-6 lg:space-x-8 items-center">
              <Link to="/" className="text-white font-heading text-lg font-bold uppercase tracking-widest hover:text-brand-light transition-colors">Drops</Link>
              <Link to="/?category=wc2026" className="text-white font-heading text-lg font-bold uppercase tracking-widest hover:text-brand-light transition-colors">WC 2026</Link>
              <Link to="/order-track" className="text-white font-heading text-lg font-bold uppercase tracking-widest hover:text-brand-light transition-colors">Track Order</Link>
              {isAdmin && (
                <Link to="/admin" className="text-brand-light font-heading text-lg font-bold uppercase tracking-widest hover:text-white transition-colors">Admin</Link>
              )}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative flex">
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search kits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "transition-all duration-300 outline-none border-b-2 border-brand-green bg-transparent font-medium py-1 text-sm sm:text-base text-white placeholder-zinc-400",
                      isSearchOpen ? "w-28 sm:w-32 lg:w-48 opacity-100" : "w-0 opacity-0 border-transparent p-0"
                    )}
                  />
                  <button 
                    type={isSearchOpen ? "submit" : "button"}
                    onClick={isSearchOpen ? undefined : () => setIsSearchOpen(true)}
                    className="text-white hover:text-brand-light transition-colors ml-1 sm:ml-2"
                  >
                    <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </form>
              </div>
              {userEmail ? (
                <button onClick={handleLogout} className="text-sm font-heading hidden sm:block uppercase tracking-widest text-brand-light hover:text-white">Log out</button>
              ) : (
                <Link to="/login" className="text-white hover:text-brand-light transition-colors">
                  <User className="h-5 w-5 sm:h-6 sm:w-6" />
                </Link>
              )}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-white hover:text-brand-light transition-colors relative"
              >
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-green text-zinc-950 text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 sm:text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-zinc-900 border-b-4 border-brand-green">
            <form onSubmit={handleSearchSubmit} className="mb-2 px-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search kits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-zinc-700 bg-zinc-800 text-white placeholder-zinc-400 p-2 pl-9 focus:outline-none focus:border-brand-green font-medium"
                />
                <Search className="h-5 w-5 absolute left-3 top-2.5 text-zinc-400" />
              </div>
            </form>
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-lg font-heading uppercase tracking-widest font-bold text-white hover:bg-zinc-800">Drops</Link>
            <Link to="/?category=wc2026" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-lg font-heading uppercase tracking-widest font-bold text-white hover:bg-zinc-800">WC 2026</Link>
            <Link to="/order-track" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-lg font-heading uppercase tracking-widest font-bold text-white hover:bg-zinc-800">Track Order</Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-lg font-heading uppercase tracking-widest font-bold text-brand-light hover:bg-zinc-800">Admin Area</Link>
            )}
            {userEmail && (
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-lg font-heading uppercase tracking-widest font-bold text-red-500 hover:bg-zinc-800">Log out</button>
            )}
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
