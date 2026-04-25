# API Surface (Phase 1 Skeleton)

## Health
- `GET /api/health`

## Catalog
- `GET /api/catalog/products`
- `GET /api/catalog/products/:id`

Query params (optional):
- `category`
- `purity`
- `style`
- `q`
- `minPrice`
- `maxPrice`

## Leads
- `GET /api/leads`
- `POST /api/leads`

POST payload:
```json
{
  "name": "Aarav",
  "phone": "+91XXXXXXXXXX",
  "productId": "DG-NK-1001",
  "message": "Need bridal options under 2.5L",
  "source": "web"
}
```

## Bookings
- `GET /api/bookings`
- `POST /api/bookings`

POST payload:
```json
{
  "name": "Aarav",
  "phone": "+91XXXXXXXXXX",
  "date": "2026-03-10",
  "slot": "11:00-11:30",
  "notes": "Bridal set consultation"
}
```

## AI Recommendations
- `POST /api/ai/recommendations`

POST payload:
```json
{
  "prompt": "Suggest traditional bridal necklace",
  "budgetMin": 150000,
  "budgetMax": 250000,
  "category": "necklace"
}
```

## Admin Catalog (Phase 3)
- `POST /api/admin/catalog/products`
- `PATCH /api/admin/catalog/products/:id`
- `DELETE /api/admin/catalog/products/:id`

Create payload:
```json
{
  "id": "DG-BG-9001",
  "name": "Heritage Bridal Bangles",
  "category": "bangle",
  "priceMin": 120000,
  "priceMax": 165000,
  "purity": "22k",
  "weightGrams": 28.5,
  "styles": ["bridal", "traditional"],
  "occasions": ["wedding"],
  "images": ["https://example.com/products/DG-BG-9001-1.jpg"],
  "description": "Pair of heritage bridal bangles."
}
```

Patch payload example:
```json
{
  "priceMax": 170000,
  "styles": ["bridal", "temple"]
}
```
