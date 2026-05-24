import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useShop } from '../../context/shop-context';
import { LayoutDashboard, PackageSearch, ShoppingCart, LogOut } from 'lucide-react';

export const AdminLayout = () => {
  const { isAdmin, setIsAdmin } = useShop();

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-zinc-950 text-white flex flex-col border-r-4 border-brand-green">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="font-heading font-bold text-3xl italic uppercase tracking-widest text-brand-light">KICK OFF <span className="text-white">2.0</span></h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-heading">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <NavLink 
            to="/admin" 
            end
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 font-heading uppercase text-sm font-bold transition-colors ${isActive ? 'bg-brand-green text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Overview
          </NavLink>
          <NavLink 
            to="/admin/products"
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 font-heading uppercase text-sm font-bold transition-colors ${isActive ? 'bg-brand-green text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            <PackageSearch className="w-5 h-5" /> Products
          </NavLink>
          <NavLink 
            to="/admin/orders"
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 font-heading uppercase text-sm font-bold transition-colors ${isActive ? 'bg-brand-green text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            <ShoppingCart className="w-5 h-5" /> Orders
          </NavLink>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 font-heading uppercase text-sm font-bold text-red-500 hover:text-red-400 transition-colors w-full">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
