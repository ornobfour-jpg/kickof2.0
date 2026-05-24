import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useShop } from '../../context/shop-context';
import { Button } from '../ui/Button';
import { formatPrice, getImageUrl } from '../../lib/utils';

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, updateQuantity, removeFromCart, products } = useShop();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-zinc-950/70 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex z-50">
        <div className="w-screen max-w-md w-full bg-white h-full flex flex-col shadow-2xl border-l-4 border-brand-green">
          <div className="flex items-center justify-between px-4 py-6 border-b-2 border-zinc-100 bg-zinc-50">
            <h2 className="text-2xl font-heading font-bold italic uppercase tracking-widest flex items-center gap-2 text-zinc-950">
              <ShoppingBag /> Your Cart
            </h2>
            <button onClick={onClose} className="p-2 hover:text-brand-green text-zinc-500 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center text-zinc-400 mt-20 flex flex-col items-center">
                <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
                <p className="font-heading uppercase text-xl font-bold tracking-widest">Your cart is empty.</p>
              </div>
            ) : (
              cart.map((item) => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;
                return (
                  <div key={item.id} className="flex gap-4 border-b-2 border-zinc-100 pb-4">
                    <img src={getImageUrl(product.images[0])} alt={product.name} className="w-24 h-24 object-cover border-2 border-zinc-100" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-heading font-bold uppercase text-lg leading-tight tracking-widest">{product.name}</h3>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mt-1">{item.edition} - Size: {item.size}</p>
                        <p className="font-bold mt-2 text-brand-green">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border-2 border-zinc-200 rounded overflow-hidden">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-zinc-100 text-zinc-600">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-zinc-100 text-zinc-600">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-xs underline font-heading font-bold tracking-widest text-zinc-400 hover:text-red-500 transition-colors uppercase">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t-2 border-zinc-100 p-6 bg-zinc-50">
              <div className="flex justify-between font-heading font-bold uppercase text-xl tracking-widest mb-4 text-zinc-950">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6">Delivery charges calculated at checkout.</p>
              <Button fullWidth onClick={() => { onClose(); navigate('/checkout'); }}>
                Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
