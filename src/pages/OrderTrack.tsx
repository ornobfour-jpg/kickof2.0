import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useShop } from '../context/shop-context';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../lib/utils';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export const OrderTrack = () => {
  const { orders, products } = useShop();
  const location = useLocation();
  const [searchId, setSearchId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.orderId) {
      setSearchId(location.state.orderId);
      handleSearch(location.state.orderId);
    }
  }, [location]);

  const handleSearch = (idToSearch = searchId) => {
    setError('');
    const found = orders.find(o => o.id === idToSearch.trim());
    if (found) {
      setOrder(found);
    } else {
      setOrder(null);
      setError('Order not found. Please check your Order ID.');
    }
  };

  const statusMap = {
    'Pending': { icon: Clock, color: 'text-yellow-600' },
    'Processing': { icon: Package, color: 'text-blue-600' },
    'Shipped': { icon: Truck, color: 'text-indigo-600' },
    'Delivered': { icon: CheckCircle, color: 'text-green-600' },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20 bg-white"
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl font-heading italic font-bold uppercase tracking-widest text-zinc-950 mb-4">Track Order</h1>
        <p className="text-zinc-500 font-medium max-w-lg mx-auto">Enter your Order ID to view the current status and digital invoice.</p>
        
        <div className="mt-8 flex max-w-md mx-auto gap-2">
          <input 
            type="text" 
            placeholder="e.g. ORD-12345" 
            className="flex-1 border-2 border-zinc-200 focus:border-brand-green p-3 outline-none"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <Button onClick={() => handleSearch()}>Track</Button>
        </div>
        {error && <p className="text-red-500 font-bold mt-2 text-sm">{error}</p>}
      </div>

      {order && (
        <div className="bg-zinc-50 border-4 border-brand-green shadow-xl p-8 lg:p-12 print:shadow-none print:border-none print:p-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b-2 border-zinc-200 pb-8">
            <div>
              <h2 className="text-4xl font-heading italic font-bold uppercase tracking-widest text-zinc-950">Invoice</h2>
              <p className="text-zinc-500 font-mono mt-1 font-bold">#{order.id}</p>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <p className="font-bold uppercase tracking-widest text-sm text-brand-green">KICK OFF 2.0</p>
              <p className="text-zinc-500 text-sm">support@kickoff2.0</p>
              <p className="text-zinc-500 text-sm mt-2 font-bold">{new Date(order.date).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-12">
            <div className={`inline-flex items-center gap-2 px-4 py-2 border-2 ${statusMap[order.status as keyof typeof statusMap].color} border-current bg-white mb-8 shadow-sm`}>
              {React.createElement(statusMap[order.status as keyof typeof statusMap].icon, { className: 'w-5 h-5' })}
              <span className="font-heading font-bold uppercase tracking-widest text-sm">Status: {order.status}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-zinc-950">
              <div>
                <p className="font-heading font-bold uppercase tracking-widest text-zinc-400 text-xs mb-2">Billed To</p>
                <p className="font-bold">{order.customerInfo.name}</p>
                <p className="text-zinc-600">{order.customerInfo.phone}</p>
              </div>
              <div>
                <p className="font-heading font-bold uppercase tracking-widest text-zinc-400 text-xs mb-2">Shipped To</p>
                <p className="font-bold">{order.customerInfo.address}</p>
                <p className="text-zinc-600">{order.customerInfo.thana}, {order.customerInfo.zilla}, {order.customerInfo.division}</p>
              </div>
            </div>
          </div>

          <table className="w-full mb-12 text-zinc-950">
            <thead>
              <tr className="border-b-4 border-brand-green font-heading text-sm uppercase tracking-widest text-left">
                <th className="py-4 font-bold">Item</th>
                <th className="py-4 font-bold text-center">Qty</th>
                <th className="py-4 font-bold text-right">Price</th>
                <th className="py-4 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <tr key={item.id} className="border-b-2 border-zinc-100">
                    <td className="py-4">
                      <p className="font-bold text-sm uppercase">{product?.name || 'Unknown Item'}</p>
                      <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{item.edition} - {item.size}</p>
                    </td>
                    <td className="py-4 text-center font-mono font-bold">{item.quantity}</td>
                    <td className="py-4 text-right font-mono font-bold text-zinc-600">{formatPrice(item.price)}</td>
                    <td className="py-4 text-right font-bold font-mono text-brand-green">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-end text-zinc-950">
            <div className="w-full md:w-1/2 space-y-3">
              <div className="flex justify-between text-sm text-zinc-600 font-bold uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="font-mono text-zinc-950">{formatPrice(order.total - order.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-600 font-bold uppercase tracking-widest">
                <span>Delivery Charge</span>
                <span className="font-mono text-zinc-950">{formatPrice(order.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t-4 border-brand-green font-heading font-bold uppercase text-2xl">
                <span>Total</span>
                <span className="font-mono text-brand-green">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center print:hidden">
            <Button variant="outline" onClick={() => window.print()}>Print Invoice</Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
