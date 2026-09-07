import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category', title: 'Categories', type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() }),
  ],
});

export const product = defineType({
  name: 'product', title: 'Products', type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() }),
    defineField({ name: 'price', title: 'Price (INR)', type: 'number', validation: r => r.required().min(0) }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'category', type: 'reference', to: [{ type: 'category' }], validation: r => r.required() }),
    defineField({ name: 'images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], validation: r => r.required().min(1) }),
    defineField({ name: 'stock', type: 'number', initialValue: 0, validation: r => r.required().integer().min(0) }),
    defineField({ name: 'active', title: 'Show in storefront', type: 'boolean', initialValue: true }),
  ],
  preview: { select: { title: 'name', media: 'images.0' } },
});

export const storeSettings = defineType({
  name: 'storeSettings', title: 'Store settings', type: 'document',
  fields: [
    defineField({ name: 'whatsappNumber', title: 'WhatsApp number', description: 'Include country code, for example 919876543210.', type: 'string', validation: r => r.required().regex(/^\+?[1-9]\d{6,14}$/) }),
  ],
  preview: { prepare: () => ({ title: 'Store settings' }) },
});
