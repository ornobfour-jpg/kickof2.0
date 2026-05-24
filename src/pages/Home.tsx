import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { formatPrice, getImageUrl } from '../lib/utils';
import { EDITION_PRICES, POPULAR_CATEGORIES } from '../data';

export const Home = () => {
    const { products, addToCart } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<string>('all');

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `${product.id}-M-Fan Edition`,
      productId: product.id,
      size: 'M',
      edition: 'Fan Edition',
      quantity: 1,
      price: EDITION_PRICES['Fan Edition']
    });
  };

  const query = searchParams.get('q');
  const cat = searchParams.get('category');

  useEffect(() => {
    if (cat) {
      setFilter(cat);
    } else {
      setFilter('all');
    }
  }, [cat]);

  let displayedProducts = products;
  
  if (filter === 'wc2026') {
    displayedProducts = displayedProducts.filter(p => p.isWorldCup2026);
  } else if (filter !== 'all') {
    displayedProducts = displayedProducts.filter(p => 
      p.country.toLowerCase() === filter.toLowerCase() || 
      p.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (query) {
    displayedProducts = displayedProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.country.toLowerCase().includes(query.toLowerCase())
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white min-h-screen"
    >
      {/* Hero Section */}
      <div className="relative bg-zinc-950 text-white h-[60vh] md:h-[70vh] mb-8 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://i.postimg.cc/vHt9fnnm/IMG-20260523-153252.png" 
            alt="World Cup 2026 Collection" 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="absolute top-4 md:top-8 left-0 right-0 z-20 flex flex-col items-center justify-start text-center px-4">
          <span className="bg-brand-green text-white font-heading font-bold uppercase tracking-widest px-2 py-1 text-[10px] md:text-xs mb-1 md:mb-2 inline-block shadow-md leading-none">New Drop</span>
          <h1 className="text-3xl md:text-5xl lg:text-7xl text-white font-heading italic font-bold uppercase tracking-widest drop-shadow-md leading-tight mt-1">
            World Cup '26<span className="hidden md:inline"> </span><br className="md:hidden" />Collection
          </h1>
        </div>
        
        <div className="absolute bottom-12 md:bottom-16 left-0 right-0 z-20 flex justify-center">
          <button 
            onClick={(e) => { 
              e.stopPropagation();
              setFilter('wc2026'); 
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }); 
            }}
            className="uppercase font-heading italic font-bold tracking-widest text-xs md:text-base bg-brand-green text-white px-8 py-3 md:px-10 md:py-4 hover:bg-brand-light transition-colors shadow-xl"
          >
            Shop The Drop
          </button>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
          <button 
            onClick={() => setFilter('all')}
            className={`whitespace-nowrap px-6 py-2 border-2 font-heading font-bold text-sm uppercase tracking-widest transition-colors snap-start flex-shrink-0 ${filter === 'all' ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-transparent text-zinc-600 border-zinc-200 hover:border-zinc-300'}`}
          >
            All Teams
          </button>
          {POPULAR_CATEGORIES.map(category => (
            <button 
              key={category}
              onClick={() => setFilter(category)}
              className={`whitespace-nowrap px-6 py-2 border-2 font-heading font-bold text-sm uppercase tracking-widest transition-colors snap-start flex-shrink-0 ${filter === category ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-transparent text-zinc-600 border-zinc-200 hover:border-zinc-300'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 mb-20 scroll-mt-20">
        <div className="flex justify-between items-center mb-8 border-b-4 border-brand-green pb-4">
          <h2 className="text-2xl sm:text-4xl font-heading italic font-bold uppercase tracking-widest text-zinc-950">
            {query ? `Search: "${query}"` : 'All Kits'}
          </h2>
          <div className="flex gap-4">
            <button 
              onClick={() => { setFilter('all'); setSearchParams(''); }}
              className={`font-heading uppercase font-bold text-sm sm:text-base tracking-widest ${filter === 'all' && !query ? 'text-brand-green border-b-2 border-brand-green' : 'text-zinc-400 hover:text-brand-green'}`}
            >
              Show All
            </button>
            <button 
              onClick={() => { setFilter('wc2026'); setSearchParams(''); }}
              className={`font-heading uppercase font-bold text-sm sm:text-base tracking-widest ${filter === 'wc2026' ? 'text-brand-green border-b-2 border-brand-green' : 'text-zinc-400 hover:text-brand-green'}`}
            >
              WC 2026
            </button>
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6"
        >
          <AnimatePresence>
            {displayedProducts.map((product) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={product.id}
              >
                <Link to={`/products/${product.id}`} className="group block">
                  <div className="relative aspect-[3/4] mb-3 lg:mb-4 overflow-hidden bg-zinc-100 border-4 border-transparent group-hover:border-brand-green transition-colors">
                    <img 
                      src={getImageUrl(product.images[0])} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isWorldCup2026 && (
                      <div className="absolute top-2 left-2 bg-brand-green text-white font-heading text-[10px] sm:text-xs font-bold uppercase px-2 py-1 tracking-widest">
                        WC 2026
                      </div>
                    )}
                    {Object.values(product.stock).every(s => s === 0) ? (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm">
                        <span className="font-heading font-bold text-sm lg:text-xl uppercase tracking-widest border-4 border-red-600 text-red-600 px-2 lg:px-4 py-1 lg:py-2 rotate-[-5deg] bg-white">Sold Out</span>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="absolute bottom-4 left-4 right-4 bg-zinc-950/90 backdrop-blur text-brand-light font-heading font-bold uppercase tracking-widest text-xs py-3 px-4 shadow-xl opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0"
                      >
                        Quick Add (M)
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <div>
                      <h3 className="font-heading italic font-bold uppercase text-lg lg:text-xl leading-tight tracking-widest text-zinc-950">{product.name}</h3>
                      <p className="text-zinc-500 font-medium text-xs lg:text-sm mt-1 uppercase tracking-widest">{product.country}</p>
                    </div>
                    <span className="font-bold text-sm whitespace-nowrap text-brand-green bg-zinc-100 px-2 py-1 rounded">
                      {formatPrice(EDITION_PRICES['Fan Edition'])}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {displayedProducts.length === 0 && (
          <div className="text-center py-20 text-zinc-500 font-heading uppercase font-bold tracking-widest">
            No kits found matching your criteria.
          </div>
        )}
      </div>
    </motion.div>
  );
};
