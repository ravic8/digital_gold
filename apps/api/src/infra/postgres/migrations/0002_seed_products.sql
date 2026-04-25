INSERT INTO products (
  id,
  name,
  category,
  price_min,
  price_max,
  purity,
  weight_grams,
  styles,
  occasions,
  images,
  description
) VALUES
(
  'DG-NK-1001',
  'Temple Heritage Necklace',
  'necklace',
  185000,
  225000,
  '22k',
  42,
  ARRAY['traditional', 'temple'],
  ARRAY['wedding', 'festival'],
  ARRAY['https://example.com/products/DG-NK-1001-1.jpg'],
  'Traditional temple-inspired necklace with antique finish.'
),
(
  'DG-RG-2201',
  'Floral Gold Ring',
  'ring',
  28000,
  36000,
  '22k',
  6.2,
  ARRAY['floral', 'modern'],
  ARRAY['engagement', 'casual'],
  ARRAY['https://example.com/products/DG-RG-2201-1.jpg'],
  'Floral motif ring for daily elegance and gifting.'
)
ON CONFLICT (id) DO NOTHING;
