import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/shop-context';
import { Button } from '../components/ui/Button';
import { Size, Edition } from '../types';
import { EDITION_PRICES } from '../data';
import { formatPrice, getImageUrl } from '../lib/utils';
import { ArrowLeft } from 'lucide-react';

const SIZES: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];
const EDITIONS: Edition[] = ['Fan Edition', 'BD Premium Edition', 'Player Edition'];

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useShop();
  const product = products.find(p => p.id === id);

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedEdition, setSelectedEdition] = useState<Edition>('Fan Edition');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <h1 className="font-heading font-bold text-3xl uppercase">Product Not Found</h1>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedEdition}`,
      productId: product.id,
      size: selectedSize,
      edition: selectedEdition,
      quantity: 1,
      price: EDITION_PRICES[selectedEdition]
    });
  };

  const isOutOfStock = Object.values(product.stock).every(s => s === 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20 bg-white"
    >
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm font-heading font-bold uppercase tracking-widest mb-8 hover:text-brand-green transition-colors text-zinc-600"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div className="flex flex-col gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-zinc-100 border-4 border-transparent hover:border-brand-green transition-colors aspect-[3/4] relative overflow-hidden"
          >
            <img 
              src={getImageUrl(product.images[currentImageIndex])} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {product.isWorldCup2026 && (
              <div className="absolute top-4 left-4 bg-brand-green text-white font-heading text-sm font-bold uppercase px-3 py-1 tracking-widest">
                WC 2026
              </div>
            )}
          </motion.div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-20 h-20 flex-shrink-0 border-4 ${currentImageIndex === idx ? 'border-brand-green' : 'border-transparent hover:border-brand-light'} overflow-hidden bg-zinc-100 transition-colors`}
                >
                  <img src={getImageUrl(img)} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-8 border-b-2 border-zinc-100 pb-8">
            <h1 className="font-heading italic font-bold text-4xl lg:text-5xl uppercase tracking-widest mb-2 text-zinc-950">
              {product.name}
            </h1>
            <p className="text-xl text-zinc-500 font-medium mb-4 uppercase tracking-widest">{product.country}</p>
            <p className="text-3xl font-bold bg-zinc-100 px-4 py-2 inline-block rounded text-brand-green">{formatPrice(EDITION_PRICES[selectedEdition])}</p>
          </div>

          <div className="mb-8">
            <p className="font-heading font-bold uppercase tracking-widest mb-4 text-zinc-950">Select Edition</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {EDITIONS.map(ed => (
                <button
                  key={ed}
                  onClick={() => setSelectedEdition(ed)}
                  className={`border-2 p-3 font-heading uppercase text-sm font-bold transition-colors ${selectedEdition === ed ? 'border-brand-green bg-brand-green text-white' : 'border-zinc-200 hover:border-brand-green text-zinc-600'}`}
                >
                  {ed}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <p className="font-heading font-bold uppercase tracking-widest text-zinc-950">Select Size</p>
              <button 
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-zinc-500 hover:text-brand-green font-medium text-sm underline underline-offset-4"
              >
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {SIZES.map(size => {
                const stock = product.stock[size];
                const isAvailable = stock > 0;
                return (
                  <button
                    key={size}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(size)}
                    className={`border-2 py-3 font-heading uppercase font-bold transition-colors
                      ${!isAvailable ? 'border-zinc-100 text-zinc-300 bg-white cursor-not-allowed line-through' : 
                        selectedSize === size ? 'border-brand-green bg-brand-green text-white' : 'border-zinc-200 hover:border-brand-green text-zinc-600'}
                    `}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-12">
            <Button 
              size="lg" 
              fullWidth 
              onClick={handleAddToCart}
              disabled={!selectedSize || isOutOfStock}
            >
              {isOutOfStock ? 'Sold Out' : selectedSize ? 'Add to Cart' : 'Select a Size'}
            </Button>
          </div>

          <div className="prose prose-zinc prose-a:text-brand-green mt-8">
            <p className="font-medium leading-relaxed text-zinc-700">{product.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-500">
              <li>• Premium sweat-wicking fabric</li>
              <li>• Authentic team crest and details</li>
              <li>• Tailored athletic fit</li>
              <li>• 100% recycled polyester</li>
            </ul>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-4 border-brand-green shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b-2 border-zinc-100 mb-4 bg-zinc-50">
                <h3 className="font-heading font-bold text-xl uppercase tracking-widest text-zinc-950">Size Guide</h3>
                <button onClick={() => setIsSizeGuideOpen(false)} className="text-zinc-500 hover:text-brand-green">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-6 pt-0">
                <table className="w-full text-sm text-left">
                  <thead className="font-heading font-bold uppercase tracking-widest text-xs text-zinc-950 bg-zinc-100">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Chest (in)</th>
                      <th className="px-4 py-3">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-zinc-100"><td className="px-4 py-3 font-bold font-heading">S</td><td className="px-4 py-3">36 - 38</td><td className="px-4 py-3">27</td></tr>
                    <tr className="border-b border-zinc-100"><td className="px-4 py-3 font-bold font-heading">M</td><td className="px-4 py-3">38 - 40</td><td className="px-4 py-3">28</td></tr>
                    <tr className="border-b border-zinc-100"><td className="px-4 py-3 font-bold font-heading">L</td><td className="px-4 py-3">40 - 42</td><td className="px-4 py-3">29</td></tr>
                    <tr className="border-b border-zinc-100"><td className="px-4 py-3 font-bold font-heading">XL</td><td className="px-4 py-3">42 - 44</td><td className="px-4 py-3">30</td></tr>
                    <tr><td className="px-4 py-3 font-bold font-heading">XXL</td><td className="px-4 py-3">44 - 46</td><td className="px-4 py-3">31</td></tr>
                  </tbody>
                </table>
                <p className="text-sm text-zinc-500 mt-6">* Note: Player edition jerseys run slightly tighter for an athletic fit. Consider sizing up if you prefer a looser fit.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
