import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useShop } from '../context/shop-context';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../lib/utils';
import { AccountModal } from '../components/AccountModal';

export const Checkout = () => {
  const { cart, products, userEmail, addOrder, clearCart } = useShop();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    division: '',
    zilla: '',
    thana: '',
    address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = formData.division === 'Dhaka' ? 60 : (formData.division ? 120 : 0);
  const total = subtotal + deliveryCharge;

  const validatePhone = (phone: string) => {
    return /^01\d{9}$/.test(phone);
  };

  const handleValidation = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Must be a valid BD number (e.g. 017XXXXXXXX)';
    }
    if (!formData.division.trim()) newErrors.division = 'Division is required';
    if (!formData.zilla.trim()) newErrors.zilla = 'Zilla is required';
    if (!formData.thana.trim()) newErrors.thana = 'Thana is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidation()) return;
    
    if (!userEmail) {
      setShowModal(true);
    } else {
      processOrder();
    }
  };

  const processOrder = () => {
    const newOrder = {
      id: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      date: new Date().toISOString(),
      items: cart,
      total,
      deliveryCharge,
      status: 'Pending' as const,
      customerInfo: formData
    };
    addOrder(newOrder);
    clearCart();
    navigate('/order-track', { state: { orderId: newOrder.id } });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
        <h1 className="font-heading font-bold text-3xl uppercase mb-6">Your cart is empty</h1>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20 bg-white"
      >
        <h1 className="text-4xl font-heading italic font-bold uppercase tracking-widest text-zinc-950 mb-8 border-b-4 border-brand-green pb-4">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3">
            <div className="bg-zinc-50 p-6 border-4 border-transparent shadow shadow-zinc-200">
              <h2 className="font-heading font-bold text-xl uppercase tracking-widest mb-6 border-b-2 border-zinc-200 pb-4 text-zinc-950">Shipping Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-zinc-600">Full Name</label>
                    <input 
                      type="text" 
                      className={`w-full border-2 p-3 focus:outline-none focus:ring-0 ${errors.name ? 'border-red-500' : 'border-zinc-300 focus:border-brand-green'}`}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-zinc-600">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="01XXXXXXXXX"
                      className={`w-full border-2 p-3 focus:outline-none focus:ring-0 ${errors.phone ? 'border-red-500' : 'border-zinc-300 focus:border-brand-green'}`}
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-bold">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-zinc-600">Division</label>
                    <select 
                      className={`w-full border-2 p-3 focus:outline-none focus:ring-0 appearance-none bg-white rounded-none ${errors.division ? 'border-red-500' : 'border-zinc-300 focus:border-brand-green'}`}
                      value={formData.division}
                      onChange={e => setFormData({...formData, division: e.target.value})}
                    >
                      <option value="">Select Division</option>
                      {["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"].map(div => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                    {errors.division && <p className="text-red-500 text-xs mt-1 font-bold">{errors.division}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-zinc-600">Zilla (District)</label>
                    <input 
                      list="bd-zillas"
                      placeholder="e.g. Dhaka"
                      className={`w-full border-2 p-3 focus:outline-none focus:ring-0 ${errors.zilla ? 'border-red-500' : 'border-zinc-300 focus:border-brand-green'}`}
                      value={formData.zilla}
                      onChange={e => setFormData({...formData, zilla: e.target.value})}
                    />
                    <datalist id="bd-zillas">
                      {["Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur", "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail", "Brahmanbaria", "Cumilla", "Chandpur", "Lakshmipur", "Noakhali", "Feni", "Khagrachhari", "Rangamati", "Bandarban", "Chattogram", "Cox's Bazar", "Sirajganj", "Pabna", "Bogura", "Rajshahi", "Natore", "Joypurhat", "Chapainawabganj", "Naogaon", "Jashore", "Satkhira", "Meherpur", "Narail", "Chuadanga", "Kushtia", "Magura", "Khulna", "Bagerhat", "Jhenaidah", "Jhalokati", "Patuakhali", "Pirojpur", "Barishal", "Bhola", "Barguna", "Sylhet", "Moulvibazar", "Habiganj", "Sunamganj", "Panchagarh", "Dinajpur", "Lalmonirhat", "Nilphamari", "Gaibandha", "Thakurgaon", "Rangpur", "Kurigram", "Sherpur", "Mymensingh", "Jamalpur", "Netrokona"].map(z => (
                        <option key={z} value={z} />
                      ))}
                    </datalist>
                    {errors.zilla && <p className="text-red-500 text-xs mt-1 font-bold">{errors.zilla}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-zinc-600">Thana</label>
                    <input 
                      list="bd-thanas"
                      placeholder="e.g. Mirpur, Gulshan"
                      className={`w-full border-2 p-3 focus:outline-none focus:ring-0 ${errors.thana ? 'border-red-500' : 'border-zinc-300 focus:border-brand-green'}`}
                      value={formData.thana}
                      onChange={e => setFormData({...formData, thana: e.target.value})}
                    />
                    <datalist id="bd-thanas">
                       {["Mirpur", "Gulshan", "Banani", "Uttara", "Mohammadpur", "Dhanmondi", "Badda", "Tejgaon", "Khilgaon", "Jatrabari", "Paltan", "Motijheel", "Savar", "Keraniganj", "Tongi"].map(t => (
                        <option key={t} value={t} />
                      ))}
                    </datalist>
                    {errors.thana && <p className="text-red-500 text-xs mt-1 font-bold">{errors.thana}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-zinc-600">Full Address</label>
                  <textarea 
                    rows={3}
                    className={`w-full border-2 p-3 focus:outline-none focus:ring-0 ${errors.address ? 'border-red-500' : 'border-zinc-300 focus:border-brand-green'}`}
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1 font-bold">{errors.address}</p>}
                </div>

                <div className="pt-6">
                  <Button type="submit" size="lg" fullWidth>Place Order</Button>
                </div>
              </form>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 border-4 border-brand-green shadow-xl">
              <h2 className="font-heading font-bold text-xl uppercase tracking-widest mb-6 border-b-2 border-zinc-100 pb-4 text-zinc-950">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if(!product) return null;
                  return (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-brand-green">{item.quantity}x</span>
                        <div className="font-medium">
                          <p className="uppercase tracking-widest text-zinc-950">{product.name}</p>
                          <p className="text-zinc-500 text-xs">{item.size} / {item.edition}</p>
                        </div>
                      </div>
                      <span className="font-bold text-zinc-950">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t-2 border-zinc-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Subtotal</span>
                  <span className="font-bold text-zinc-950">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Delivery</span>
                  <span className="font-bold text-zinc-950">{deliveryCharge ? formatPrice(deliveryCharge) : 'Select District'}</span>
                </div>
                <div className="flex justify-between text-xl font-heading font-bold uppercase pt-4 border-t-4 border-brand-green mt-4 text-zinc-950 text-2xl">
                  <span>Total</span>
                  <span className="text-brand-green">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AccountModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onContinueGuest={() => {
          setShowModal(false);
          processOrder();
        }}
        onLoginClick={() => {
          setShowModal(false);
          navigate('/login');
        }}
      />
    </>
  );
};
