'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ApiProduct, deleteProduct, getAdminProducts } from '@/lib/adminApi';

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      setProducts(await getAdminProducts());
      window.dispatchEvent(new Event('admin-products-changed'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadProducts(); }, []);

  const remove = async (product: ApiProduct) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    try {
      await deleteProduct(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      window.dispatchEvent(new Event('admin-products-changed'));
      toast.success('Product deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete product');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-purple-300 text-xs font-bold uppercase tracking-[0.2em]">Your store</p>
          <h1 className="text-3xl font-bold text-white mt-1">Product catalogue</h1>
          {!loading && <p className="text-sm text-purple-300 mt-2">{products.length} {products.length === 1 ? 'product' : 'products'} in your catalogue</p>}
          <p className="text-slate-400 text-sm mt-2">Add a product with a photo, price and stock in a few steps.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void loadProducts()} className="p-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10" aria-label="Refresh products"><RefreshCw size={17} className={loading ? 'animate-spin' : ''} /></button>
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/30"><Plus size={17} /> Add product</Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {loading ? <div className="p-14 text-center text-slate-400">Loading products...</div> : products.length === 0 ? (
          <div className="p-14 text-center"><p className="text-white font-semibold">Your catalogue is empty</p><p className="text-slate-400 text-sm mt-2">Create your first product to show it on the store.</p></div>
        ) : <div className="divide-y divide-white/[0.07]">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-4 sm:p-5">
              {product.images[0]?.url ? <img src={product.images[0].url} alt={product.name} className="h-16 w-14 rounded-xl bg-white/5 object-cover" /> : <div className="h-16 w-14 rounded-xl bg-white/5" />}
              <div className="min-w-0 flex-1"><p className="truncate font-semibold text-white">{product.name}</p><p className="mt-1 text-xs text-slate-500">{product.category?.name || 'Uncategorised'} · {product.sku}</p><p className="mt-1 text-sm text-emerald-400">₹{Number(product.price).toLocaleString('en-IN')} <span className="text-slate-500">· {product.inventoryItem?.availableQty ?? 0} in stock</span></p></div>
              <span className="hidden sm:block rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">{product.status}</span>
              <Link href={`/admin/products/${product.id}`} className="rounded-lg p-2 text-slate-400 hover:bg-purple-500/15 hover:text-purple-300" aria-label={`Edit ${product.name}`}><Pencil size={16} /></Link>
              <button onClick={() => void remove(product)} className="rounded-lg p-2 text-slate-400 hover:bg-red-500/15 hover:text-red-300" aria-label={`Delete ${product.name}`}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}
