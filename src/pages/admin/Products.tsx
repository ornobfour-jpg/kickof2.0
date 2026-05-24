import React, { useState } from 'react';
import { useShop } from '../../context/shop-context';
import { Button } from '../../components/ui/Button';
import { formatPrice, getImageUrl } from '../../lib/utils';
import { EDITION_PRICES, POPULAR_CATEGORIES } from '../../data';
import { Search, Plus, X, Trash2 } from 'lucide-react';
import { Product } from '../../types';

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, removeProduct } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    country: '',
    description: '',
    images: '',
    isWorldCup2026: false,
    stockS: 0,
    stockM: 0,
    stockL: 0,
    stockXL: 0,
    stockXXL: 0
  });
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    country: '',
    description: '',
    images: '',
    isWorldCup2026: false,
    stockS: 0,
    stockM: 0,
    stockL: 0,
    stockXL: 0,
    stockXXL: 0
  });

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.images || !newProduct.country) return;
    
    const product: Product = {
      id: `prod_${Date.now()}`,
      name: newProduct.name,
      country: newProduct.country,
      description: newProduct.description,
      images: newProduct.images.split(',').map(s=>s.trim()).filter(Boolean),
      isWorldCup2026: newProduct.isWorldCup2026,
      stock: {
        S: Number(newProduct.stockS),
        M: Number(newProduct.stockM),
        L: Number(newProduct.stockL),
        XL: Number(newProduct.stockXL),
        XXL: Number(newProduct.stockXXL),
      }
    };
    
    addProduct(product);
    setIsAddModalOpen(false);
    setNewProduct({
      name: '', country: '', description: '', images: '', isWorldCup2026: false,
      stockS: 0, stockM: 0, stockL: 0, stockXL: 0, stockXXL: 0
    });
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      country: product.country,
      description: product.description,
      images: product.images.join(', '),
      isWorldCup2026: product.isWorldCup2026,
      stockS: product.stock.S,
      stockM: product.stock.M,
      stockL: product.stock.L,
      stockXL: product.stock.XL,
      stockXXL: product.stock.XXL
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct({
      ...editingProduct,
      name: editForm.name,
      country: editForm.country,
      description: editForm.description,
      images: editForm.images.split(',').map(s=>s.trim()).filter(Boolean),
      isWorldCup2026: editForm.isWorldCup2026,
      stock: {
        S: editForm.stockS,
        M: editForm.stockM,
        L: editForm.stockL,
        XL: editForm.stockXL,
        XXL: editForm.stockXXL
      }
    });
    setEditingProduct(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold italic uppercase tracking-widest text-zinc-950 mb-2">Products Matrix</h1>
          <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">Manage stock and editions across the catalog.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-brand-green text-zinc-950 hover:bg-brand-light"><Plus className="w-5 h-5" /> Add Product</Button>
      </div>

      <div className="bg-white border-2 border-zinc-200 shadow-sm p-6 mb-8">
        <div className="flex items-center gap-2 border-2 border-zinc-200 px-4 py-2 focus-within:border-brand-green transition-colors w-full max-w-md">
          <Search className="w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="flex-1 outline-none font-medium text-zinc-950 placeholder:text-zinc-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered.map(product => (
          <div key={product.id} className="bg-white border-2 border-zinc-200 shadow-sm flex flex-col sm:flex-row hover:border-brand-green transition-colors">
            <div className="w-full sm:w-48 border-b-2 sm:border-b-0 sm:border-r-2 border-zinc-100 bg-zinc-50 p-2">
              <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-contain aspect-square sm:aspect-auto grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-bold italic uppercase tracking-widest text-lg text-zinc-950">{product.name}</h3>
                  {product.isWorldCup2026 && (
                    <span className="bg-brand-green text-zinc-950 font-heading font-bold uppercase tracking-widest text-xs px-2 py-1">WC26</span>
                  )}
                </div>
                <p className="text-zinc-500 text-sm font-medium mb-4 uppercase tracking-widest">{product.country}</p>
                
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-heading font-bold uppercase tracking-widest text-brand-green">Stock Matrix</p>
                  <div className="flex gap-2">
                    {Object.entries(product.stock).map(([size, count]) => (
                      <div key={size} className="flex-1 border-2 border-zinc-200 bg-white py-1 text-center">
                        <p className="font-heading font-bold text-zinc-950">{size}</p>
                        <p className={`font-mono text-sm font-bold ${count === 0 ? 'text-red-500' : 'text-zinc-500'}`}>{count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t-2 border-zinc-100 pt-4 mt-2">
                <Button variant="ghost" size="sm" onClick={() => removeProduct(product.id)} className="text-red-500 hover:bg-red-50 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(product)} className="border-brand-green text-brand-green hover:bg-brand-green hover:text-zinc-950">Edit Product</Button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 font-heading font-bold uppercase tracking-widest border-2 border-dashed border-zinc-300">
            No products found
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-brand-green p-6 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b-2 border-zinc-100 pb-4">
              <h2 className="text-2xl font-heading font-bold italic uppercase tracking-widest text-zinc-950">Edit Product: {editingProduct.name}</h2>
              <button onClick={() => setEditingProduct(null)} className="text-zinc-500 hover:text-brand-green transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-widest text-zinc-500 mb-1">Product Name *</label>
                  <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full border-2 border-zinc-200 focus:border-brand-green outline-none p-3 font-medium transition-colors text-zinc-950" placeholder="e.g. Argentina Home Jersey" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-bold uppercase tracking-widest text-zinc-500 mb-1">Country / Team *</label>
                    <input list="popular-teams-edit" required type="text" value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})} className="w-full border-2 border-zinc-200 focus:border-brand-green outline-none p-3 font-medium transition-colors text-zinc-950" placeholder="e.g. Argentina" />
                    <datalist id="popular-teams-edit">
                      {POPULAR_CATEGORIES.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer font-heading font-bold uppercase tracking-widest text-sm text-zinc-950">
                      <input type="checkbox" checked={editForm.isWorldCup2026} onChange={e => setEditForm({...editForm, isWorldCup2026: e.target.checked})} className="w-5 h-5 accent-brand-green" />
                      World Cup 2026 Collection
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-widest text-zinc-500 mb-1">Image URLs (comma separated) *</label>
                  <input required type="text" value={editForm.images} onChange={e => setEditForm({...editForm, images: e.target.value})} className="w-full border-2 border-zinc-200 focus:border-brand-green outline-none p-3 font-medium transition-colors text-zinc-950" placeholder="https://..., https://..." />
                  {editForm.images && editForm.images.split(',')[0] && (
                    <div className="mt-2 w-32 h-32 border-2 border-zinc-200 bg-white overflow-hidden p-2">
                       <img src={getImageUrl(editForm.images.split(',')[0].trim())} alt="Preview" className="w-full h-full object-contain grayscale" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-widest text-zinc-500 mb-1">Description</label>
                  <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full border-2 border-zinc-200 focus:border-brand-green outline-none p-3 font-medium transition-colors resize-none h-24 text-zinc-950" placeholder="Product details..."></textarea>
                </div>

                <div>
                  <label className="block text-sm font-heading font-bold uppercase tracking-widest text-brand-green mb-2">Update Stock levels</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <div key={size}>
                        <label className="block text-xs font-bold text-zinc-500 mb-1 text-center font-heading">{size}</label>
                        <input type="number" min="0" value={editForm[`stock${size}` as keyof typeof editForm] as number} onChange={e => setEditForm({...editForm, [`stock${size}`]: parseInt(e.target.value) || 0})} className="w-full border-2 border-zinc-200 focus:border-brand-green outline-none p-2 text-center font-mono transition-colors text-zinc-950 font-bold" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t-2 border-zinc-100">
                <Button type="button" variant="ghost" onClick={() => setEditingProduct(null)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-brand-green p-6 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b-2 border-zinc-100 pb-4">
              <h2 className="text-2xl font-heading font-bold italic uppercase tracking-widest text-zinc-950">Add New Product</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-500 hover:text-brand-green transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-widest text-zinc-500 mb-1">Product Name *</label>
                  <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full border-2 border-zinc-200 focus:border-brand-green outline-none p-3 font-medium transition-colors text-zinc-950" placeholder="e.g. Argentina Home Jersey" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-bold uppercase tracking-widest text-zinc-500 mb-1">Country / Team *</label>
                    <input list="popular-teams" required type="text" value={newProduct.country} onChange={e => setNewProduct({...newProduct, country: e.target.value})} className="w-full border-2 border-zinc-200 focus:border-brand-green outline-none p-3 font-medium transition-colors text-zinc-950" placeholder="e.g. Argentina" />
                    <datalist id="popular-teams">
                      {POPULAR_CATEGORIES.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer font-heading font-bold uppercase tracking-widest text-sm text-zinc-950">
                      <input type="checkbox" checked={newProduct.isWorldCup2026} onChange={e => setNewProduct({...newProduct, isWorldCup2026: e.target.checked})} className="w-5 h-5 accent-brand-green" />
                      World Cup 2026 Collection
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-widest text-zinc-500 mb-1">Image URLs (comma separated) *</label>
                  <input required type="text" value={newProduct.images} onChange={e => setNewProduct({...newProduct, images: e.target.value})} className="w-full border-2 border-zinc-200 focus:border-brand-green outline-none p-3 font-medium transition-colors text-zinc-950" placeholder="https://..., https://..." />
                  {newProduct.images && newProduct.images.split(',')[0] && (
                    <div className="mt-2 w-32 h-32 border-2 border-zinc-200 bg-white overflow-hidden p-2">
                       <img src={getImageUrl(newProduct.images.split(',')[0].trim())} alt="Preview" className="w-full h-full object-contain grayscale" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-widest text-zinc-500 mb-1">Description</label>
                  <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full border-2 border-zinc-200 focus:border-brand-green outline-none p-3 font-medium transition-colors resize-none h-24 text-zinc-950" placeholder="Product details..."></textarea>
                </div>

                <div>
                  <label className="block text-sm font-heading font-bold uppercase tracking-widest text-brand-green mb-2">Initial Stock</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <div key={size}>
                        <label className="block text-xs font-bold text-zinc-500 mb-1 text-center font-heading">{size}</label>
                        <input type="number" min="0" value={newProduct[`stock${size}` as keyof typeof newProduct] as number} onChange={e => setNewProduct({...newProduct, [`stock${size}`]: parseInt(e.target.value) || 0})} className="w-full border-2 border-zinc-200 focus:border-brand-green outline-none p-2 text-center font-mono transition-colors text-zinc-950 font-bold" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t-2 border-zinc-100">
                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit">Deploy Product</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
