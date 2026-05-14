'use client';
import { useEffect, useState } from 'react';
import type { ProductStatus } from '@/lib/types/admin';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, Plus, X, AlertCircle, CheckCircle2, Tag, Package, DollarSign, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

const tabs = ['Basic Info', 'Pricing', 'Inventory', 'SEO'];

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';
  const [fileInputKey, setFileInputKey] = useState(0);

  const [activeTab, setActiveTab] = useState(0);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [compareAt, setCompareAt] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('sarees');
  const [status, setStatus] = useState<ProductStatus>('Draft');
  const [shortDesc, setShortDesc] = useState('');
  const [about, setAbout] = useState('');
  const [details, setDetails] = useState<string[]>([]);
  const [detailInput, setDetailInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [weight, setWeight] = useState('');
  const [imagePreview, setImagePreview] = useState('/images/hero_banner_1773723337466.png');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    apiFetch<any>(`/products/${id}`).then((product) => {
      setName(product.name);
      setPrice(String(product.price));
      setCompareAt(String(product.compareAtPrice ?? ''));
      setStock(String(product.stock));
      setSku(product.sku);
      setCategory(product.category);
      setStatus(product.status);
      setShortDesc(product.shortDesc ?? '');
      setAbout(product.about ?? '');
      setDetails(product.details ?? []);
      setTags(product.tags ?? []);
      setWeight(product.weight ?? '');
      setImagePreview(product.image);
      setMetaTitle(product.name);
      setMetaDesc(product.shortDesc ?? '');
      setSlug(product.slug ?? '');
    }).catch(() => toast.error('Failed to load product'));
  }, [id, isNew]);

  const handleSave = async () => {
    if (!name || !price || !sku) {
      toast.error('Name, price, and SKU are required');
      return;
    }

    const payload = {
      name,
      category,
      price: Number(price),
      compareAtPrice: compareAt ? Number(compareAt) : undefined,
      stock: Number(stock || 0),
      status,
      image: imagePreview,
      images: [imagePreview],
      sku,
      sold: 0,
      shortDesc,
      about,
      details,
      tags,
      weight,
    };

    setIsSaving(true);
    try {
      await apiFetch(isNew ? '/products' : `/products/${id}`, {
        method: isNew ? 'POST' : 'PATCH',
        body: JSON.stringify(payload),
      });
      toast.success(isNew ? 'Product created' : 'Product saved');
      router.push('/admin/products');
    } catch {
      toast.error('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags((items) => [...items, tagInput.trim()]);
      setTagInput('');
    }
  };

  const addDetail = () => {
    if (detailInput) {
      setDetails((items) => [...items, detailInput.trim()]);
      setDetailInput('');
    }
  };

  const removeTag = (tag: string) => setTags((items) => items.filter((item) => item !== tag));
  const removeDetail = (detail: string) => setDetails((items) => items.filter((item) => item !== detail));
  const discount = price && compareAt ? Math.round((1 - Number(price) / Number(compareAt)) * 100) : 0;
  const isComplete = name && price && sku && stock;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
      }
    };
    reader.onerror = () => toast.error('Failed to read image');
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/admin/products')} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{isNew ? 'Add New Product' : 'Edit Product'}</h1>
          <p className="text-slate-500 text-xs mt-0.5">{isNew ? 'Fill in details and publish when ready' : `Editing: ${name}`}</p>
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="flex items-center gap-1 text-emerald-400 text-xs bg-emerald-400/10 px-2.5 py-1 rounded-full font-semibold">
              <CheckCircle2 size={12} /> Ready to publish
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 text-xs bg-amber-400/10 px-2.5 py-1 rounded-full font-semibold">
              <AlertCircle size={12} /> Incomplete
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1">
        {tabs.map((tab, index) => (
          <button key={tab} onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${activeTab === index ? 'bg-purple-600 text-white' : 'bg-white/[0.04] text-slate-400 hover:text-white'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 0 && (
            <>
              <Card title="Core Details" icon={<Package size={14} />}>
                <Field label="Product Name *">
                  <TextInput value={name} onChange={(value) => { setName(value); setSlug(value.toLowerCase().replace(/\s+/g, '-')); setMetaTitle(value); }} placeholder="e.g. Royal Red Banarasi Saree" />
                </Field>
                <Field label="Short Description">
                  <textarea value={shortDesc} onChange={(e) => { setShortDesc(e.target.value); setMetaDesc(e.target.value); }} rows={3}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 resize-none transition-colors" />
                </Field>
                <Field label="About">
                  <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={4}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 resize-none transition-colors" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="SKU *"><TextInput value={sku} onChange={setSku} placeholder="SKU-SAR-001" /></Field>
                  <Field label="Category">
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
                      <option value="sarees">Sarees</option>
                      <option value="lehengas">Lehengas</option>
                      <option value="kurtas">Kurtas</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </Field>
                </div>
              </Card>

              <Card title="Tags" icon={<Tag size={14} />}>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
                  <button onClick={addTag} className="bg-purple-600 hover:bg-purple-500 text-white p-2.5 rounded-xl transition-colors"><Plus size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1.5 bg-purple-500/15 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-lg text-xs font-medium">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors"><X size={11} /></button>
                    </span>
                  ))}
                </div>
              </Card>

              <Card title="Details" icon={<Tag size={14} />}>
                <div className="flex gap-2">
                  <input value={detailInput} onChange={(e) => setDetailInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDetail())}
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
                  <button onClick={addDetail} className="bg-purple-600 hover:bg-purple-500 text-white p-2.5 rounded-xl transition-colors"><Plus size={16} /></button>
                </div>
                <div className="space-y-2 mt-2">
                  {details.map((detail) => (
                    <div key={detail} className="flex items-center justify-between bg-white/[0.03] rounded-xl px-3 py-2 text-xs text-slate-300">
                      <span>{detail}</span>
                      <button onClick={() => removeDetail(detail)}><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {activeTab === 1 && (
            <Card title="Pricing Details" icon={<DollarSign size={14} />}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Selling Price (Rs) *"><TextInput type="number" value={price} onChange={setPrice} placeholder="12500" /></Field>
                <Field label="Compare-at Price (Rs)"><TextInput type="number" value={compareAt} onChange={setCompareAt} placeholder="15000" /></Field>
              </div>
              {discount > 0 && <div className="text-emerald-300 text-sm font-semibold">{discount}% discount will be displayed</div>}
            </Card>
          )}

          {activeTab === 2 && (
            <Card title="Inventory & Status" icon={<BarChart3 size={14} />}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Stock Count *"><TextInput type="number" value={stock} onChange={setStock} placeholder="0" /></Field>
                <Field label="Weight (grams)"><TextInput type="number" value={weight} onChange={setWeight} placeholder="500" /></Field>
              </div>
              <Field label="Visibility Status">
                <div className="grid grid-cols-3 gap-2">
                  {(['Active', 'Draft', 'Archived'] as ProductStatus[]).map((entry) => (
                    <button key={entry} onClick={() => setStatus(entry)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${status === entry ? 'bg-purple-600 text-white border-purple-500/30' : 'bg-white/[0.04] text-slate-500 border-white/[0.07] hover:text-white'}`}>
                      {entry}
                    </button>
                  ))}
                </div>
              </Field>
            </Card>
          )}

          {activeTab === 3 && (
            <Card title="SEO & Metadata" icon={<Tag size={14} />}>
              <Field label="URL Slug"><TextInput value={slug} onChange={setSlug} /></Field>
              <Field label="Meta Title"><TextInput value={metaTitle} onChange={setMetaTitle} /></Field>
              <Field label="Meta Description">
                <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={3}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 resize-none transition-colors" />
              </Field>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 space-y-3">
            <div className="text-xs font-semibold text-white flex items-center gap-2"><Upload size={13} className="text-purple-400" /> Product Image</div>
            <label className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer block hover:border-purple-500/40 transition-colors">
              <input
                key={fileInputKey}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded-xl mb-3" />
              <p className="text-slate-500 text-xs">Click to choose a product image from your device</p>
            </label>
            <button
              type="button"
              onClick={() => { setImagePreview('/images/hero_banner_1773723337466.png'); setFileInputKey((key) => key + 1); }}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Reset to default catalog image
            </button>
          </div>

          <div className="space-y-2">
            <button onClick={handleSave} disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-900/20 disabled:opacity-70">
              {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={14} /> {isNew ? 'Create Product' : 'Save Changes'}</>}
            </button>
            <button onClick={() => router.push('/admin/products')}
              className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] text-slate-400 font-semibold text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-4">
      <h2 className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">{icon} {title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
  );
}

const selectCls = 'w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors';
