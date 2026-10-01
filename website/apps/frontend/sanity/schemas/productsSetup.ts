import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'productsSetup',
  title: 'Products setup',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section title',
      type: 'string',
      initialValue: 'Featured products',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Section description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'featuredCategory',
      title: 'Featured category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'emptyStateMessage',
      title: 'Empty state message',
      type: 'string',
      initialValue: 'Products are being updated. Please check back soon.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
});
