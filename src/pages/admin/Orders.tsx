import React, { useState } from 'react';
import { useShop } from '../../context/shop-context';
import { formatPrice } from '../../lib/utils';
import { Search, Trash2 } from 'lucide-react';

export const AdminOrders = () => {
  const { orders, updateOrderStatus, removeOrder } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold italic uppercase tracking-widest text-zinc-950 mb-2">Order Fulfillment</h1>
        <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">Track and update customer order statuses.</p>
      </div>

      <div className="bg-white border-2 border-zinc-200 shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex flex-1 items-center gap-2 border-2 border-zinc-200 px-4 py-2 focus-within:border-brand-green transition-colors">
          <Search className="w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search Order ID or Customer..." 
            className="flex-1 outline-none font-medium text-zinc-950 placeholder:text-zinc-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="border-2 border-zinc-200 bg-white px-4 py-2 outline-none font-medium focus:border-brand-green text-zinc-950"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div className="bg-white border-2 border-zinc-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-zinc-950">
            <thead>
              <tr className="border-b-4 border-brand-green font-heading text-xs uppercase tracking-widest text-zinc-500 bg-zinc-50">
                <th className="p-4 font-bold">Order Details</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold text-center">Items</th>
                <th className="p-4 font-bold text-right">Total</th>
                <th className="p-4 font-bold text-right">Status Action</th>
                <th className="p-4 font-bold text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-b-2 border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="p-4">
                    <p className="font-mono font-bold text-sm">{order.id}</p>
                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">{new Date(order.date).toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-sm uppercase">{order.customerInfo.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">{order.customerInfo.phone} • {order.customerInfo.zilla}</p>
                  </td>
                  <td className="p-4 text-center font-mono font-bold text-brand-green">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="p-4 text-right font-mono font-bold">
                    {formatPrice(order.total)}
                  </td>
                  <td className="p-4 text-right">
                     <select 
                        className={`text-xs font-heading font-bold uppercase tracking-widest border-2 px-2 py-1 outline-none appearance-none cursor-pointer text-center
                        ${
                            order.status === 'Pending' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                            order.status === 'Processing' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                            order.status === 'Shipped' ? 'border-indigo-500 text-indigo-700 bg-indigo-50' :
                            'border-green-500 text-green-700 bg-green-50'
                        }`}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                     >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                     </select>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => removeOrder(order.id)} className="text-red-500 hover:text-red-700 p-2 border-2 border-transparent hover:border-red-200 transition-colors bg-white shadow-sm">
                      <Trash2 className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 font-medium uppercase tracking-widest text-sm">No matching orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
