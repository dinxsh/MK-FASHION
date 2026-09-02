'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ImagePlus, Loader2, Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { ApiProduct, createProduct, getAdminProducts, ProductInput, updateProduct, uploadProductImage } from '@/lib/adminApi';

const emptyProduct: ProductInput = { name: '', price: 0, category: 'Kurtis', imageUrl: '', description: '', inStock: 0 };
const inputClass = 'w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-400';

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';
  const [product, setProduct] = useState<ProductInput>(emptyProduct);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isNew) return;
    const loadProduct = async () => {
      try {
        const existing = (await getAdminProducts()).find((item) => item.id === id);
        if (!existing) throw new Error('Product not found');
        setProduct(fromApiProduct(existing));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Could not load product');
        router.push('/admin/products');
      } finally { setLoading(false); }
    };
    void loadProduct();
  }, [id, isNew, router]);

  const change = (field: keyof ProductInput, value: string | number) => setProduct((current) => ({ ...current, [field]: value }));

  const chooseImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { const { imageUrl } = await uploadProductImage(file); change('imageUrl', imageUrl); toast.success('Image uploaded'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Image upload failed'); }
    finally { setUploading(false); }
  };

  const save = async () => {
    if (!product.name.trim() || product.price <= 0 || !product.category.trim() || !product.imageUrl) { toast.error('Add a name, price, category and image first'); return; }
    setSaving(true);
    try { if (isNew) await createProduct(product); else await updateProduct(id, product); toast.success(isNew ? 'Product created' : 'Product updated'); router.push('/admin/products'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Could not save product'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-10 text-slate-400">Loading product...</div>;
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button onClick={() => router.push('/admin/products')} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16} /> Back to products</button>
      <div><p className="text-purple-300 text-xs font-bold uppercase tracking-[0.2em]">Catalogue editor</p><h1 className="mt-1 text-3xl font-bold text-white">{isNew ? 'Add a product' : 'Edit product'}</h1></div>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <Field label="Product name"><input value={product.name} onChange={(e) => change('name', e.target.value)} placeholder="Blue Cotton Kurti" className={inputClass} /></Field>
          <div className="grid grid-cols-2 gap-4"><Field label="Price (₹)"><input type="number" min="0" value={product.price || ''} onChange={(e) => change('price', Number(e.target.value))} className={inputClass} /></Field><Field label="Stock"><input type="number" min="0" value={product.inStock || ''} onChange={(e) => change('inStock', Number(e.target.value))} className={inputClass} /></Field></div>
          <Field label="Category"><input value={product.category} onChange={(e) => change('category', e.target.value)} placeholder="Kurtis" className={inputClass} /></Field>
          <Field label="Description"><textarea value={product.description} onChange={(e) => change('description', e.target.value)} rows={5} placeholder="Describe the fabric, fit and occasion..." className={`${inputClass} resize-none`} /></Field>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><p className="flex items-center gap-2 text-sm font-bold text-white"><ImagePlus size={16} className="text-purple-300" /> Product photo</p><div className="mt-4 aspect-[4/5] overflow-hidden rounded-2xl border border-dashed border-white/15 bg-[#0b0315]">{product.imageUrl ? <img src={product.imageUrl} alt="Product preview" className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center text-slate-500"><ImagePlus size={28} /><span className="mt-2 text-sm">Choose an image</span></div>}</div><label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">{uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}{uploading ? 'Uploading...' : 'Upload image'}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseImage} disabled={uploading} className="hidden" /></label><p className="mt-2 text-center text-xs text-slate-500">JPG, PNG or WebP. Maximum 5MB.</p></section>
      </div>
      <button onClick={() => void save()} disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3 font-bold text-white shadow-lg shadow-purple-900/30 disabled:opacity-60">{saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}{saving ? 'Saving...' : isNew ? 'Create product' : 'Save changes'}</button>
    </div>
  );
}

function fromApiProduct(product: ApiProduct): ProductInput { return { name: product.name, price: Number(product.price), category: product.category?.name || '', imageUrl: product.images[0]?.url || '', description: product.description || '', inStock: product.inventoryItem?.availableQty || 0 }; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-medium text-slate-300"><span className="mb-2 block">{label}</span>{children}</label>; }
