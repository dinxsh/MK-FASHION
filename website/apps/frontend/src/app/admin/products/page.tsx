'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Product, ProductStatus } from '@/lib/types/admin';
import { Search, Plus, Pencil, Trash2, Copy, SlidersHorizontal, TrendingUp, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const STATUS_STYLES: Record<ProductStatus, string> = {
  Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Draft: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  Archived: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
};

const CATEGORIES = ['All', 'sarees', 'lehengas', 'kurtas', 'accessories'];
const STATUSES: Array<ProductStatus | 'All'> = ['All', 'Active', 'Draft', 'Archived'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'All'>('All');
  const [selected, setSelected] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'sold'>('sold');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  useEffect(() => {
    apiFetch<Product[]>('/products').then(setProducts).catch(() => toast.error('Failed to load products'));
  }, []);

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'All' || p.category === catFilter;
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    })
    .sort((a, b) => {
      const v = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'name') return v * a.name.localeCompare(b.name);
      if (sortBy === 'price') return v * (a.price - b.price);
      if (sortBy === 'stock') return v * (a.stock - b.stock);
      return v * (a.sold - b.sold);
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const toggle = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map((p) => p.id));

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      setProducts((current) => current.filter((item) => item.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleBulkArchive = async () => {
    try {
      await Promise.all(selected.map((id) => {
        const product = products.find((entry) => entry.id === id);
        if (!product) return Promise.resolve();
        return apiFetch(`/products/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ ...product, status: 'Archived' }),
        });
      }));
      setProducts((current) => current.map((item) => selected.includes(item.id) ? { ...item, status: 'Archived' } : item));
      setSelected([]);
      toast.success('Products archived');
    } catch {
      toast.error('Bulk archive failed');
    }
  };

  const activeCount = products.filter((p) => p.status === 'Active').length;
  const draftCount = products.filter((p) => p.status === 'Draft').length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const totalRevenue = products.reduce((sum, p) => sum + p.sold * p.price, 0);

  const SortIcon = ({ col }: { col: typeof sortBy }) => (
    <span className={`ml-1 text-[9px] ${sortBy === col ? 'text-purple-400' : 'text-slate-700'}`}>
      {sortBy === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{products.length} items in catalog</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-purple-900/20 w-fit">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active', value: activeCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Drafts', value: draftCount, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Out of Stock', value: outOfStock, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Total Revenue', value: `Rs ${(totalRevenue / 100000).toFixed(1)}L`, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center`}>
              <TrendingUp size={14} className={s.color} />
            </div>
            <div>
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-slate-600 text-[10px] font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name or SKU..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-8 pr-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <SlidersHorizontal size={13} className="text-slate-600" />
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => { setCatFilter(c); setPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${catFilter === c ? 'bg-purple-600 text-white' : 'bg-white/[0.04] text-slate-400 hover:text-white'}`}>
              {c === 'All' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${statusFilter === s ? 'bg-purple-600 text-white' : 'bg-white/[0.04] text-slate-400 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="flex items-center gap-3 bg-purple-600/10 border border-purple-500/20 rounded-xl px-4 py-2.5">
          <span className="text-purple-300 text-sm font-semibold">{selected.length} selected</span>
          <div className="w-px h-4 bg-white/10" />
          <button onClick={handleBulkArchive} className="text-amber-400 hover:text-amber-300 text-xs font-medium transition-colors">Archive</button>
        </div>
      )}

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-500 text-[10px] uppercase tracking-wider">
                <th className="pl-4 pr-2 py-3 w-8">
                  <input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0}
                    onChange={toggleAll} className="accent-purple-500 w-4 h-4 cursor-pointer rounded" />
                </th>
                <th className="py-3 text-left font-semibold">Product</th>
                <th className="py-3 text-left font-semibold hidden md:table-cell">Category</th>
                <th className="py-3 text-left font-semibold cursor-pointer" onClick={() => handleSort('price')}>Price <SortIcon col="price" /></th>
                <th className="py-3 text-left font-semibold cursor-pointer hidden sm:table-cell" onClick={() => handleSort('stock')}>Stock <SortIcon col="stock" /></th>
                <th className="py-3 text-left font-semibold">Status</th>
                <th className="py-3 text-left font-semibold cursor-pointer hidden lg:table-cell" onClick={() => handleSort('sold')}>Sold <SortIcon col="sold" /></th>
                <th className="py-3 text-right pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${selected.includes(p.id) ? 'bg-purple-600/5' : ''}`}>
                  <td className="pl-4 pr-2 py-3">
                    <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} className="accent-purple-500 w-4 h-4 cursor-pointer" />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover shrink-0 bg-white/5" />
                      <div>
                        <div className="text-white font-semibold text-sm leading-tight">{p.name}</div>
                        <div className="text-slate-600 text-[10px] font-mono mt-0.5">{p.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 hidden md:table-cell">
                    <span className="bg-white/5 text-slate-400 text-[11px] px-2 py-0.5 rounded-md capitalize">{p.category}</span>
                  </td>
                  <td className="py-3">
                    <div className="text-white font-semibold text-sm">Rs {p.price.toLocaleString()}</div>
                    {p.compareAtPrice && <div className="text-slate-600 text-[10px] line-through">Rs {p.compareAtPrice.toLocaleString()}</div>}
                  </td>
                  <td className="py-3 hidden sm:table-cell">
                    {p.stock === 0 ? (
                      <span className="flex items-center gap-1 text-red-400 text-xs"><AlertCircle size={11} /> Out of stock</span>
                    ) : p.stock <= 5 ? (
                      <span className="text-amber-400 text-xs font-semibold">{p.stock} left</span>
                    ) : (
                      <span className="text-slate-400 text-xs">{p.stock}</span>
                    )}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${STATUS_STYLES[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="py-3 hidden lg:table-cell">
                    <span className="text-slate-400 text-xs">{p.sold}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/admin/products/${p.id}`} className="p-1.5 rounded-lg text-slate-600 hover:text-purple-400 hover:bg-purple-500/10 transition-colors">
                        <Pencil size={13} />
                      </Link>
                      <button className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors" onClick={() => handleDelete(p.id)}>
                        <Trash2 size={13} />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors" onClick={() => toast('Use edit to duplicate if needed')}>
                        <Copy size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={8} className="py-16 text-center text-slate-600 text-sm">No products match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
